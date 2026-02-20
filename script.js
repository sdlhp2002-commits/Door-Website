// 1. Mobile Menu
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
const navLinks = document.querySelectorAll(".nav-menu .nav-link"); // Select all links in the menu

// Open menu
if (menuOpenButton) {
    menuOpenButton.addEventListener("click", () => {
        document.body.classList.add("show-mobile-menu");
        menuOpenButton.setAttribute('aria-expanded', 'true');
    });
}

// Close menu via X button
if (menuCloseButton) {
    menuCloseButton.addEventListener("click", () => {
        document.body.classList.remove("show-mobile-menu");
        if (menuOpenButton) menuOpenButton.setAttribute('aria-expanded', 'false');
    });
}

// Close menu when any link is clicked
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        document.body.classList.remove("show-mobile-menu");
        if (menuOpenButton) {
            menuOpenButton.setAttribute('aria-expanded', 'false');
        }
    });
});

// 2. Product Slider
if (document.querySelector('.slider-wrapper')) {
    const swiper = new Swiper('.slider-wrapper', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,

        // Autoplay
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        // Pagination (Dots)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true // Optional: makes dots look premium
        },

        // Navigation (Arrows)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
        }
    });
}

// 2.1 Testimonial Slider
if (document.querySelector('.testimonial-slider')) {
    const testimonialSwiper = new Swiper('.testimonial-slider', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

// 2.2 Hero Section Slider (Mikasa Style)
if (document.querySelector('.hero-slider')) {
    new Swiper('.hero-slider', {
        loop: true,
        effect: 'slide', // Smooth slide effect
        speed: 1000, // Slower transition for elegance
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// --- FIXED FORM SECTION ---
const form = document.getElementById('ajor-contact-form');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('submit-btn');
        if (btn) btn.innerText = "Sending...";
        if (btn) btn.disabled = true;

        // FIX: We define the URL directly as a string here
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz824FphQ38vAY1Q2qeJt9ZFYtq1rMWCZBjm7-E7IjnSdcPkXCHLsMChiVcaaWYilv2/exec';

        // NOTE: 'no-cors' mode means the response is "opaque".
        // The .then() block will execute even on a 4xx/5xx server error from Google Scripts,
        // as the browser cannot inspect the response. The .catch() only handles network failures.
        // This is a known limitation when submitting to Google Scripts this way.
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: new FormData(form),
        })
            .then(() => {
                // This will now trigger correctly!
                console.log("Success! Redirecting...");
                window.location.href = 'thank-you.html';
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("There was a connection error. Please try again.");
                if (btn) btn.innerText = "Get Free Quote";
                if (btn) btn.disabled = false;
            });
    });
}

// 4. Fade In Animation on Scroll
const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in-section').forEach(section => {
    fadeObserver.observe(section);
});

// 5. Scroll Logic (Throttled for Performance)
const scrollTopBtn = document.getElementById("scroll-top-btn");
const header = document.querySelector('header');

// Throttle helper to prevent scroll events from firing too often
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

window.addEventListener("scroll", throttle(() => {
    const scrollY = window.scrollY;

    // Header Effect
    if (header) header.classList.toggle('scrolled', scrollY > 0);

    // Scroll To Top Button
    if (scrollTopBtn) {
        if (scrollY > 300) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    }
}, 100));

if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// 7. Gallery Filter Logic
const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = '';
                    // Add a small fade in animation
                    item.style.opacity = '0';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// 8. Lightbox Logic
// @review This is a comprehensive lightbox. However, a separate, simpler lightbox is
// implemented in `product-details.js`. It's recommended to consolidate these into a
// single, reusable script to avoid code duplication and ensure a consistent UX across the site.
const galleryContainer = document.querySelector('.gallery-container');

if (galleryContainer) {
    let lightbox = document.getElementById('lightbox');

    // Dynamically create lightbox if it doesn't exist
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <button id="lightbox-prev" class="lightbox-prev">&#10094;</button>
            <img id="lightbox-img" class="lightbox-content" src="" alt="Gallery Image">
            <button id="lightbox-next" class="lightbox-next">&#10095;</button>
            <div id="lightbox-caption" class="lightbox-caption"></div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.querySelector('.lightbox-close');
    const lightboxPrevBtn = document.getElementById('lightbox-prev');
    const lightboxNextBtn = document.getElementById('lightbox-next');

    let currentImageIndex;
    let visibleGalleryItems = [];
    let lastFocusedElement; // To store the element that opened the lightbox

    // All focusable elements in the lightbox
    const focusableElements = [lightboxCloseBtn, lightboxPrevBtn, lightboxNextBtn];

    function showImage(index) {
        if (index < 0 || index >= visibleGalleryItems.length) return;

        currentImageIndex = index;
        const item = visibleGalleryItems[index];
        const img = item.querySelector('img');
        const captionEl = item.querySelector('.gallery-cat');

        if (img) {
            // Use the high-res image from the picture element if available
            const sourceEl = item.querySelector('source[srcset*="large"]');
            let largeImageSrc = img.src; // Fallback to the img src
            if (sourceEl) {
                const srcset = sourceEl.getAttribute('srcset');
                // Get the last (largest) image from the srcset
                const sources = srcset.split(',').map(s => s.trim().split(' '));
                largeImageSrc = sources[sources.length - 1][0];
            }
            
            lightboxImg.src = largeImageSrc;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = captionEl ? captionEl.textContent : "";
        }
        
        // Update button visibility
        lightboxPrevBtn.style.display = (index > 0) ? 'block' : 'none';
        lightboxNextBtn.style.display = (index < visibleGalleryItems.length - 1) ? 'block' : 'none';
    }

    function openLightbox(clickedItem) {
        // Store the element that was focused before opening the lightbox
        lastFocusedElement = document.activeElement;

        // Get all gallery items that are currently visible
        visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
            item => item.style.display !== 'none'
        );
        const clickedIndex = visibleGalleryItems.findIndex(item => item === clickedItem);

        if (clickedIndex !== -1) {
            lightbox.classList.add('active');
            document.addEventListener('keydown', handleLightboxKeys);
            showImage(clickedIndex);
            // Move focus into the lightbox
            lightboxCloseBtn.focus();
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.removeEventListener('keydown', handleLightboxKeys);
        // Return focus to the element that opened the lightbox
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    function showNextImage() {
        if (currentImageIndex < visibleGalleryItems.length - 1) {
            showImage(currentImageIndex + 1);
        }
    }

    function showPrevImage() {
        if (currentImageIndex > 0) {
            showImage(currentImageIndex - 1);
        }
    }

    function handleLightboxKeys(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'Tab') {
            // Focus trap logic
            const visibleFocusableElements = focusableElements.filter(el => el.style.display !== 'none');
            const firstElement = visibleFocusableElements[0];
            const lastElement = visibleFocusableElements[visibleFocusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    galleryContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            e.preventDefault();
            openLightbox(item);
        }
    });

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    lightboxNextBtn.addEventListener('click', showNextImage);
    lightboxPrevBtn.addEventListener('click', showPrevImage);
}

// 12. Cookie Consent Banner
if (!localStorage.getItem("cookieConsent")) {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `
        <div class="cookie-content">
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <button id="accept-cookies" class="cookie-btn">Accept</button>
        </div>
    `;
    document.body.appendChild(banner);

    const acceptBtn = banner.querySelector("#accept-cookies");
    if (acceptBtn) {
        acceptBtn.addEventListener("click", function() {
            localStorage.setItem("cookieConsent", "true");
            banner.remove();
        });
    }
}

// 13. Image Performance Optimization
document.addEventListener("DOMContentLoaded", () => {
    // Optimize Logo for LCP (Largest Contentful Paint)
    const logo = document.querySelector('.logo-image');
    if (logo) {
        logo.setAttribute('fetchpriority', 'high');
        logo.setAttribute('decoding', 'async');
    }
});

// 14. Dark Mode Toggle Logic (Mobile Only)
document.addEventListener("DOMContentLoaded", () => {
    // Create the toggle button
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.id = 'theme-toggle';
    themeToggleBtn.className = 'theme-toggle-btn';
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    
    // Find the nav menu to inject the button
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const li = document.createElement('li');
        li.className = 'nav-item theme-toggle-nav-item';
        li.appendChild(themeToggleBtn);
        navMenu.appendChild(li);
    }

    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Handle click event
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem('theme', theme);
    });
});

// 15. Pricing Toggle Logic
document.addEventListener("DOMContentLoaded", () => {
    const pricingCheckbox = document.getElementById('pricing-toggle-checkbox');
    
    if (pricingCheckbox) {
        pricingCheckbox.addEventListener('change', function() {
            const isYearly = this.checked;
            document.querySelectorAll('.price[data-monthly][data-yearly]').forEach(priceEl => {
                const monthly = priceEl.getAttribute('data-monthly');
                const yearly = priceEl.getAttribute('data-yearly');
                const unit = isYearly ? '/year' : '/month';
                const amount = isYearly ? yearly : monthly;
                priceEl.innerHTML = `₹${amount}<span>${unit}</span>`;
            });
        });
    }
});