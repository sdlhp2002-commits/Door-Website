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
    document.querySelectorAll('.product-thumbnails img').forEach(img => {
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

    // ATTACH EVENT LISTENER FOR THUMBNAIL CLICKS
    document.querySelectorAll('.product-thumb').forEach(thumb => {
        thumb.addEventListener('click', function () {
            // Use the data-src attribute for the high-res image source
            const newSrc = this.getAttribute('data-src');
            swapMainImage(newSrc, this);
        });
    });

    // ----------------------
    // 4. Door Catalog Gallery Rendering
    // ----------------------
    // Filter catalog by product category on initial load
    // Product ID matches the category name in DOOR_CATALOG
    renderDoorCatalog(product.id); // Filter to show only doors from this product's category
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

    // Generate HTML for each door in the catalog
    catalogGrid.innerHTML = doorsToShow.map(door => `
        <div class="door-catalog-item" data-image="${door.image}" data-code="${door.code}" data-category="${door.category}">
            <div class="door-catalog-label">${door.code}</div>
            <div class="door-catalog-image-wrapper">
                <img src="${door.image}" alt="Door Design ${door.code}" class="door-catalog-image" 
                     onerror="this.src='images/logo.png'; this.alt='Image not available';">
            </div>
        </div>
    `).join('');

    // Add "Show All" button if filtered, or remove it if showing all
    

    // Attach click event listeners to catalog items
    document.querySelectorAll('.door-catalog-item').forEach(item => {
        item.addEventListener('click', function () {
            const imageSrc = this.getAttribute('data-image');
            const doorCode = this.getAttribute('data-code');
            const doorCategory = this.getAttribute('data-category');

            // Update main product image
            const mainImg = document.getElementById('main-door-image');
            if (mainImg && imageSrc) {
                mainImg.src = imageSrc;
                mainImg.alt = `Door Design ${doorCode}`;

                // Add the clicked image to thumbnails if it's not already there
                addToThumbnails(imageSrc, doorCode);

                // Filter to show only similar doors (same category)
                renderDoorCatalog(doorCategory);

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
        });
    });
}

// Helper function to add clicked catalog image to thumbnails
function addToThumbnails(imageSrc, doorCode) {
    const thumbnailsContainer = document.getElementById('similar-images');
    if (!thumbnailsContainer) return;

    // Check if image already exists in thumbnails
    const existingThumbs = Array.from(thumbnailsContainer.querySelectorAll('img'));
    const alreadyExists = existingThumbs.some(thumb => thumb.getAttribute('data-src') === imageSrc);

    if (!alreadyExists && imageSrc) {
        // Create new thumbnail
        const newThumb = document.createElement('img');
        newThumb.src = imageSrc;
        newThumb.setAttribute('data-src', imageSrc);
        newThumb.className = 'product-thumb';
        newThumb.alt = `Door Design ${doorCode}`;

        // Add click handler
        newThumb.addEventListener('click', function () {
            swapMainImage(imageSrc, this);
        });

        // Remove selected class from all thumbnails
        document.querySelectorAll('.product-thumb').forEach(thumb => {
            thumb.classList.remove('selected');
        });

        // Add selected class to new thumbnail
        newThumb.classList.add('selected');

        // Add to container
        thumbnailsContainer.appendChild(newThumb);

        // Update main image
        const mainImg = document.getElementById('main-door-image');
        if (mainImg) {
            mainImg.src = imageSrc;
        }
    } else if (alreadyExists) {
        // If it exists, just select it
        existingThumbs.forEach(thumb => {
            thumb.classList.remove('selected');
            if (thumb.getAttribute('data-src') === imageSrc) {
                thumb.classList.add('selected');
            }
        });
    }
}