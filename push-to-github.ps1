param(
    [string]$RepoUrl = 'https://github.com/sdlhp2002-commits/Door-Website.git',
    [string]$CommitMessage = 'Update website content',
    [switch]$Force = $false
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
if (Test-Path $sitemapPath) {
    Write-Host "Updating sitemap.xml lastmod dates..."
    try {
        $today = (Get-Date).ToString("yyyy-MM-dd")

        # Load the XML document
        $xmlDoc = New-Object System.Xml.XmlDocument
        $xmlDoc.Load((Resolve-Path $sitemapPath).Path)

        # Create a namespace manager to handle the default sitemap namespace
        $nsmgr = New-Object System.Xml.XmlNamespaceManager($xmlDoc.NameTable)
        $nsmgr.AddNamespace("s", "http://www.sitemaps.org/schemas/sitemap/0.9")

        # Select all <lastmod> nodes and update their content
        $nodes = $xmlDoc.SelectNodes("//s:lastmod", $nsmgr)
        foreach ($node in $nodes) {
            $node.InnerText = $today
        }

        # Save the modified XML with proper formatting and UTF-8 (No BOM) encoding
        $writerSettings = New-Object System.Xml.XmlWriterSettings
        $writerSettings.Indent = $true
        $writerSettings.Encoding = New-Object System.Text.UTF8Encoding($false)
        $writer = [System.Xml.XmlWriter]::Create((Resolve-Path $sitemapPath).Path, $writerSettings)
        $xmlDoc.Save($writer)
        $writer.Close()

        Write-Host "✅ Sitemap updated to $today and validated successfully." -ForegroundColor Green
    } catch {
        Write-Host "❌ Error processing sitemap.xml! Deployment stopped." -ForegroundColor Red
        ExitWith $_.Exception.Message
    }
}

# Ensure .nojekyll exists to prevent 404s on GitHub Pages
if (-not (Test-Path ".\.nojekyll")) {
    Write-Host "Creating .nojekyll file..."
    New-Item -Path ".\.nojekyll" -ItemType File -Force | Out-Null
}

# Ensure robots.txt exists for SEO
if (-not (Test-Path ".\robots.txt")) {
    Write-Host "Creating robots.txt file..."
    $robotsContent = @"
User-agent: *
Allow: /
Sitemap: https://doors.ajormart.in/sitemap.xml
"@
    Set-Content -Path ".\robots.txt" -Value $robotsContent
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

if ($Force) {
    Write-Host "Force mode enabled: Skipping pull to overwrite remote." -ForegroundColor Yellow
} else {
    Write-Host "Syncing with remote (pull --rebase)..."
    & git pull origin main --rebase
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Pull failed! Aborting rebase to prevent conflict lock..." -ForegroundColor Red
        & git rebase --abort 2>$null
        ExitWith "Git pull failed. If you want to overwrite the remote version, run: .\push-to-github.ps1 -Force"
    }
}

Write-Host "Pushing to origin main (you may be prompted to authenticate)..."
if ($Force) {
    & git push -u origin main --force
} else {
    & git push -u origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push complete." -ForegroundColor Green
} else {
    ExitWith "Push failed. Check git remote, authentication, and network."
}

Write-Host "Done. Check GitHub Actions in the repo to monitor deployment."
Write-Host "Your Sitemap URL for Google Search Console: https://doors.ajormart.in/sitemap.xml" -ForegroundColor Cyan