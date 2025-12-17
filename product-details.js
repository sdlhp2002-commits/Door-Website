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
window.onload = function() {
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
        thumb.addEventListener('click', function() {
            // Use the data-src attribute for the high-res image source
            const newSrc = this.getAttribute('data-src'); 
            swapMainImage(newSrc, this);
        });
    });
};