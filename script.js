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
        speed: 6000,
        spaceBetween: 30,

        // Autoplay
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
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

// 7. Gallery Lightbox Logic (For Continuous Slider)
const gallerySliderImages = document.querySelectorAll('.continuous-gallery-slider img');
const lightbox = document.getElementById('lightbox');

if (lightbox && gallerySliderImages.length > 0) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let currentIndex = 0;
    // Convert NodeList to Array to use index
    const imagesArray = Array.from(gallerySliderImages);

    const openLightbox = (index) => {
        currentIndex = index;
        const img = imagesArray[index];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if(lightboxCaption) lightboxCaption.textContent = img.alt;
        lightbox.classList.add('active');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
    };

    const showNext = (e) => {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % imagesArray.length;
        openLightbox(currentIndex);
    };

    const showPrev = (e) => {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
        openLightbox(currentIndex);
    };

    gallerySliderImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if(nextBtn) nextBtn.addEventListener('click', showNext);
    if(prevBtn) prevBtn.addEventListener('click', showPrev);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
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
    // 0.1 Force menu links to open in same tab
    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.removeAttribute('target');
        link.removeAttribute('rel');
    });
    
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

    // Product page: custom door builder
    const customDoorForm = document.getElementById('custom-door-form');

    if (customDoorForm) {
        const styleInput = document.getElementById('custom-door-style');
        const doorColorInput = document.getElementById('custom-door-color');
        const frameColorInput = document.getElementById('custom-frame-color');
        const widthRange = document.getElementById('custom-door-width');
        const widthValue = document.getElementById('custom-door-width-value');
        const heightRange = document.getElementById('custom-door-height');
        const heightValue = document.getElementById('custom-door-height-value');
        const lockTypeInput = document.getElementById('custom-lock-type');
        const hingesInput = document.getElementById('custom-hinges');
        const handleInput = document.getElementById('custom-handle-finish');
        const openSideInput = document.getElementById('custom-open-side');
        const openDirectionInput = document.getElementById('custom-open-direction');
        const accessoryCloser = document.getElementById('custom-accessory-closer');
        const accessoryPeephole = document.getElementById('custom-accessory-peephole');
        const accessoryStopper = document.getElementById('custom-accessory-stopper');

        const previewStage = document.querySelector('.custom-preview-stage');
        const previewFrame = document.getElementById('custom-preview-frame');
        const previewDoor = document.getElementById('custom-preview-door');
        const previewHinges = document.getElementById('custom-preview-hinges');
        const previewHandle = document.getElementById('custom-preview-handle');
        const previewLockTag = document.getElementById('custom-preview-lock-tag');
        const previewPeephole = document.getElementById('custom-preview-peephole');
        const previewCloser = document.getElementById('custom-preview-closer');
        const previewStopper = document.getElementById('custom-preview-stopper');
        const dimensionWidthLabel = document.getElementById('custom-dimension-width');
        const dimensionHeightLabel = document.getElementById('custom-dimension-height');

        const buildStatus = document.getElementById('custom-build-status');
        const buildMessage = document.getElementById('custom-build-message');
        const buildNotes = document.getElementById('custom-build-notes');
        const fallbackLink = document.getElementById('custom-build-fallback-link');

        if (
            !styleInput || !doorColorInput || !frameColorInput ||
            !widthRange || !widthValue || !heightRange || !heightValue ||
            !lockTypeInput || !hingesInput || !handleInput ||
            !openSideInput || !openDirectionInput || !accessoryCloser ||
            !accessoryPeephole || !accessoryStopper || !previewStage ||
            !previewFrame || !previewDoor || !previewHinges || !previewHandle ||
            !previewLockTag || !previewPeephole || !previewCloser ||
            !previewStopper || !dimensionWidthLabel || !dimensionHeightLabel ||
            !buildStatus || !buildMessage || !buildNotes || !fallbackLink
        ) {
            return;
        }

        const handleColors = {
            steel: '#bfc5cb',
            black: '#2f2f2f',
            brass: '#be8d31'
        };

        const lockLabels = {
            mortise: 'Mortise',
            cylindrical: 'Cylinder',
            smart: 'Smart'
        };

        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

        const getContrastColor = (hexColor) => {
            const r = parseInt(hexColor.substr(1, 2), 16);
            const g = parseInt(hexColor.substr(3, 2), 16);
            const b = parseInt(hexColor.substr(5, 2), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? '#1f1f1f' : '#ffffff';
        };

        const parseDimension = (value, min, max, fallback) => {
            const parsed = parseInt(value, 10);
            if (Number.isNaN(parsed)) return fallback;
            return clamp(parsed, min, max);
        };

        const syncDimensionPair = (rangeInput, numberInput, min, max, fallbackValue) => {
            const applyValue = (rawValue) => {
                const finalValue = parseDimension(rawValue, min, max, fallbackValue);
                rangeInput.value = finalValue.toString();
                numberInput.value = finalValue.toString();
                return finalValue;
            };

            rangeInput.addEventListener('input', () => {
                applyValue(rangeInput.value);
                updateCustomPreview();
            });

            numberInput.addEventListener('input', () => {
                applyValue(numberInput.value);
                updateCustomPreview();
            });

            numberInput.addEventListener('blur', () => {
                applyValue(numberInput.value);
                updateCustomPreview();
            });
        };

        const renderHinges = (count) => {
            previewHinges.innerHTML = '';
            const hingeCount = clamp(count, 2, 4);

            for (let index = 0; index < hingeCount; index += 1) {
                const hinge = document.createElement('span');
                const topPercent = hingeCount === 1 ? 50 : 8 + ((84 / (hingeCount - 1)) * index);
                hinge.style.top = `${topPercent}%`;
                previewHinges.appendChild(hinge);
            }
        };

        const evaluateBuild = (config) => {
            const notes = [];

            if (config.width < 700 || config.width > 1100) {
                notes.push('Width outside standard range (700mm to 1100mm).');
            }

            if (config.height < 1950 || config.height > 2400) {
                notes.push('Height outside standard range (1950mm to 2400mm).');
            }

            if (config.height > 2250 && config.hinges < 4) {
                notes.push('Height above 2250mm requires 4 hinges for stability.');
            }

            if (config.lockType === 'smart' && config.height > 2300) {
                notes.push('Smart lock with this height requires engineering approval.');
            }

            if (config.openDirection === 'outward' && config.accessoryCloser) {
                notes.push('Outward opening with door closer may require custom bracket.');
            }

            if (config.style === 'flush' && config.width > 1050) {
                notes.push('Flush style above 1050mm width needs a reinforced core.');
            }

            return notes;
        };

        const updateBuildStatus = (config) => {
            const notes = evaluateBuild(config);
            const isStandard = notes.length === 0;

            buildStatus.dataset.state = isStandard ? 'ok' : 'manual';
            buildMessage.textContent = isStandard
                ? 'This configuration is available in standard production.'
                : 'This configuration needs manual customization approval.';

            buildNotes.innerHTML = '';
            (isStandard ? [
                'Estimated standard production: 10-15 working days.',
                'Hardware can be finalized during order confirmation.'
            ] : notes).forEach((note) => {
                const noteItem = document.createElement('li');
                noteItem.textContent = note;
                buildNotes.appendChild(noteItem);
            });

            const query = new URLSearchParams({
                source: 'custom-door-builder',
                style: config.style,
                width_mm: config.width.toString(),
                height_mm: config.height.toString(),
                lock: config.lockType,
                hinges: config.hinges.toString(),
                handle: config.handleFinish,
                open_side: config.openSide,
                open_direction: config.openDirection,
                door_color: config.doorColor.replace('#', ''),
                frame_color: config.frameColor.replace('#', ''),
                closer: config.accessoryCloser ? 'yes' : 'no',
                peephole: config.accessoryPeephole ? 'yes' : 'no',
                stopper: config.accessoryStopper ? 'yes' : 'no',
                mode: isStandard ? 'extra-customization' : 'manual-required'
            });
            fallbackLink.href = `contact.html?${query.toString()}`;
            fallbackLink.textContent = isStandard
                ? 'Need Extra Customization? Request Manual Build'
                : 'Manual Customization Required. Send Request';
        };

        const updateCustomPreview = () => {
            const config = {
                style: styleInput.value,
                doorColor: doorColorInput.value,
                frameColor: frameColorInput.value,
                width: parseDimension(widthValue.value, 600, 1200, 900),
                height: parseDimension(heightValue.value, 1800, 2600, 2100),
                lockType: lockTypeInput.value,
                hinges: parseDimension(hingesInput.value, 2, 4, 3),
                handleFinish: handleInput.value,
                openSide: openSideInput.value,
                openDirection: openDirectionInput.value,
                accessoryCloser: accessoryCloser.checked,
                accessoryPeephole: accessoryPeephole.checked,
                accessoryStopper: accessoryStopper.checked
            };

            widthRange.value = config.width.toString();
            widthValue.value = config.width.toString();
            heightRange.value = config.height.toString();
            heightValue.value = config.height.toString();

            const stageWidth = previewStage.clientWidth || 480;
            const stageHeight = previewStage.clientHeight || 460;
            const maxDoorWidth = stageWidth * 0.36;
            const maxDoorHeight = stageHeight * 0.74;
            const scale = Math.min(maxDoorWidth / config.width, maxDoorHeight / config.height);
            const doorWidthPx = Math.max(92, Math.round(config.width * scale));
            const doorHeightPx = Math.max(198, Math.round(config.height * scale));
            const frameInset = 18;

            previewFrame.style.width = `${doorWidthPx + frameInset}px`;
            previewFrame.style.height = `${doorHeightPx + frameInset}px`;
            previewFrame.style.borderColor = config.frameColor;

            previewDoor.style.backgroundColor = config.doorColor;
            previewDoor.dataset.style = config.style;
            previewDoor.dataset.swing = config.openDirection;
            previewDoor.dataset.side = config.openSide;

            const hingeOnLeft = config.openSide === 'left';
            previewHinges.className = `custom-preview-hinges ${hingeOnLeft ? 'left' : 'right'}`;
            renderHinges(config.hinges);

            const handleColor = handleColors[config.handleFinish] || handleColors.steel;
            previewHandle.style.backgroundColor = handleColor;
            previewHandle.style.left = hingeOnLeft ? 'calc(100% - 16px)' : '6px';

            previewLockTag.textContent = lockLabels[config.lockType] || 'Lock';
            previewLockTag.style.left = hingeOnLeft ? 'calc(100% - 66px)' : '24px';

            const contrastColor = getContrastColor(config.doorColor);
            previewLockTag.style.color = contrastColor;
            previewLockTag.style.backgroundColor = 'transparent';
            previewLockTag.style.textShadow = contrastColor === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.5)' : 'none';

            previewPeephole.style.display = config.accessoryPeephole ? 'block' : 'none';
            previewPeephole.style.left = hingeOnLeft ? 'calc(100% - 18px)' : '8px';

            previewCloser.style.display = config.accessoryCloser ? 'block' : 'none';
            previewCloser.style.left = hingeOnLeft ? '8px' : 'calc(100% - 50px)';

            previewStopper.style.display = config.accessoryStopper ? 'block' : 'none';
            previewStopper.style.left = hingeOnLeft ? '61%' : '39%';

            dimensionWidthLabel.textContent = `${config.width} mm`;
            dimensionHeightLabel.textContent = `${config.height} mm`;

            updateBuildStatus(config);
        };

        syncDimensionPair(widthRange, widthValue, 600, 1200, 900);
        syncDimensionPair(heightRange, heightValue, 1800, 2600, 2100);

        customDoorForm.querySelectorAll('select, input[type="color"], input[type="checkbox"]').forEach((input) => {
            input.addEventListener('input', updateCustomPreview);
            input.addEventListener('change', updateCustomPreview);
        });

        window.addEventListener('resize', updateCustomPreview);
        updateCustomPreview();
    }
});
