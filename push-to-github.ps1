param(
    [string]$RepoUrl = 'https://github.com/sdlhp2002-commits/Door-Website.git',
    [string]$CommitMessage = 'Update website content'
)

function ExitWith($msg) {
    Write-Host $msg -ForegroundColor Red
    exit 1
}

Write-Host "push-to-github.ps1 starting..."

# Check for incorrect system clock (Common cause of SSL errors)
$currentYear = (Get-Date).Year
if ($currentYear -gt 2025) {
    Write-Host "⚠️  CRITICAL WARNING: Your computer date is set to $currentYear!" -ForegroundColor Red
    Write-Host "   This causes SSL errors. Disabling Git SSL verification for this session to allow push." -ForegroundColor Yellow
    $env:GIT_SSL_NO_VERIFY = 'true'
}

# Check for git
try {
    $gv = & git --version 2>$null
    if (-not $gv) { throw "git-missing" }
    Write-Host "Found git: $gv"
} catch {
    ExitWith "Git not found. Please install Git for Windows (https://git-scm.com/) and ensure it's on PATH."
}

# Show working directory
$cwd = Get-Location
Write-Host "Working directory: $cwd"

# Initialize repo if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..."
    & git init
} else {
    Write-Host ".git already exists"
}

# Configure remote
try {
    & git remote remove origin 2>$null
} catch { }

Write-Host "Setting remote origin to $RepoUrl"
try {
    & git remote add origin $RepoUrl
} catch {
    Write-Host "Failed to add remote origin. It may already exist. Continuing."
}

# Generate dynamic sitemap.xml
$sitemapPath = ".\sitemap.xml"
Write-Host "Generating sitemap.xml..."
$baseUrl = "https://doors.ajormart.in"
$dateObj = Get-Date
if ($dateObj.Year -gt 2025) { $today = "2025-01-01" } else { $today = $dateObj.ToString("yyyy-MM-dd") }

$xmlContent = "<?xml version=`"1.0`" encoding=`"UTF-8`"?>`n"
$xmlContent += "<urlset xmlns=`"http://www.sitemaps.org/schemas/sitemap/0.9`">`n"

# 1. Add Static Pages
$staticPages = @("", "about.html", "product.html", "gallery.html", "contact.html")
foreach ($page in $staticPages) {
    $prio = if ($page -eq "") { "1.0" } else { "0.8" }
    $loc = if ($page -eq "") { "$baseUrl/" } else { "$baseUrl/$page" }
    $xmlContent += "  <url><loc>$loc</loc><lastmod>$today</lastmod><priority>$prio</priority></url>`n"
}

# 2. Extract Products from index.html (and product.html if available)
$productIds = @{}
$filesToScan = @("index.html", "product.html")
foreach ($file in $filesToScan) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $matches = [regex]::Matches($content, 'href=["'']product-details\.html\?id=([^"''\s>]+)["'']')
        foreach ($m in $matches) {
            $id = $m.Groups[1].Value
            if (-not $productIds.ContainsKey($id)) {
                $productIds[$id] = $true
                $xmlContent += "  <url><loc>$baseUrl/product-details.html?id=$id</loc><lastmod>$today</lastmod><priority>0.8</priority></url>`n"
            }
        }
    }
}

$xmlContent += "</urlset>"

# Write with UTF-8 No BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\sitemap.xml", $xmlContent, $utf8NoBom)
Write-Host "Sitemap generated with $($productIds.Count) products."

# Validate XML syntax locally
try {
    [xml]$check = Get-Content $sitemapPath
    Write-Host "✅ Sitemap XML syntax is valid." -ForegroundColor Green
} catch {
    Write-Host "❌ Sitemap XML syntax is INVALID!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1 # Stop deployment if sitemap is broken
}

# Ensure .nojekyll exists to prevent 404s on GitHub Pages
if (-not (Test-Path ".\.nojekyll")) {
    Write-Host "Creating .nojekyll file..."
    New-Item -Path ".\.nojekyll" -ItemType File -Force | Out-Null
}

# Ensure robots.txt exists and points to Sitemap (Crucial for SEO)
$robotsPath = ".\robots.txt"
$sitemapLine = "Sitemap: https://doors.ajormart.in/sitemap.xml"
if (-not (Test-Path $robotsPath)) {
    Write-Host "Creating robots.txt for SEO..."
    $robotsContent = "User-agent: *`r`nAllow: /`r`n$sitemapLine"
    [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\robots.txt", $robotsContent, [System.Text.Encoding]::UTF8)
} elseif ((Get-Content $robotsPath -Raw) -notmatch "Sitemap:") {
    Add-Content -Path $robotsPath -Value "`r`n$sitemapLine"
    Write-Host "Updated robots.txt with Sitemap link."
}

# Check for CNAME if sitemap uses custom domain (Prevents broken SEO links)
$sitemapContent = Get-Content ".\sitemap.xml" -Raw
if ($sitemapContent -match "doors.ajormart.in" -and -not (Test-Path ".\CNAME")) {
    Write-Host "Creating CNAME file for custom domain 'doors.ajormart.in'..."
    Set-Content -Path ".\CNAME" -Value "doors.ajormart.in" -Encoding UTF8
}

# Stage and commit
Write-Host "Staging files..."
& git add .

Write-Host "Committing..."
try {
    & git commit -m "$CommitMessage"
} catch {
    Write-Host "Nothing to commit or commit failed (this is OK)."
}

Write-Host "Ensuring branch is 'main'"
try {
    & git branch -M main
} catch {
    Write-Host "Rename branch failed (may already be main)."
}

Write-Host "Syncing with remote (pull --rebase)..."
& git pull origin main --rebase

Write-Host "Pushing to origin main (you may be prompted to authenticate)..."
& git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push complete." -ForegroundColor Green
} else {
    ExitWith "Push failed. Check git remote, authentication, and network."
}

Write-Host "Done. Check GitHub Actions in the repo to monitor deployment."
Write-Host "Your Sitemap URL for Google Search Console: https://doors.ajormart.in/sitemap.xml" -ForegroundColor Cyan
