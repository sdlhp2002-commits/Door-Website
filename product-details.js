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
    if (!product) {
        document.body.innerHTML = "<div style='text-align:center; margin-top:80px'><h2>Product Not Found</h2><a href='index.html'>Back to Home</a></div>";
        return;
    }

    // ----------------------
    // 2. Data Population
    // ----------------------
    document.title = product.name + " | Ajor Doors";

    // Fill hero/breadcrumb
    document.getElementById("breadcrumb-area").innerHTML =
        `<a href='index.html' style="color:var(--secondary-color)">Home</a> / <a href='index.html#products' style="color:var(--secondary-color)">Products</a> / ${product.name}`;
    document.getElementById("product-title").textContent = product.name;

    // Main Image
    const mainImg = document.getElementById("main-door-image");
    mainImg.src = product.mainImage || product.similarImages[0];
    mainImg.alt = product.name;

    // Short desc
    document.getElementById("short-description").textContent = product.shortDescription;

    // Specifications
    document.getElementById("spec-table").innerHTML = renderSpecs(product.specifications);

    // Features
    document.getElementById("product-features").innerHTML = renderFeatures(product.features);

    // ----------------------
    // 3. Thumbnail Rendering & Event Handling
    // ----------------------
    const simDiv = document.getElementById("similar-images");

    // Combine mainImage and similarImages for the gallery
    const galleryImages = [product.mainImage, ...product.similarImages].filter((value, index, self) => self.indexOf(value) === index);

    simDiv.innerHTML = galleryImages
        .map((img, index) =>
            // We use 'product-thumb' class for targeting in JS, and 'selected' for styling the first one
            `<img src="${img}" data-src="${img}" class="product-thumb ${index === 0 ? 'selected' : ''}" alt="${product.name} thumbnail ${index + 1}">`
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
            const contactSection = document.getElementById('contact');
            const messageBox = document.querySelector('textarea[name="Message"]');
            
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            if (messageBox) {
                messageBox.value = `I am interested in ${product.name}. Please send me more details.`;
                // Optional: Focus the box so they can type immediately
                setTimeout(() => messageBox.focus(), 800);
            }
        });
    }
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
                     onerror="this.src='images/logo.png'; this.alt='Image not available'; this.classList.add('error');">
                <div class="image-loading-spinner" aria-hidden="true"></div>
            </div>
        </div>
    `).join('');

    // Add "Show All" button if filtered, or remove it if showing all
    

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