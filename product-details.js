// Helper: get product id from query string
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
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

// Render size/material options as dropdowns
function renderOptions(specifications) {
    let optionsHtml = '';
    // Define which specs should become options
    const optionKeys = ['Thickness', 'Width', 'Height'];

    optionKeys.forEach(key => {
        if (specifications[key]) {
            // Split the string by comma, then trim whitespace and remove quotes from each item
            const options = specifications[key].split(',').map(opt => opt.trim().replace(/["']/g, ''));
            
            if (options.length > 0) {
                optionsHtml += `
                    <div class="option-group">
                        <label for="select-${key.toLowerCase()}">Select ${key}</label>
                        <select id="select-${key.toLowerCase()}" name="${key}">
                            ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>`;
            }
        }
    });
    return optionsHtml;
}

// Calculate and update price based on selected options
function updateDisplayedPrice(basePrice) {
    // If basePrice is not a number (e.g., "As per market price"), just display it and exit.
    if (typeof basePrice !== 'number') {
        const priceContainer = document.getElementById('product-price-container');
        if (priceContainer) {
            priceContainer.innerHTML = `Total Price: <span>${basePrice}</span>`;
        }
        return;
    }

    let finalPrice = basePrice;
    
    // Logic: Add cost for larger dimensions
    // Height: Add ₹300 per inch above 78"
    const hSelect = document.getElementById('select-height');
    if (hSelect) {
        const val = parseInt(hSelect.value);
        if (!isNaN(val) && val > 78) finalPrice += (val - 78) * 300; 
    }
    
    // Width: Add ₹400 per inch above 32"
    const wSelect = document.getElementById('select-width');
    if (wSelect) {
        const val = parseInt(wSelect.value);
        if (!isNaN(val) && val > 32) finalPrice += (val - 32) * 400; 
    }

    // Thickness: Flat ₹1500 extra for thickness > 32mm
    const tSelect = document.getElementById('select-thickness');
    if (tSelect) {
        const val = parseInt(tSelect.value);
        if (!isNaN(val) && val > 32) finalPrice += 1500; 
    }

    // Installation Cost Logic
    const installRadios = document.getElementsByName('installation');
    for (const radio of installRadios) {
        if (radio.checked) {
            if (radio.value === 'labor') finalPrice += 1200;
            else if (radio.value === 'basic') finalPrice += 1500;
            else if (radio.value === 'premium') finalPrice += 2500;
            break;
        }
    }

    const priceContainer = document.getElementById('product-price-container');
    if (priceContainer) {
        priceContainer.innerHTML = `Total Price: <span>₹${finalPrice.toLocaleString('en-IN')}</span>`;
    }
}

// Product lookup & rendering
document.addEventListener('DOMContentLoaded', function () {
    const productId = getProductId();
    // Assuming PRODUCTS is defined in products-data.js
    const product = PRODUCTS.find(p => p.id === productId);

    // Function to update the contact form message with selected details
    function updateFormMessage() {
        const pageContactForm = document.getElementById('ajor-contact-form');
        if (!pageContactForm) return;

        // Helper to set or create hidden input
        const setHidden = (name, value) => {
            let input = pageContactForm.querySelector(`input[name="${name}"]`);
            if (!input) {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                pageContactForm.appendChild(input);
            }
            input.value = value;
        };
        
        // 1. Product Name
        setHidden("Product_Name", product.name);

        // 2. Specifications (Size, Thickness, etc.)
        document.querySelectorAll('.product-options select').forEach(sel => {
            if(sel.value) setHidden(sel.name, sel.value);
        });

        // 3. Installation
        let installation = "No Installation Selected";
        const installRadios = document.getElementsByName('installation');
        for (const radio of installRadios) {
            if (radio.checked && radio.value !== 'none') {
                installation = radio.parentElement.querySelector('.radio-label').textContent;
            }
        }
        setHidden("Installation_Type", installation);

        // 4. Price
        const priceContainer = document.getElementById('product-price-container');
        if (priceContainer && priceContainer.querySelector('span')) {
             setHidden("Estimated_Price", priceContainer.querySelector('span').innerText);
        }

        // 5. Message Box - Set a simple default message
        const msgBox = pageContactForm.querySelector('textarea[name="Message"]');
        if (msgBox) {
            // Only set a default message if the box is empty.
            if (!msgBox.value) {
                msgBox.value = `I am interested in the ${product.name}. Please send me a quote.`;
            }
        }
    }

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
    document.getElementById("breadcrumb-area").innerHTML = `<a href='./'>Home</a> / <a href='product.html'>Product</a> / ${product.name}`;
    
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

    // Price
    const priceContainer = document.getElementById('product-price-container');
    if (product.price && priceContainer) {
        if (typeof product.price === 'number') {
            // Format price with Indian Rupee formatting
            priceContainer.innerHTML = `Price: <span>₹${product.price.toLocaleString('en-IN')}</span>`;
        } else {
            // If it's a string (like "As per market price"), display it directly
            priceContainer.innerHTML = `Price: <span>${product.price}</span>`;
        }
    }

    // Size/Material Options
    const optionsContainer = document.getElementById('product-options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = renderOptions(product.specifications);
        
        // Add change listeners for dynamic price updates
        const selects = optionsContainer.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => {
                updateDisplayedPrice(product.price);
                updateFormMessage(); // Update form text when size changes
            });
        });

        // Add listeners for installation radio buttons
        const installRadios = document.querySelectorAll('input[name="installation"]');
        installRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateDisplayedPrice(product.price);
                updateFormMessage(); // Update form text when installation changes
            });
        });
    }

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
    // Render a selection of other products to explore.
    renderOtherProducts(product.id);

    // Initial call to set the message on load
    updateFormMessage();

    // ----------------------
    // 5. Event Listener Setup
    // ----------------------
    initializeCatalogListeners();
    initializeEnquiryButton();
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

/**
 * Renders a grid of other products, excluding the current one.
 * @param {string} currentProductId The ID of the product currently being viewed.
 */
function renderOtherProducts(currentProductId) {
    const catalogGrid = document.getElementById('door-catalog-grid');
    const catalogTitle = document.querySelector('.catalog-section-title');

    if (!catalogGrid || !catalogTitle || typeof PRODUCTS === 'undefined') return;

    // Filter out the current product and take a slice of others to show
    const otherProducts = PRODUCTS.filter(p => p.id !== currentProductId).slice(0, 8); // Show up to 8 other products

    if (otherProducts.length === 0) {
        document.querySelector('.door-catalog-section').style.display = 'none';
        return;
    }

    catalogTitle.textContent = "Explore Other Products";
    catalogGrid.classList.add('filtering');

    catalogGrid.innerHTML = otherProducts.map(product => `
        <a href="product-details.html?id=${product.id}" class="door-catalog-item" aria-label="View details for ${product.name}">
             <div class="door-catalog-image-wrapper">
                 <img src="${product.mainImage}" 
                      alt="${product.name}" 
                      class="door-catalog-image" 
                      loading="lazy"
                      decoding="async">
             </div>
             <div class="door-catalog-label">${product.name}</div>
        </a>
    `).join('');

    setTimeout(() => catalogGrid.classList.remove('filtering'), 300);
}

/**
 * This function is now simplified. The grid items are links (`<a>`), so they navigate automatically.
 * We keep this function name in case we want to add more complex JS interactions later.
 */
function initializeCatalogListeners() {
    const catalogGrid = document.getElementById('door-catalog-grid');
    if (!catalogGrid) return;

    // The grid items are now `<a>` tags, so default browser navigation handles the clicks.
    // If we needed to prevent default and do something with JS, the logic would go here.
    catalogGrid.addEventListener('click', function (e) {
        // If the clicked element is not a link, do nothing.
        if (!e.target.closest('a')) {
            e.preventDefault();
        }
    });
}

/**
 * Makes the "Enquiry Now" button scroll to the contact form on the page.
 */
function initializeEnquiryButton() {
    const enquiryBtn = document.getElementById('product-enquiry-btn');
    const contactSection = document.getElementById('contact');

    if (enquiryBtn && contactSection) {
        enquiryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}