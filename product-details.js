// Helper: get product id from query string
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Render the product specs into a table
function renderSpecs(specs) {
    let html = "";
    // Note: Ensure your PRODUCTS.js data uses the format { Thickness: "30mm", Height: "81\"" }
    for (const [key, value] of Object.entries(specs)) {
        html += `<tr><th>${key}</th><td>${value}</td></tr>`;
    }
    return html;
}

// Render features as list
function renderFeatures(features) {
    // Note: Ensure your PRODUCTS.js data features is an array of strings ["Anti termite.", "Waterproof."]
    return features.map(f => `<li>${f}</li>`).join('');
}

// Function to handle the image swap and 'selected' styling
function swapMainImage(newSrc, clickedThumbnail) {
    const mainImage = document.getElementById('main-door-image');
    mainImage.src = newSrc;

    // Remove 'selected' class from all thumbnails
    document.querySelectorAll('.product-thumb').forEach(img => {
        img.classList.remove('selected');
    });

    // Add 'selected' class to the clicked thumbnail
    if (clickedThumbnail) {
        clickedThumbnail.classList.add('selected');
    }
}

// Product lookup & rendering
window.onload = function () {
    const productId = getProductId();
    // Assuming PRODUCTS is defined in products-data.js
    const product = PRODUCTS.find(p => p.id === productId);

    // ----------------------
    // 1. Initial Checks
    // ----------------------
    if (!product || !PRODUCTS) {
        document.body.innerHTML = "<div style='text-align:center; margin-top:80px'><h2>Product Not Found</h2><a href='index.html'>Back to Home</a></div>";
        return;
    }

    // ----------------------
    // 2. Data Population
    // ----------------------
    const pageTitle = `${product.name} | Ajor Doors Manufacturer in Bengaluru`;
    const pageDescription = `Discover the ${product.name} from Ajor Doors, Bengaluru. ${product.shortDescription} View specifications, features, and designs.`;
    const absoluteImageUrl = new URL(product.mainImage, window.location.href).href;

    // Update Title & Meta Description
    document.title = pageTitle;
    document.getElementById('meta-description').setAttribute('content', pageDescription);

    // Update Open Graph (WhatsApp/Facebook) meta tags
    document.getElementById('og-title').setAttribute('content', pageTitle);
    document.getElementById('og-description').setAttribute('content', pageDescription);
    document.getElementById('og-image').setAttribute('content', absoluteImageUrl);
    document.getElementById('og-url').setAttribute('content', window.location.href);

    // Update Canonical URL
    document.querySelector("link[rel='canonical']").setAttribute('href', window.location.href);

    // Inject Product Schema for Rich Results
    injectProductSchema(product, absoluteImageUrl);

    // Fill hero/breadcrumb
    document.getElementById("breadcrumb-area").innerHTML =
        `<a href='index.html' style="color:var(--secondary-color)">Home</a> / <a href='product.html' style="color:var(--secondary-color)">Product</a> / ${product.name}`;
    
    // Set the main page heading (H1) for SEO
    document.getElementById("product-title").textContent = product.name;

    // Main Image
    const mainImg = document.getElementById("main-door-image");
    mainImg.src = product.mainImage || product.similarImages[0];
    mainImg.alt = product.name;
    // Optimization: Prioritize loading the main image for LCP
    mainImg.setAttribute('fetchpriority', 'high');
    mainImg.setAttribute('loading', 'eager');

    // Short desc
    document.getElementById("short-description").textContent = product.shortDescription;

    // Specifications
    document.getElementById("spec-table").innerHTML = renderSpecs(product.specifications);

    // Features
    document.getElementById("product-features").innerHTML = renderFeatures(product.features);

    // Warranty & Maintenance (New)
    if(product.warranty) document.getElementById("product-warranty").textContent = product.warranty;
    if(product.maintenance) document.getElementById("product-maintenance").textContent = product.maintenance;

    // ----------------------
    // 3. Thumbnail Rendering & Event Handling
    // ----------------------
    const simDiv = document.getElementById("similar-images");

    // Combine mainImage and similarImages for the gallery
    const galleryImages = [product.mainImage, ...(product.similarImages || [])].filter((value, index, self) => self.indexOf(value) === index);

    simDiv.innerHTML = galleryImages
        .map((img, index) =>
            // We use 'product-thumb' class for targeting in JS, and 'selected' for styling the first one
            `<img src="${img}" data-src="${img}" class="product-thumb ${index === 0 ? 'selected' : ''}" alt="${product.name} thumbnail ${index + 1}" loading="lazy" decoding="async" width="100" height="120">`
        )
        .join('');

    // Ensure the main image is the first one in the gallery by default
    if (galleryImages.length > 0) {
        mainImg.src = galleryImages[0];
    }

    // ATTACH EVENT LISTENER FOR THUMBNAIL CLICKS with accessibility
    document.querySelectorAll('.product-thumb').forEach(thumb => {
        // Add accessibility attributes
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        
        // Click handler
        thumb.addEventListener('click', function () {
            // Use the data-src attribute for the high-res image source
            const newSrc = this.getAttribute('data-src');
            swapMainImage(newSrc, this);
        });

        // Keyboard navigation support
        thumb.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const newSrc = this.getAttribute('data-src');
                swapMainImage(newSrc, this);
            }
        });
    });

    // ----------------------
    // 4. Door Catalog Gallery Rendering
    // ----------------------
    // Filter catalog by product category on initial load
    // Product ID matches the category name in DOOR_CATALOG
    renderDoorCatalog(product.id); // Filter to show only doors from this product's category

    // ----------------------
    // 5. Smart Enquiry Button Logic
    // ----------------------
    const enquiryBtn = document.getElementById('product-enquiry-btn');
    if (enquiryBtn) {
        enquiryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to contact page with product name as a parameter
            window.location.href = `contact.html?product=${encodeURIComponent(product.name)}`;
        });
    }

    // 6. Render Frequently Bought Together
    renderFrequentlyBoughtTogether();
};

// Global variable to track current filter
let currentCategoryFilter = null;

// Function to render the door catalog gallery with optional category filter
function renderDoorCatalog(categoryFilter = null) {
    const catalogGrid = document.getElementById('door-catalog-grid');
    const catalogSection = document.querySelector('.door-catalog-section');

    if (!catalogGrid || typeof DOOR_CATALOG === 'undefined') {
        return; // Exit if catalog grid doesn't exist or DOOR_CATALOG is not defined
    }

    // Add filtering animation
    catalogGrid.classList.add('filtering');

    // Filter doors by category if filter is provided
    let doorsToShow = DOOR_CATALOG;
    if (categoryFilter) {
        doorsToShow = DOOR_CATALOG.filter(door => door.category === categoryFilter);
    }

    // Update current filter
    currentCategoryFilter = categoryFilter;

    // Remove filtering class after a short delay for smooth transition
    setTimeout(() => {
        catalogGrid.classList.remove('filtering');
    }, 300);

    // Generate HTML for each door in the catalog with lazy loading and accessibility
    catalogGrid.innerHTML = doorsToShow.map(door => `
        <div class="door-catalog-item" 
             data-image="${door.image}" 
             data-code="${door.code}" 
             data-category="${door.category}"
             role="button"
             tabindex="0"
             aria-label="View door design ${door.code}"
             aria-pressed="false">
            <div class="door-catalog-label">${door.code}</div>
            <div class="door-catalog-image-wrapper">
                <img src="${door.image}" 
                     data-src="${door.image}"
                     alt="Door Design ${door.code}" 
                     class="door-catalog-image lazy-load" 
                     loading="lazy"
                     decoding="async"
                     width="250" height="280"
                     onerror="this.src='images/logo.png'; this.alt='Image not available'; this.classList.add('error');">
                <div class="image-loading-spinner" aria-hidden="true"></div>
            </div>
        </div>
    `).join('');

    // Attach click and keyboard event listeners to catalog items
    document.querySelectorAll('.door-catalog-item').forEach(item => {
        // Click handler
        const handleCatalogClick = function () {
            const imageSrc = this.getAttribute('data-image');
            const doorCode = this.getAttribute('data-code');
            const doorCategory = this.getAttribute('data-category');

            // Update main product image with loading state
            const mainImg = document.getElementById('main-door-image');
            if (mainImg && imageSrc) {
                // Add loading class to main image
                mainImg.classList.add('loading');
                
                // Create new image to preload
                const imgPreload = new Image();
                imgPreload.onload = function() {
                    mainImg.src = imageSrc;
                    mainImg.alt = `Door Design ${doorCode}`;
                    mainImg.classList.remove('loading');
                };
                imgPreload.onerror = function() {
                    mainImg.classList.remove('loading');
                    mainImg.alt = `Door Design ${doorCode} - Image unavailable`;
                };
                imgPreload.src = imageSrc;

                // Update thumbnails to show only 4 similar images from the same category (excluding clicked image)
                updateThumbnailsWithSimilarImages(doorCategory, imageSrc);

                // Filter to show only similar doors (same category)
                renderDoorCatalog(doorCategory);

                // Update ARIA pressed state
                document.querySelectorAll('.door-catalog-item').forEach(catalogItem => {
                    catalogItem.setAttribute('aria-pressed', 'false');
                });
                this.setAttribute('aria-pressed', 'true');

                // Highlight the clicked catalog item after re-render
                setTimeout(() => {
                    document.querySelectorAll('.door-catalog-item').forEach(catalogItem => {
                        catalogItem.style.borderColor = '#f9f9f9';
                        catalogItem.style.borderWidth = '1px';
                        if (catalogItem.getAttribute('data-code') === doorCode) {
                            catalogItem.style.borderColor = 'var(--secondary-color)';
                            catalogItem.style.borderWidth = '2px';
                        }
                    });
                }, 100);

                // Scroll to main image for better UX
                mainImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        item.addEventListener('click', handleCatalogClick);
        
        // Keyboard navigation support (Enter and Space keys)
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCatalogClick.call(this);
            }
        });
    });
}

// Helper function to update thumbnails with 4 similar images from the same category (excluding clicked image)
function updateThumbnailsWithSimilarImages(category, clickedImageSrc) {
    const thumbnailsContainer = document.getElementById('similar-images');
    if (!thumbnailsContainer || typeof DOOR_CATALOG === 'undefined') return;

    // Get all images from the same category, excluding the clicked image
    const categoryImages = DOOR_CATALOG
        .filter(door => door.category === category && door.image !== clickedImageSrc)
        .map(door => door.image)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

    // Limit to 4 images maximum
    const imagesToShow = categoryImages.slice(0, 4);

    // Clear existing thumbnails
    thumbnailsContainer.innerHTML = '';

    // Create thumbnails for the 4 similar images with lazy loading
    imagesToShow.forEach((imgSrc, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.setAttribute('data-src', imgSrc);
        thumb.className = 'product-thumb';
        thumb.alt = `Similar Door Design ${index + 1}`;
        thumb.loading = "lazy";
        thumb.decoding = "async";
        thumb.width = 100;
        thumb.height = 120;
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('aria-label', `View similar door design ${index + 1}`);

        // Add click handler
        thumb.addEventListener('click', function () {
            swapMainImage(imgSrc, this);
        });

        // Keyboard navigation for thumbnails
        thumb.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                swapMainImage(imgSrc, this);
            }
        });

        thumbnailsContainer.appendChild(thumb);
    });
}

// Injects Product Schema JSON-LD into the page head for SEO
function injectProductSchema(product, absoluteImageUrl) {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": absoluteImageUrl,
        "description": product.shortDescription,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "Ajor Doors"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            // You can add price here if you have it, e.g., "price": "15000",
            "availability": "https://schema.org/InStock", // Or OutOfStock, PreOrder
            "seller": {
                "@type": "LocalBusiness",
                "name": "Ajor Doors & Interior Solutions",
                "image": new URL('images/logo.png', window.location.href).href,
                "telephone": "+91 98444 43388",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Sy No. 107, 108 & 109, Rampura Main Road, K.channasandra Village",
                    "addressLocality": "Bengaluru",
                    "addressRegion": "KA",
                    "postalCode": "560043",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "13.0279",
                    "longitude": "77.6784"
                }
            }
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2); // Pretty print for readability
    document.head.appendChild(script);
}

// Function to render "Frequently Bought Together" section
function renderFrequentlyBoughtTogether() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    // List of common accessories to recommend
    const accessories = [
        { name: "Premium Handles", image: "images/handle g.webp", url: "contact.html?product=Premium Handles" },
        { name: "Smart Digital Locks", image: "images/lock_g-removebg-preview.png", url: "contact.html?product=Digital Locks" },
        { name: "Door Stoppers", image: "images/stoper.avif", url: "contact.html?product=Door Stoppers" },
        { name: "Heavy Duty Hinges", image: "images/hings.jpg", url: "contact.html?product=Door Hinges" },
        { name: "Door Closers", image: "images/door_closer-removebg-preview.png", url: "contact.html?product=Door Closers" },
        { name: "Tower Bolts", image: "images/tower bolt.webp", url: "contact.html?product=Tower Bolts" }
    ];

    // Randomly select 3 items to display
    const selected = accessories.sort(() => 0.5 - Math.random()).slice(0, 3);

    const section = document.createElement('section');
    section.className = 'products-section freq-bought-section';
    section.innerHTML = `
        <div class="section-content">
            <h2 class="section-title">Frequently Bought Together</h2>
            <div class="products-grid">
                ${selected.map(item => `
                    <div class="products">
                        <a href="${item.url}">
                            <img src="${item.image}" alt="${item.name}" class="Products-image" loading="lazy" onerror="this.src='images/logo.png'">
                            <h3 class="name">${item.name}</h3>
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    mainElement.appendChild(section);
}