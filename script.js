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


// NEW HELPER FUNCTION to convert FormData to a JSON object for AJAX submission
function formDataToObject(formData) {
    const object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    return object;
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

// --- MAIN INITIALIZATION BLOCK ---
document.addEventListener("DOMContentLoaded", () => {
    
    // --- FIXED FORM SECTION (Contact Form) ---
    const contactForm = document.getElementById('ajor-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submit-btn');
            if (btn) btn.innerText = "Sending...";
            if (btn) btn.disabled = true;

            // --- FormSubmit.co Endpoint ---
            const submissionURL = 'https://formsubmit.co/ajax/sdlhp2002@gmail.com';
            const formData = new FormData(contactForm);
            const formObject = formDataToObject(formData);

            // Add settings for FormSubmit.co
            if (formObject.Product_Name) {
                formObject._subject = `Enquiry: ${formObject.Product_Name}`;
                if (formObject.Estimated_Price) {
                    formObject._subject += ` (${formObject.Estimated_Price})`;
                }
            } else {
                formObject._subject = "New Enquiry from Ajor Doors Website!";
            }
            formObject._next = "https://doors.ajormart.in/thank-you.html"; // Redirect page

            fetch(submissionURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formObject),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "true") {
                        window.location.href = formObject._next;
                    } else {
                        throw new Error(data.message || 'Form submission failed. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert("There was an error: " + error.message + ". Please check your form endpoint configuration or contact us directly.");
                    if (btn) btn.innerText = "Get Free Quote";
                    if (btn) btn.disabled = false;
                });
        });
    }

    // 13. Image Performance Optimization
    // Optimize Logo for LCP (Largest Contentful Paint)
    const logo = document.querySelector('.logo-image');
    if (logo) {
        logo.setAttribute('fetchpriority', 'high');
        logo.setAttribute('decoding', 'async');
    }
    // 14. Dark Mode Toggle Logic (Mobile Only)
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

    // 15. Pricing Toggle Logic
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

    // 16. Booking Modal Logic
    const modal = document.getElementById("booking-modal");
    const closeBtn = document.querySelector(".close-modal");
    const bookBtns = document.querySelectorAll(".book-service-btn");
    const serviceInput = document.getElementById("service-type");
    const serviceNameDisplay = document.getElementById("modal-service-name");
    const bookingForm = document.getElementById("booking-form");

    if (modal && bookBtns.length > 0) {
        // Open Modal
        bookBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const service = btn.getAttribute("data-service");
                if (serviceInput) serviceInput.value = service;
                if (serviceNameDisplay) serviceNameDisplay.textContent = `Booking for: ${service}`;
                modal.classList.add("active");
            });
        });

        // Close Modal
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });

        // Handle Form Submission
        if (bookingForm) {
            bookingForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const btn = bookingForm.querySelector("button[type='submit']");
                const originalText = btn.innerText;
                btn.innerText = "Booking...";
                btn.disabled = true;

                // --- NEW: FormSubmit.co Endpoint ---
                // IMPORTANT: Replace YOUR_EMAIL_HERE with your actual email address.
                const submissionURL = 'https://formsubmit.co/ajax/sdlhp2002@gmail.com';
                const formData = new FormData(bookingForm);
                const formObject = formDataToObject(formData);

                // Add settings for FormSubmit.co
                formObject._subject = `New Service Booking: ${formObject.Service_Type || 'Not Specified'}`;
                formObject._next = "https://doors.ajormart.in/thank-you.html";

                fetch(submissionURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success === "true") {
                            window.location.href = formObject._next;
                        } else {
                            throw new Error(data.message || 'Booking submission failed. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error!', error.message);
                        alert("There was an error: " + error.message + ". Please check your form endpoint configuration or contact us directly.");
                        btn.innerText = originalText;
                        btn.disabled = false;
                    });
            });
        }
    }

    // 17. Pre-fill Contact Form from URL Parameters (Enquiry Logic)
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    const details = params.get('details');
    
    // Check if we are on the contact page and have product info
    const contactFormEl = document.getElementById('ajor-contact-form');
    if (product && contactFormEl) {
        const msgField = contactFormEl.querySelector('textarea[name="Message"]');
        if (msgField) {
            let text = `I am interested in the ${product}.`;
            if (details) text += `\n\nSelected Specifications:\n${details}`;
            msgField.value = text;
        }
    }
    // 18. Login Modal Logic & Injection
    if (!document.getElementById('login-modal')) {
        const modalHTML = `
        <div id="login-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" id="close-login-modal">&times;</span>
                <h2 style="text-align:center; margin-bottom:20px; font-family:'Playfair Display', serif; color:var(--primary-color);">Login</h2>
                <form id="login-form" class="contact-form" style="box-shadow:none; padding:0;">
                    <input type="text" name="Name" placeholder="Your Name" class="form-input" required>
                    <input type="email" name="Email" placeholder="Your Email" class="form-input" required>
                    <input type="tel" name="Number" placeholder="Phone Number" class="form-input" required>
                    <button type="submit" class="submit-button" style="width:100%;">Login</button>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Inject Profile Modal HTML if it doesn't exist
    if (!document.getElementById('profile-modal')) {
        const profileModalHTML = `
        <div id="profile-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" id="close-profile-modal">&times;</span>
                <h2 style="text-align:center; margin-bottom:20px; font-family:'Playfair Display', serif; color:var(--primary-color);">My Profile</h2>
                <form id="profile-form" class="contact-form" style="box-shadow:none; padding:0;">
                    <label for="profile-name">Name</label>
                    <input type="text" id="profile-name" name="Name" placeholder="Your Name" class="form-input" required>
                    
                    <label for="profile-email">Email</label>
                    <input type="email" id="profile-email" name="Email" placeholder="Your Email" class="form-input" required>
                    
                    <label for="profile-phone">Phone Number</label>
                    <input type="tel" id="profile-phone" name="Number" placeholder="Phone Number" class="form-input" required>
                    
                    <button type="submit" class="submit-button" style="width:100%;">Save Changes</button>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', profileModalHTML);
    }

    // Inject Review Modal HTML
    if (!document.getElementById('review-modal')) {
        const reviewModalHTML = `
        <div id="review-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" id="close-review-modal">&times;</span>
                <h2 style="text-align:center; margin-bottom:10px; font-family:'Playfair Display', serif; color:var(--primary-color);">Rate Your Experience</h2>
                <form id="review-form" class="contact-form" style="box-shadow:none; padding:0;">
                    
                    <div class="star-rating-container" style="text-align:center; margin-bottom:20px;">
                        <div class="stars" style="display:inline-block;">
                            <i class="fas fa-star star" data-value="1"></i>
                            <i class="fas fa-star star" data-value="2"></i>
                            <i class="fas fa-star star" data-value="3"></i>
                            <i class="fas fa-star star" data-value="4"></i>
                            <i class="fas fa-star star" data-value="5"></i>
                        </div>
                        <p id="rating-feedback" class="rating-feedback" style="margin-top:10px;">Select a rating</p>
                        <input type="hidden" name="Rating" id="selected-rating" required>
                    </div>

                    <button type="submit" class="submit-button" style="width:100%;">Submit Rating</button>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', reviewModalHTML);
    }

    const loginModal = document.getElementById('login-modal');
    const closeLoginBtn = document.getElementById('close-login-modal');
    const loginForm = document.getElementById('login-form');

    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = document.getElementById('close-profile-modal');
    const profileForm = document.getElementById('profile-form');

    const reviewModal = document.getElementById('review-modal');
    const closeReviewBtn = document.getElementById('close-review-modal');
    const reviewForm = document.getElementById('review-form');

    // --- Login State Management ---
    const updateLoginUI = () => {
        const isLoggedIn = localStorage.getItem('ajor_is_logged_in') === 'true';
        const userName = localStorage.getItem('ajor_user_name') || 'User';
        const loginBtns = document.querySelectorAll('.login-icon-btn');
        
        loginBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            const navItem = btn.closest('.nav-item');
            
            // Remove existing welcome message and profile link if any
            const existingMsg = navItem.querySelector('.login-welcome-msg');
            const existingProfileLink = navItem.querySelector('.profile-link');
            if (existingMsg) existingMsg.remove();
            if (existingProfileLink) existingProfileLink.remove();

            if (isLoggedIn) {
                if (icon) {
                    icon.classList.remove('fa-user');
                    icon.classList.add('fa-sign-out-alt');
                }
                btn.setAttribute('aria-label', 'Logout');
                btn.title = "Logout";
                
                // Add Welcome Message
                const msgSpan = document.createElement('span');
                msgSpan.className = 'login-welcome-msg';
                msgSpan.textContent = `Welcome, ${userName}`;

                // Add Profile Link
                const profileLink = document.createElement('a');
                profileLink.href = '#';
                profileLink.id = 'open-profile-modal-btn';
                profileLink.className = 'profile-link';
                profileLink.textContent = 'My Profile';
                navItem.insertBefore(msgSpan, btn);
                navItem.insertBefore(profileLink, btn);
                navItem.classList.add('logged-in-state');
            } else {
                if (icon) {
                    icon.classList.remove('fa-sign-out-alt');
                    icon.classList.add('fa-user');
                }
                btn.setAttribute('aria-label', 'Login');
                btn.title = "Login";
                navItem.classList.remove('logged-in-state');
            }
        });
    };
    
    // Initialize UI on load
    updateLoginUI();

    // Open Modal or Logout on Icon Click
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.login-icon-btn');
        if (btn) {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem('ajor_is_logged_in') === 'true';
            
            if (isLoggedIn) {
                // Logout Logic
                if(confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem('ajor_is_logged_in');
                    // Keep user details for auto-fill next time
                    // localStorage.removeItem('ajor_user_name');
                    updateLoginUI();
                    alert("You have been logged out.");
                }
            } else {
                // Open Login Modal
                if (loginModal) loginModal.classList.add('active');
            }
        }
    });

    // Open Review Modal
    document.body.addEventListener('click', (e) => {
        const reviewBtn = e.target.closest('.open-review-btn');
        if (reviewBtn) {
            e.preventDefault();
            const modal = document.getElementById('review-modal');
            if (modal) modal.classList.add('active');
        }
    });

    // Open Profile Modal
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'open-profile-modal-btn') {
            e.preventDefault();
            
            // Pre-fill form from localStorage
            if (profileForm) {
                profileForm.querySelector('#profile-name').value = localStorage.getItem('ajor_user_full_name') || '';
                profileForm.querySelector('#profile-email').value = localStorage.getItem('ajor_user_email') || '';
                profileForm.querySelector('#profile-phone').value = localStorage.getItem('ajor_user_phone') || '';
            }

            if (profileModal) profileModal.classList.add('active');
        }
    });

    // Close Profile Modal
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            if (profileModal) profileModal.classList.remove('active');
        });
    }

    // Close Review Modal
    if (closeReviewBtn) {
        closeReviewBtn.addEventListener('click', () => {
            if (reviewModal) reviewModal.classList.remove('active');
        });
    }

    // Close Modal
    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal && loginModal) {
            loginModal.classList.remove('active');
        } else if (e.target === profileModal && profileModal) {
            profileModal.classList.remove('active');
        } else if (e.target === reviewModal && reviewModal) {
            reviewModal.classList.remove('active');
        }
    });

    // Auto-open on Explore (Scroll) - On specific pages if not logged in
    const currentPage = window.location.pathname.split('/').pop();
    const pagesForPopup = ['product.html', 'services.html'];

    if (localStorage.getItem('ajor_is_logged_in') !== 'true' && pagesForPopup.includes(currentPage)) {
        const showLoginOnScroll = () => {
            // Double check login state inside the closure
            if (localStorage.getItem('ajor_is_logged_in') === 'true') {
                window.removeEventListener('scroll', showLoginOnScroll);
                return;
            }
            
            if (window.scrollY > 400) { // Trigger after scrolling down
                if (loginModal) loginModal.classList.add('active');
                window.removeEventListener('scroll', showLoginOnScroll);
            }
        };
        window.addEventListener('scroll', showLoginOnScroll);
    }

    // Login Form Validation
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = loginForm.querySelector('input[name="Email"]');
            const phoneInput = loginForm.querySelector('input[name="Number"]');
            
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();

            // Email Validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Phone Validation (10 digits)
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            // If valid, prepare for submission to email via FormSubmit.co
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = "Sending...";
            submitBtn.disabled = true;

            const formData = new FormData(loginForm);
            const formObject = formDataToObject(formData); // Reusing helper function from this script

            // Add settings for FormSubmit.co
            formObject._subject = "New Login/Lead from Ajor Doors Website Popup";

            fetch('https://formsubmit.co/ajax/sdlhp2002@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formObject)
            })
            .then(response => response.json())
            .then(data => {
                alert("Thank you! Your details have been submitted successfully.");
                loginModal.classList.remove('active');
                loginForm.reset();
                
                // Set login state
                localStorage.setItem('ajor_is_logged_in', 'true');
                // Save First Name
                const userName = formObject.Name ? formObject.Name.split(' ')[0] : 'User';
                localStorage.setItem('ajor_user_name', userName);
                localStorage.setItem('ajor_user_full_name', formObject.Name);
                localStorage.setItem('ajor_user_email', formObject.Email);
                localStorage.setItem('ajor_user_phone', formObject.Number);
                
                updateLoginUI();
            })
            .catch(error => {
                console.error('Error submitting login form:', error);
                alert("There was an error sending your details. Please try again or contact us directly.");
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // --- Auto-fill Forms Function ---
    function autoFillForms() {
        const storedName = localStorage.getItem('ajor_user_full_name');
        const storedEmail = localStorage.getItem('ajor_user_email');
        const storedPhone = localStorage.getItem('ajor_user_phone');

        // Pre-fill Login Form
        if (loginForm) {
            if (storedName) loginForm.querySelector('input[name="Name"]').value = storedName;
            if (storedEmail) loginForm.querySelector('input[name="Email"]').value = storedEmail;
            if (storedPhone) loginForm.querySelector('input[name="Number"]').value = storedPhone;
        }
        
        // Pre-fill Contact Forms on any page
        document.querySelectorAll('#ajor-contact-form').forEach(contactForm => {
            if (storedName) {
                const nameInput = contactForm.querySelector('input[name="Name"]');
                if (nameInput) nameInput.value = storedName;
            }
            if (storedEmail) {
                const emailInput = contactForm.querySelector('input[name="Email"]');
                if (emailInput) emailInput.value = storedEmail;
            }
            if (storedPhone) {
                const phoneInput = contactForm.querySelector('input[name="Number"]');
                if (phoneInput) phoneInput.value = storedPhone;
            }
        });
    }

    // Initial call to pre-fill forms on page load
    autoFillForms();

    // Profile Form Submission & Edit Logic
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = profileForm.querySelector('#profile-name');
            const emailInput = profileForm.querySelector('#profile-email');
            const phoneInput = profileForm.querySelector('#profile-phone');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();

            // Validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            // Update localStorage with new details
            localStorage.setItem('ajor_user_full_name', name);
            localStorage.setItem('ajor_user_name', name.split(' ')[0]); // Update first name for welcome message
            localStorage.setItem('ajor_user_email', email);
            localStorage.setItem('ajor_user_phone', phone);

            // Update UI and other forms
            updateLoginUI();
            autoFillForms();

            alert("Profile updated successfully!");
            if (profileModal) profileModal.classList.remove('active');
        });
    }

    // --- Review Star Rating Logic ---
    const stars = document.querySelectorAll('.star-rating-container .star');
    const feedback = document.getElementById('rating-feedback');
    const ratingInput = document.getElementById('selected-rating');
    
    const feedbackMessages = {
        1: "Unsatisfied 😞",
        2: "Fair 😐",
        3: "Good 🙂",
        4: "Very Good 😊",
        5: "Excellent! 🤩"
    };

    if (stars.length > 0) {
        stars.forEach(star => {
            // Hover Effect
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.getAttribute('data-value'));
                highlightStars(value);
                updateFeedback(value);
            });
            
            // Click Effect
            star.addEventListener('click', () => {
                const value = parseInt(star.getAttribute('data-value'));
                ratingInput.value = value;
                highlightStars(value);
                updateFeedback(value);
            });
        });

        // Reset on mouse leave if not clicked
        const starContainer = document.querySelector('.star-rating-container .stars');
        if (starContainer) {
            starContainer.addEventListener('mouseleave', () => {
                const selectedValue = ratingInput.value ? parseInt(ratingInput.value) : 0;
                highlightStars(selectedValue);
                updateFeedback(selectedValue);
            });
        }
    }

    function highlightStars(value) {
        stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            if (sVal <= value) {
                s.style.color = '#ffc107'; // Gold
            } else {
                s.style.color = '#ddd'; // Gray
            }
        });
    }

    function updateFeedback(value) {
        if (value === 0) {
            feedback.textContent = "Select a rating";
            feedback.style.color = "var(--primary-color)";
            return;
        }
        feedback.textContent = feedbackMessages[value];
        if (value <= 2) feedback.style.color = "#dc3545"; // Red
        else if (value === 3) feedback.style.color = "#fd7e14"; // Orange
        else feedback.style.color = "#28a745"; // Green
    }

    // Handle Review Form Submit
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(!ratingInput.value) {
                alert("Please select a star rating.");
                return;
            }
            
            const btn = reviewForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "Submitting...";
            btn.disabled = true;

            const formData = new FormData(reviewForm);
            const formObject = formDataToObject(formData);
            formObject._subject = `New ${formObject.Rating}-Star Rating Received`;

            // Using the same helper function and endpoint pattern
            // Note: You might want to create a separate endpoint or sheet for reviews later
            fetch('https://formsubmit.co/ajax/sdlhp2002@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formObject)
            })
            .then(response => response.json())
            .then(data => {
                alert("Thank you for your review!");
                if (reviewModal) reviewModal.classList.remove('active');
                reviewForm.reset();
                highlightStars(0);
                updateFeedback(0);
                ratingInput.value = "";
            })
            .catch(error => {
                console.error(error);
                alert("Error submitting review.");
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }
});