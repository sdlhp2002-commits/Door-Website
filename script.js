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

// 3. Auto Play Video on Scroll
const video = document.getElementById('aboutIntroVideo');
const fullScreenBtn = document.getElementById('fullScreenBtn');

// 1. Auto play/pause on scroll
if (video) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });
    observer.observe(video);
}

// 2. Full Screen Functionality
if (fullScreenBtn && video) {
    fullScreenBtn.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) { /* Safari */
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { /* IE11 */
            video.msRequestFullscreen();
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

// 6. Google Maps Implementation (Modern)
async function initMap() {
    const mapElement = document.getElementById("map");
    // Only run if map element exists and google API is loaded
    if (!mapElement || typeof google === "undefined") return;

    // Import libraries using the new method
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const position = { lat: 13.0279, lng: 77.6784 };

    const map = new Map(mapElement, {
        center: position,
        zoom: 15,
        mapId: "DEMO_MAP_ID", // Replace with your actual Map ID from Google Cloud Console
    });

    new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Ajor Doors",
    });
}

initMap();