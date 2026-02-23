document.addEventListener('DOMContentLoaded', () => {
    // Check if PRODUCTS data is available
    if (typeof PRODUCTS === 'undefined') {
        console.error('Error: products-data.js is not loaded or PRODUCTS array is missing.');
        return;
    }

    // Helper function to format price
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return `₹${price.toLocaleString('en-IN')}`;
        }
        return price; // Return string as is (e.g., "As per market price")
    };

    // --- START: FILTERING LOGIC FOR PRODUCT PAGE ---

    const productPageGrid = document.getElementById('product-page-grid');
    if (productPageGrid) {
        // --- 0. Prepare Data: Flatten DOOR_CATALOG with Product Details ---
        // We want to show individual door designs, but filter them by their parent product's attributes.
        let allDoorItems = [];
        if (typeof DOOR_CATALOG !== 'undefined') {
            allDoorItems = DOOR_CATALOG.map(door => {
                const parentProduct = PRODUCTS.find(p => p.id === door.category);
                if (!parentProduct) return null;
                return {
                    ...door, // code, image, category
                    productName: parentProduct.name,
                    price: parentProduct.price,
                    specifications: parentProduct.specifications,
                    productId: parentProduct.id
                };
            }).filter(item => item !== null);
        }

        // --- 1. State and Element References ---
        let currentFilters = {
            category: 'all',
            height: '',
            width: '',
            price: null // Will be set from max price in data
        };

        const categoryContainer = document.getElementById('category-filters');
        const heightSelect = document.getElementById('height-filter');
        const widthSelect = document.getElementById('width-filter');
        const priceSlider = document.getElementById('price-filter');
        const priceValueDisplay = document.getElementById('price-filter-value');
        const resetBtn = document.getElementById('reset-filters-btn');
        const noResultsMessage = document.getElementById('no-results-message');

        // --- 2. Initialization Functions ---

        function initializeFilters() {
            populateCategoryFilters();
            populateSizeFilters();
            initializePriceFilter();
            addEventListeners();
            applyFiltersAndRender(); // Initial render of all door items
        }

        function populateCategoryFilters() {
            if (!categoryContainer) return;
            const categories = ['all', ...new Set(PRODUCTS.map(p => p.name))];
            categoryContainer.innerHTML = categories.map(cat =>
                `<button class="filter-btn ${cat.toLowerCase() === 'all' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
            ).join('');
        }

        function populateSizeFilters() {
            if (!heightSelect || !widthSelect) return;

            const allHeights = new Set();
            const allWidths = new Set();

            PRODUCTS.forEach(product => {
                if (product.specifications.Height) {
                    product.specifications.Height.split(',').forEach(h => allHeights.add(parseInt(h.trim().replace(/"/g, ''))));
                }
                if (product.specifications.Width) {
                    product.specifications.Width.split(',').forEach(w => allWidths.add(parseInt(w.trim().replace(/"/g, ''))));
                }
            });

            const sortedHeights = Array.from(allHeights).filter(h => !isNaN(h)).sort((a, b) => a - b);
            const sortedWidths = Array.from(allWidths).filter(w => !isNaN(w)).sort((a, b) => a - b);

            heightSelect.innerHTML += sortedHeights.map(h => `<option value="${h}">${h}"</option>`).join('');
            widthSelect.innerHTML += sortedWidths.map(w => `<option value="${w}">${w}"</option>`).join('');
        }

        function initializePriceFilter() {
            if (!priceSlider || !priceValueDisplay) return;

            const prices = PRODUCTS.map(p => p.price).filter(p => typeof p === 'number');
            const maxPrice = Math.max(...prices, 5000); // Ensure a minimum max
            const roundedMax = Math.ceil(maxPrice / 1000) * 1000;

            priceSlider.max = roundedMax;
            priceSlider.value = roundedMax;
            currentFilters.price = roundedMax;
            priceValueDisplay.textContent = `Up to ₹${parseInt(priceSlider.value).toLocaleString('en-IN')}`;
        }

        // --- 3. Event Handling ---

        function addEventListeners() {
            if (categoryContainer) {
                categoryContainer.addEventListener('click', e => {
                    if (e.target.tagName === 'BUTTON') {
                        currentFilters.category = e.target.dataset.category;
                        categoryContainer.querySelector('.active').classList.remove('active');
                        e.target.classList.add('active');
                        applyFiltersAndRender();
                    }
                });
            }

            if (heightSelect) heightSelect.addEventListener('change', () => { currentFilters.height = heightSelect.value; applyFiltersAndRender(); });
            if (widthSelect) widthSelect.addEventListener('change', () => { currentFilters.width = widthSelect.value; applyFiltersAndRender(); });

            if (priceSlider) {
                priceSlider.addEventListener('input', () => { priceValueDisplay.textContent = `Up to ₹${parseInt(priceSlider.value).toLocaleString('en-IN')}`; });
                priceSlider.addEventListener('change', () => { currentFilters.price = parseInt(priceSlider.value); applyFiltersAndRender(); });
            }
            
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    currentFilters = { category: 'all', height: '', width: '', price: parseInt(priceSlider.max) };
                    if (categoryContainer) {
                        categoryContainer.querySelector('.active').classList.remove('active');
                        categoryContainer.querySelector('[data-category="all"]').classList.add('active');
                    }
                    if (heightSelect) heightSelect.value = '';
                    if (widthSelect) widthSelect.value = '';
                    if (priceSlider) {
                        priceSlider.value = priceSlider.max;
                        priceValueDisplay.textContent = `Up to ₹${parseInt(priceSlider.value).toLocaleString('en-IN')}`;
                    }
                    applyFiltersAndRender();
                });
            }
        }

        // --- 4. Filtering and Rendering ---

        function applyFiltersAndRender() {
            let filteredItems = [...allDoorItems];

            if (currentFilters.category !== 'all') {
                filteredItems = filteredItems.filter(item => item.productName === currentFilters.category);
            }

            if (currentFilters.price !== null) {
                filteredItems = filteredItems.filter(item => typeof item.price !== 'number' || item.price <= currentFilters.price);
            }

            if (currentFilters.height) {
                filteredItems = filteredItems.filter(item => {
                    if (!item.specifications.Height) return false;
                    const availableHeights = item.specifications.Height.split(',').map(h => h.trim().replace(/"/g, ''));
                    return availableHeights.includes(currentFilters.height);
                });
            }

            if (currentFilters.width) {
                filteredItems = filteredItems.filter(item => {
                    if (!item.specifications.Width) return false;
                    const availableWidths = item.specifications.Width.split(',').map(w => w.trim().replace(/"/g, ''));
                    return availableWidths.includes(currentFilters.width);
                });
            }

            renderProductGrid(filteredItems);
        }

        function renderProductGrid(items) {
            if (items.length === 0) {
                productPageGrid.innerHTML = '';
                if (noResultsMessage) noResultsMessage.style.display = 'block';
            } else {
                if (noResultsMessage) noResultsMessage.style.display = 'none';
                const productCards = items.map(item => `
                    <div class="products">
                        <a href="product-details.html?id=${item.productId}">
                            <img src="${item.image}" alt="${item.code}" class="Products-image" loading="lazy">
                            <h3 class="name">${item.code}</h3>
                            <div class="product-price" style="font-size: 0.9rem; margin-top: 5px;">${formatPrice(item.price)}</div>
                        </a>
                    </div>
                `).join('');
                productPageGrid.innerHTML = productCards;
            }
        }

        initializeFilters();
    }

    // --- RENDER LOGIC FOR HOME PAGE SLIDER (Unaffected) ---
    const homeProductSlider = document.getElementById('home-product-slider');
    if (homeProductSlider) {
        const productSlides = PRODUCTS.map(product => `
            <li class="products swiper-slide">
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.mainImage}"
                         alt="${product.name}" class="Products-image"
                         loading="lazy" decoding="async">
                    <h3 class="name">${product.name}</h3>
                </a>
            </li>
        `).join('');

        homeProductSlider.innerHTML = productSlides;

        // If Swiper is initialized in script.js, it may need to be updated.
        if (window.productSlider && typeof window.productSlider.update === 'function') {
            window.productSlider.update();
        }
    }
});