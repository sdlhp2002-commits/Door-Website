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
    if (!mainImage || !newSrc) return;

    mainImage.classList.add('loading');
    const imgPreload = new Image();
    imgPreload.onload = () => {
        mainImage.src = newSrc;
        mainImage.classList.remove('loading');
    };
    imgPreload.onerror = () => {
        mainImage.classList.remove('loading'); // Still remove loading on error
    };
    imgPreload.src = newSrc;

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
document.addEventListener('DOMContentLoaded', function () {
    const productId = getProductId();
    // Assuming PRODUCTS is defined in products-data.js
    const product = PRODUCTS.find(p => p.id === productId);

    // ----------------------
    // 1. Initial Checks
    // ----------------------
    if (!product || !PRODUCTS) {
        // A check for the data files is also good practice
        if (typeof PRODUCTS === 'undefined' || typeof DOOR_CATALOG === 'undefined') {
            console.error("Product data scripts (products-data.js) are not loaded.");
            document.body.innerHTML = "<div style='text-align:center; margin-top:80px'><h2>Error: Product data could not be loaded.</h2><a href='./'>Back to Home</a></div>";
            return;
        }
        document.body.innerHTML = "<div style='text-align:center; margin-top:80px'><h2>Product Not Found</h2><a href='./'>Back to Home</a></div>";
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
        `<a href='./' style="color:var(--secondary-color)">Home</a> / <a href='product.html' style="color:var(--secondary-color)">Product</a> / ${product.name}`;
    
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
            `<img src="${img}" data-src="${img}" class="product-thumb ${index === 0 ? 'selected' : ''}" alt="${product.name} thumbnail ${index + 1}" loading="eager" decoding="async" width="100" height="120">`
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
    renderDoorCatalog(product.id); // Filter to show only doors from this product's category

    // ----------------------
    // 5. Event Listener Setup
    // ----------------------
    initializeCatalogListeners();
    initializeEnquiryButton(product);
});

// Injects Product Schema JSON-LD into the page head for SEO
function injectProductSchema(product, absoluteImageUrl) {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [
            absoluteImageUrl,
            ...(product.similarImages || []).map(img => new URL(img, window.location.href).href)
        ],
        "url": window.location.href,
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

// Function to render the door catalog gallery with optional category filter
function renderDoorCatalog(categoryFilter = null) {
    const catalogGrid = document.getElementById('door-catalog-grid');
    if (!catalogGrid || typeof DOOR_CATALOG === 'undefined') return;

    catalogGrid.classList.add('filtering');
    const doorsToShow = DOOR_CATALOG.filter(door => door.category === categoryFilter);

    catalogGrid.innerHTML = doorsToShow.map(door => `
        <div class="door-catalog-item" 
             data-image="${door.image}" 
             data-code="${door.code}" 
             role="button"
             tabindex="0"
             aria-label="View door design ${door.code}">
            <div class="door-catalog-label">${door.code}</div>
            <div class="door-catalog-image-wrapper">
                <img src="${door.image}" 
                     alt="Door Design ${door.code}" 
                     class="door-catalog-image" 
                     loading="lazy"
                     decoding="async"
                     onerror="this.src='images/logo.png'; this.classList.add('error');">
                <div class="image-loading-spinner" aria-hidden="true"></div>
            </div>
        </div>
    `).join('');

    setTimeout(() => catalogGrid.classList.remove('filtering'), 300);
}

/**
 * Uses event delegation to handle clicks and keydowns on the catalog.
 */
function initializeCatalogListeners() {
    const catalogGrid = document.getElementById('door-catalog-grid');
    if (!catalogGrid) return;

    const handleInteraction = (item) => {
        if (!item) return;

        const imageSrc = item.dataset.image;
        const doorCode = item.dataset.code;
        const mainImg = document.getElementById('main-door-image');
        const thumbnailsContainer = document.getElementById('similar-images');

        // Update main image and its alt text
        swapMainImage(imageSrc);
        mainImg.alt = `Door Design ${doorCode}`;

        // Simplify thumbnails to show only the selected design
        thumbnailsContainer.innerHTML = `<img src="${imageSrc}" class="product-thumb selected" alt="${mainImg.alt}" loading="lazy" decoding="async">`;

        // Highlight the selected item in the catalog
        catalogGrid.querySelectorAll('.door-catalog-item.selected').forEach(selected => selected.classList.remove('selected'));
        item.classList.add('selected');

        // Scroll to main image for better UX and manage focus
        mainImg.setAttribute('tabindex', -1); // Make it programmatically focusable
        mainImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        mainImg.focus();
    };

    catalogGrid.addEventListener('click', function (e) {
        const item = e.target.closest('.door-catalog-item');
        handleInteraction(item);
    });

    catalogGrid.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const item = e.target.closest('.door-catalog-item');
            if (item) {
                e.preventDefault();
                handleInteraction(item);
            }
        }
    });
}

/**
 * Sets up the smart enquiry button to pass the product name.
 * @param {object} product The product data object.
 */
function initializeEnquiryButton(product) {
    const enquiryBtn = document.getElementById('product-enquiry-btn');
    if (enquiryBtn) {
        enquiryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = `contact.html?product=${encodeURIComponent(product.name)}`;
        });
    }
}