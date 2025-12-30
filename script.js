// 1. Mobile Menu
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
const navLinks = document.querySelectorAll(".nav-menu .nav-link"); // Select all links in the menu

// Open menu
if (menuOpenButton) {
    menuOpenButton.addEventListener("click", () => document.body.classList.add("show-mobile-menu"));
}

// Close menu via X button
if (menuCloseButton) {
    menuCloseButton.addEventListener("click", () => document.body.classList.remove("show-mobile-menu"));
}

// Close menu when any link is clicked
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        document.body.classList.remove("show-mobile-menu");
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

// --- FIXED FORM SECTION ---
const form = document.getElementById('ajor-contact-form');
const btn = document.getElementById('submit-btn');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        btn.innerText = "Sending...";
        btn.disabled = true;

        // FIX: We define the URL directly as a string here
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz824FphQ38vAY1Q2qeJt9ZFYtq1rMWCZBjm7-E7IjnSdcPkXCHLsMChiVcaaWYilv2/exec';

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: new FormData(form)
        })
            .then(() => {
                // This will now trigger correctly!
                console.log("Success! Redirecting...");
                window.location.href = 'thank-you.html';
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("There was a connection error. Please try again.");
                btn.innerText = "Get Free Quote";
                btn.disabled = false;
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

// 5. Scroll To Top Button Logic
const scrollTopBtn = document.getElementById("scroll-top-btn");

if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    });

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
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCloseBtn = document.querySelector('.lightbox-close');
const lightboxCaption = document.getElementById('lightbox-caption');
const galleryContainer = document.querySelector('.gallery-container');
const hardwareGrid = document.querySelector('.hardware-grid');

if (lightbox && lightboxImg && lightboxCloseBtn) {
    const openLightbox = (e) => {
        const item = e.target.closest('.gallery-item, .products, .slide-item, .grid-card');
        if (item) {
            // Prevent default link behavior if clicking the image directly
            if(e.target.tagName === 'IMG') e.preventDefault();
            
            const img = item.querySelector('img');
            if (img && img.src) {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
                
                const captionEl = item.querySelector('.gallery-cat, .name, h3, strong');
                lightboxCaption.textContent = captionEl ? captionEl.textContent : "";
            }
        }
    };

    if (galleryContainer) galleryContainer.addEventListener('click', openLightbox);
    if (hardwareGrid) hardwareGrid.addEventListener('click', openLightbox);

    lightboxCloseBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });
}

// 9. Navbar Scroll Effect
const navbarHeader = document.querySelector("header");
const heroSection = document.querySelector(".hero-section");

if (navbarHeader && heroSection) {
    navbarHeader.classList.toggle("transparent", window.scrollY < 50);
    window.addEventListener("scroll", function () {
        navbarHeader.classList.toggle("transparent", window.scrollY < 50);
    });
} else if (navbarHeader) {
    navbarHeader.classList.remove("transparent");
}

// 11. Hardware Search Functionality
const hardwareSearchInput = document.getElementById('hardware-search');
const hardwareItems = document.querySelectorAll('.hardware-grid .products');

if (hardwareSearchInput && hardwareItems.length > 0) {
    hardwareSearchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        hardwareItems.forEach(item => {
            const name = item.querySelector('.name').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                item.style.display = '';
                // Optional: Add a subtle fade-in animation here if desired
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// 12. Hardware Filter Logic
const hardwareFilterBtns = document.querySelectorAll('.hardware-filters .filter-btn');
const hardwareItemsGrid = document.querySelectorAll('.hardware-grid .products');

if (hardwareFilterBtns.length > 0) {
    hardwareFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hardwareFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            
            hardwareItemsGrid.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                    item.style.opacity = 0;
                    setTimeout(() => item.style.opacity = 1, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
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

    const acceptBtn = document.getElementById("accept-cookies");
    if (acceptBtn) {
        acceptBtn.addEventListener("click", function() {
            localStorage.setItem("cookieConsent", "true");
            banner.remove();
        });
    }
}

// 13. Hardware Gallery Slider Logic (Manual Scroll)
const hwSlider = document.querySelector('.hardware-slider');
const hwPrevBtn = document.querySelector('.prev-btn');
const hwNextBtn = document.querySelector('.next-btn');

if (hwSlider && hwPrevBtn && hwNextBtn) {
    hwNextBtn.addEventListener('click', () => {
        hwSlider.scrollBy({ left: 300, behavior: 'smooth' });
    });
    hwPrevBtn.addEventListener('click', () => {
        hwSlider.scrollBy({ left: -300, behavior: 'smooth' });
    });
}