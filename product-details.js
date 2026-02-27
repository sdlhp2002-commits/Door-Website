// Helper: get product id from query string
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Render features as list
function renderFeatures(features) {
    if (!Array.isArray(features)) return '';
    return features.map(f => `<li>${f}</li>`).join('');
}

// Function to handle the image swap and 'selected' styling
let currentLoadingSrc = null;

function swapMainImage(newSrc, clickedThumbnail) {
    const mainImage = document.getElementById('main-door-image');
    if (!mainImage || !newSrc) return;

    currentLoadingSrc = newSrc;
    mainImage.classList.add('loading');
    const imgPreload = new Image();
    imgPreload.onload = () => {
        if (currentLoadingSrc === newSrc) {
            mainImage.src = newSrc;
            mainImage.classList.remove('loading');
        }
    };
    imgPreload.onerror = () => {
        if (currentLoadingSrc === newSrc) {
            mainImage.classList.remove('loading'); // Still remove loading on error
        }
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
    if (!specifications) return '';
    let optionsHtml = '';
    // Define which specs should become options
    const optionKeys = ['Thickness', 'Width', 'Height'];

    optionKeys.forEach(key => {
        if (specifications[key]) {
            // Split by comma OR pipe, then trim whitespace and remove quotes from each item
            const options = specifications[key]
                .split(/[,|]/)
                .map(opt => opt.trim().replace(/["']/g, ''))
                .filter(opt => opt); // Remove empty strings
            
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
            priceContainer.innerHTML = `Price: <span>${basePrice}</span>`;
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
        priceContainer.innerHTML = `Price: <span>₹${finalPrice.toLocaleString('en-IN')}</span>`;
    }
}

// Product lookup & rendering
document.addEventListener('DOMContentLoaded', function () {
    const productId = getProductId();
    
    if (typeof PRODUCTS === 'undefined') {
        console.error("Product data scripts (products-data.js) are not loaded.");
        document.body.innerHTML = "<div style='text-align:center; margin-top:80px'><h2>Error: Product data could not be loaded.</h2><a href='./'>Back to Home</a></div>";
        return;
    }

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
    if (!product) {
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

    // Initial Price Render (Calculates based on default options)
    // We defer this slightly to ensure options are rendered first

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

        // Calculate initial price with defaults
        updateDisplayedPrice(product.price);
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
    // Filter catalog by product category on initial load
    renderDoorCatalog(product.id); // Filter to show only doors from this product's category
    initializeImageLazyLoader();

    // Initial call to set the message on load
    updateFormMessage();

    // ----------------------
    // 5. Event Listener Setup
    // ----------------------
    initializeCatalogListeners();
    initializeEnquiryButton();
    initializeLightbox();
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
    const catalogTitle = document.querySelector('.catalog-section-title');

    if (!catalogGrid || !catalogTitle || typeof DOOR_CATALOG === 'undefined') return;

    const doorsToShow = DOOR_CATALOG.filter(door => door.category === categoryFilter);

    if (doorsToShow.length === 0) {
        document.querySelector('.door-catalog-section').style.display = 'none';
        return;
    }

    catalogTitle.textContent = "Explore Available Designs";
    catalogGrid.classList.add('filtering');

    catalogGrid.innerHTML = doorsToShow.map(door => `
        <div class="door-catalog-item" 
             data-image="${door.image}" 
             data-code="${door.code}" 
             role="button"
             tabindex="0"
             aria-label="View door design ${door.code}">
             <div class="door-catalog-image-wrapper">
                 <img data-src="${door.image}" 
                      alt="Door Design ${door.code}" 
                      class="door-catalog-image lazy-load" 
                      decoding="async"
                      width="250" height="280">
                 <div class="image-loading-spinner"></div>
             </div>
             <div class="door-catalog-label">${door.code}</div>
        </div>
    `).join('');

    setTimeout(() => catalogGrid.classList.remove('filtering'), 300);
}

/**
 * Sets up an IntersectionObserver to lazy-load images in the catalog.
 */
function initializeImageLazyLoader() {
    const lazyImages = document.querySelectorAll('.door-catalog-image.lazy-load');

    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;

                if (!src) return;

                img.classList.add('loading');

                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = src;
                    img.classList.remove('loading', 'lazy-load');
                };
                tempImg.onerror = () => {
                    img.classList.remove('loading');
                    img.classList.add('error');
                };
                
                tempImg.src = src;

                observer.unobserve(img);
            }
        });
    }, { rootMargin: '0px 0px 200px 0px' }); // Load 200px before viewport

    lazyImages.forEach(img => imageObserver.observe(img));
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

        // Update main image and its alt text
        swapMainImage(imageSrc); // This will also un-select all thumbnails above
        mainImg.alt = `Door Design ${doorCode}`;

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

/**
 * Initializes a lightbox to view the main image in full screen.
 */
function initializeLightbox() {
    const mainImg = document.getElementById('main-door-image');
    if (!mainImg) return;

    // Create Lightbox DOM elements
    const overlay = document.createElement('div');
    overlay.id = 'product-lightbox';
    overlay.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; justify-content:center; align-items:center; cursor:zoom-out;';
    
    const img = document.createElement('img');
    img.style.cssText = 'max-width:90%; max-height:90%; object-fit:contain;';
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // Event Listeners
    mainImg.style.cursor = 'zoom-in';
    mainImg.addEventListener('click', function() {
        img.src = this.src;
        overlay.style.display = 'flex';
    });

    overlay.addEventListener('click', function() {
        overlay.style.display = 'none';
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            overlay.style.display = 'none';
        }
    });
}