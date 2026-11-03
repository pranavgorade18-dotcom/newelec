// Improvements that preserve filtered state and make prototype limitations explicit.
window.activeProductList = window.activeProductList || products;
const SEARCH_HISTORY_KEY = 'nearbySearchHistory';
const MAX_SEARCH_HISTORY = 6;

function getSearchHistory() {
    try {
        const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
        return Array.isArray(history) ? history.filter(term => typeof term === 'string' && term.trim()) : [];
    } catch {
        return [];
    }
}

function saveSearchHistory(term) {
    const cleanTerm = String(term || '').trim();
    if (!cleanTerm) return;
    const history = getSearchHistory().filter(item => item.toLowerCase() !== cleanTerm.toLowerCase());
    history.unshift(cleanTerm);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_SEARCH_HISTORY)));
}

function updateResultCount(count) {
    const info = document.getElementById('resultInfo');
    if (info) info.textContent = `${count} product${count === 1 ? '' : 's'} found`;
}

function searchProducts() {
    const value = document.getElementById('searchInput').value.toLowerCase().trim();
    saveSearchHistory(document.getElementById('searchInput').value);
    const container = document.getElementById('productsContainer');
    container.innerHTML = '<div class="loading-state"><span class="spinner"></span><p>Searching nearby prices...</p></div>';
    window.setTimeout(() => {
        const category = window.activeCategory || '';
        const searchCategory = document.getElementById('searchCategory')?.value || '';
        const sortMode = document.getElementById('searchSort')?.value || 'relevance';
        let result = products.filter(product => (!category || product.category === category) && (!searchCategory || product.category === searchCategory));
        if (value) {
            const keywords = value.split(/\s+/).filter(Boolean);
            result = result.filter(product => {
                const searchable = `${product.name} ${product.brand} ${product.category} ${Object.values(product.specifications || {}).join(' ')}`.toLowerCase();
                return keywords.every(keyword => searchable.includes(keyword));
            });
        }
        if (sortMode === 'az') result.sort((a, b) => a.name.localeCompare(b.name));
        window.activeProductList = result;
        renderProducts(result);
        updateResultCount(result.length);
    }, 180);
}

function filterCategory(category) {
    window.activeCategory = category;
    let result = products.filter(product => product.category === category);
    window.activeProductList = result;
    renderProducts(result);
    updateResultCount(result.length);
    window.scrollTo({ top: document.querySelector('.container').offsetTop - 80, behavior: 'smooth' });
}

function sortProducts() {
    const value = document.getElementById('sortSelect').value;
    let sorted = [...(window.activeProductList || products)].filter(product => !window.activeCategory || product.category === window.activeCategory);
    const lowestPrice = product => {
        const offers = getInStockOffers(product.id);
        return offers.length ? Math.min(...offers.map(offer => offer.price)) : Number.MAX_SAFE_INTEGER;
    };
    if (value === 'priceLow') sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    if (value === 'priceHigh') sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    if (value === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    renderProducts(sorted);
    updateResultCount(sorted.length);
}

function renderProducts(productList) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    updateResultCount(productList.length);
    if (!productList.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⌕</div><h2>No products found</h2><p>Try a different product, brand, category, or filter.</p></div>';
        return;
    }
    // Use original rendering by rebuilding cards through a temporary call is avoided;
    // The original function implementation remains below only through this script shadowing it.
    productList.forEach(product => {
        const offers = getInStockOffers(product.id);
        const lowest = offers.length ? Math.min(...offers.map(offer => offer.price)) : null;
        const wishlisted = window.wishlist && window.wishlist.includes(product.id);
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `<div class="product-image-wrap"><span class="availability-badge ${offers.length ? 'in-stock' : 'out-stock'}">${offers.length ? 'In stock' : 'Out of stock'}</span><button class="wishlist-button ${wishlisted ? 'active' : ''}" aria-label="Add product to wishlist" onclick="toggleWishlist(this, ${product.id})">${wishlisted ? '♥' : '♡'}</button><img src="${productImages[product.category]}" alt="${product.name}" class="product-image-real" loading="lazy"></div><div class="product-info"><p class="brand">${product.brand}</p><h3>${product.name}</h3><div class="product-rating"><span>★</span> ${product.rating} <small>Verified rating</small></div><p class="starting-label">${lowest ? 'Lowest nearby in-stock price' : 'Price unavailable'}</p><div class="price">${lowest ? '₹' + lowest.toLocaleString() : '—'}</div><label class="compare-checkbox"><input type="checkbox" onchange="toggleProductCompare(this, ${product.id})"> Add to compare</label><div class="product-buttons"><button class="primary-btn" onclick="compareProduct(${product.id})">Compare prices</button><button class="secondary-btn" onclick="openPriceAlert(${product.id})" aria-label="Create price alert">🔔</button><button class="secondary-btn" onclick="showSpecifications(${product.id})" aria-label="View specifications">ⓘ</button></div></div>`;
        container.appendChild(card);
    });
    renderFeaturedDeals(productList);
}

function findBestDeal(offers) {
    const available = offers.filter(offer => offer.stock > 0);
    if (!available.length) return null;
    const prices = available.map(offer => offer.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    available.forEach(offer => {
        const priceScore = maxPrice === minPrice ? 50 : 50 * ((maxPrice - offer.price) / (maxPrice - minPrice));
        const ratingScore = (offer.shop.rating / 5) * 25;
        const distanceScore = Math.max(0, 15 - offer.distance);
        offer.score = Math.round(priceScore + ratingScore + distanceScore + 10);
    });
    available.sort((a, b) => b.score - a.score);
    available[0].lowestInStock = available[0].price === minPrice;
    available[0].recommendationReason = available[0].lowestInStock
        ? 'Recommended because it is the lowest verified in-stock offer, with strong scoring for rating and distance.'
        : 'Recommended by combined price, rating, distance, and in-stock availability—not merely the absolute lowest price.';
    setTimeout(() => {
        const deal = document.getElementById('bestDeal');
        if (!deal || deal.querySelector('.deal-reason')) return;
        const note = document.createElement('p');
        note.className = 'deal-reason';
        note.textContent = available[0].recommendationReason;
        deal.appendChild(note);
    }, 0);
    return available[0];
}

function renderMap(offers) {
    const mapSection = document.getElementById('map');
    if (!window.L) {
        mapSection.innerHTML = '<div class="map-fallback">Map service unavailable. Use the shop list and Directions buttons instead.</div>';
        return;
    }
    if (!map) {
        map = L.map('map').setView([userLocation.lat, userLocation.lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    }
    mapMarkers.forEach(marker => map.removeLayer(marker));
    mapMarkers = [];
    const userMarker = L.marker([userLocation.lat, userLocation.lng]).addTo(map).bindPopup('Your location');
    mapMarkers.push(userMarker);
    offers.forEach(item => {
        if (item.stock <= 0) return;
        const marker = L.marker([item.shop.lat, item.shop.lng]).addTo(map).bindPopup(`<strong>${item.shop.name}</strong><br>₹${item.price.toLocaleString()}<br>${item.shop.verified ? 'Verified shop' : 'Not verified'}`);
        mapMarkers.push(marker);
    });
}

function renderReviews(offers) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    const shopIds = offers.map(offer => offer.shop.id);
    const approved = JSON.parse(localStorage.getItem('nearbyApprovedReviews') || '[]');
    const approvedReviews = approved.map(review => ({ shopId: shops.find(shop => shop.name === review.shop)?.id, user: 'Verified customer', rating: Number(review.rating), text: review.text })).filter(review => review.shopId);
    const visible = reviews.concat(approvedReviews).filter(review => shopIds.includes(review.shopId));
    container.innerHTML = visible.length ? visible.map(review => `<div class="review"><div class="review-user">${review.user}</div><div class="review-stars">${'⭐'.repeat(review.rating)}</div><div class="review-text">${review.text}</div></div>`).join('') : '<p>No reviews available.</p>';
}

function demoGoogleLogin() {
    showToast('Backend authentication is not configured. This prototype cannot sign in a real account.', 'info');
}

function submitAuth(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value;
    const shop = document.getElementById('shopFields').classList.contains('visible');
    if (shop) {
        showToast('Submission requires a verification backend and admin approval. No live account was created.', 'info');
    } else {
        showToast('Email verification requires Firebase or another authentication backend.', 'info');
    }
    closeAuthModal();
}

function submitVerifiedReview(event) {
    event.preventDefault();
    const shop = document.getElementById('reviewShop').value;
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value.trim();
    if (!shop || text.length < 10) { showToast('Complete the review before submitting', 'info'); return; }
    const pending = JSON.parse(localStorage.getItem('nearbyModeratedReviews') || '[]');
    pending.push({ shop, rating: Number(rating), text, status: 'pending' });
    localStorage.setItem('nearbyModeratedReviews', JSON.stringify(pending));
    event.target.reset();
    showToast('Review submitted for moderation; it is not published yet.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownButton = document.querySelector('.nav-dropdown-toggle');
    const backToTop = document.getElementById('backToTop');

    function closeMenu() {
        navLinks?.classList.remove('open');
        menuButton?.classList.remove('active');
        menuButton?.setAttribute('aria-expanded', 'false');
        menuButton?.setAttribute('aria-label', 'Open navigation menu');
    }

    menuButton?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuButton.classList.toggle('active', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });

    dropdownButton?.addEventListener('click', () => {
        const open = !dropdown.classList.contains('open');
        dropdown.classList.toggle('open', open);
        dropdownButton.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', event => {
        if (dropdown && !dropdown.contains(event.target)) {
            dropdown.classList.remove('open');
            dropdownButton?.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMenu();
            dropdown?.classList.remove('open');
            dropdownButton?.setAttribute('aria-expanded', 'false');
        }
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) closeMenu();
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const hash = link.getAttribute('href');
            const target = hash && hash !== '#' ? document.querySelector(hash) : null;
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', hash);
            }
        });
    });

    const navSearchForm = document.getElementById('navSearchForm');
    navSearchForm?.addEventListener('submit', event => {
        event.preventDefault();
        const query = document.getElementById('navSearchInput').value.trim();
        const mainSearch = document.getElementById('searchInput');
        if (!mainSearch) return;
        mainSearch.value = query;
        saveSearchHistory(query);
        searchProducts();
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMenu();
    });

    function availableSuggestions(query) {
        const term = query.toLowerCase().trim();
        const keywords = term.split(/\s+/).filter(Boolean);
        const available = products.filter(product => {
            if (typeof getInStockOffers !== 'function') return true;
            return getInStockOffers(product.id).length > 0;
        });
        const matches = term
            ? available.filter(product => {
                const searchable = `${product.name} ${product.brand} ${product.category} ${Object.values(product.specifications || {}).join(' ')}`.toLowerCase();
                return keywords.every(keyword => searchable.includes(keyword));
            })
            : [...available].sort((a, b) => b.rating - a.rating).slice(0, 6);
        return matches.slice(0, 6);
    }

    function lowestPrice(product) {
        if (typeof getInStockOffers !== 'function') return null;
        const offers = getInStockOffers(product.id);
        return offers.length ? Math.min(...offers.map(offer => offer.price)) : null;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
        })[character]);
    }

    function highlightKeywords(text, query) {
        const safeText = escapeHtml(text);
        const keywords = String(query || '').trim().split(/\s+/).filter(Boolean);
        if (!keywords.length) return safeText;
        let highlighted = safeText;
        keywords.forEach(keyword => {
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            highlighted = highlighted.replace(new RegExp(`(${escapedKeyword})`, 'gi'), '<mark>$1</mark>');
        });
        return highlighted;
    }

    function setupSearchSuggestions(input, suggestionsElement, options = {}) {
        let highlightedIndex = -1;

        function closeSuggestions() {
            suggestionsElement.classList.remove('open');
            suggestionsElement.innerHTML = '';
            highlightedIndex = -1;
        }

        function selectProduct(product) {
            input.value = product.name;
            closeSuggestions();
            document.getElementById('searchInput').value = product.name;
            document.getElementById('navSearchInput').value = product.name;
            saveSearchHistory(product.name);
            searchProducts();
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function selectHistory(term) {
            input.value = term;
            closeSuggestions();
            document.getElementById('searchInput').value = term;
            document.getElementById('navSearchInput').value = term;
            saveSearchHistory(term);
            searchProducts();
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function renderSuggestions() {
            const matches = availableSuggestions(input.value);
            highlightedIndex = -1;
            const history = getSearchHistory().filter(term =>
                !input.value.trim() || term.toLowerCase().includes(input.value.toLowerCase().trim())
            ).slice(0, MAX_SEARCH_HISTORY);
            const popular = ['Samsung', 'Laptop', 'Sony', 'Camera', 'Gaming'];
            const popularHtml = !input.value.trim()
                ? `<div class="suggestion-section-label">Popular searches</div>` +
                  popular.slice(0, 5).map(term => `<button type="button" class="suggestion-item history-suggestion" role="option" aria-selected="false" data-history="${escapeHtml(term)}">
                    <span class="suggestion-icon history-icon" aria-hidden="true">↗</span>
                    <span class="suggestion-copy"><strong>${escapeHtml(term)}</strong><span>Popular search</span></span>
                    <span class="suggestion-price">Search</span>
                  </button>`).join('')
                : '';
            const historyHtml = history.length && !input.value.trim()
                ? `<div class="suggestion-section-label">Recent searches <button type="button" class="clear-history-button">Clear</button></div>` +
                  history.map(term => `<button type="button" class="suggestion-item history-suggestion" role="option" aria-selected="false" data-history="${escapeHtml(term)}">
                    <span class="suggestion-icon history-icon" aria-hidden="true">↻</span>
                    <span class="suggestion-copy"><strong>${escapeHtml(term)}</strong><span>Search history</span></span>
                    <span class="suggestion-price">Search</span>
                  </button>`).join('')
                : '';
            const noResultsHtml = input.value.trim() && !matches.length
                ? `<div class="no-search-results"><span>⌕</span><strong>No results found</strong><p>Try another product, brand, or category.</p></div>`
                : '';
            const productsHtml = matches.map((product, index) => {
                const price = lowestPrice(product);
                return `<button type="button" class="suggestion-item" role="option" aria-selected="false" data-index="${index}" data-product-id="${product.id}">
                    <span class="suggestion-icon" aria-hidden="true">${product.icon || '📱'}</span>
                    <span class="suggestion-copy"><strong>${highlightKeywords(product.name, input.value)}</strong><span>${highlightKeywords(product.brand + ' · ' + product.category, input.value)} · ★ ${product.rating}</span></span>
                    <span class="suggestion-price">${price ? '₹' + price.toLocaleString() : 'In stock'}</span>
                </button>`;
            }).join('');
            suggestionsElement.innerHTML = historyHtml + popularHtml + (matches.length ? `<div class="suggestion-section-label">Available products</div>` + productsHtml : '') + noResultsHtml;
            suggestionsElement.classList.add('open');
        }

        input.addEventListener('input', renderSuggestions);
        input.addEventListener('focus', () => {
            if (input.value.trim()) renderSuggestions();
            else if (options.showWhenEmpty) renderSuggestions();
        });

        input.addEventListener('keydown', event => {
            const items = [...suggestionsElement.querySelectorAll('.suggestion-item')];
            if (!items.length && event.key !== 'Enter') return;

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!suggestionsElement.classList.contains('open')) renderSuggestions();
                const visibleItems = [...suggestionsElement.querySelectorAll('.suggestion-item')];
                if (!visibleItems.length) return;
                highlightedIndex = event.key === 'ArrowDown'
                    ? (highlightedIndex + 1) % visibleItems.length
                    : (highlightedIndex <= 0 ? visibleItems.length - 1 : highlightedIndex - 1);
                visibleItems.forEach((item, index) => {
                    item.classList.toggle('highlighted', index === highlightedIndex);
                    item.setAttribute('aria-selected', String(index === highlightedIndex));
                });
            } else if (event.key === 'Enter') {
                const item = highlightedIndex >= 0 ? items[highlightedIndex] : items[0];
                if (item) {
                    event.preventDefault();
                    if (item.dataset.history) {
                        selectHistory(item.dataset.history);
                        return;
                    }
                    const product = products.find(candidate => candidate.id === Number(item.dataset.productId));
                    if (product) selectProduct(product);
                    return;
                }
                closeSuggestions();
                document.getElementById('searchInput').value = input.value;
                document.getElementById('navSearchInput').value = input.value;
                saveSearchHistory(input.value);
                searchProducts();
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (event.key === 'Escape') {
                closeSuggestions();
            }
        });

        suggestionsElement.addEventListener('mousedown', event => {
            const clearButton = event.target.closest('.clear-history-button');
            if (clearButton) {
                event.preventDefault();
                localStorage.removeItem(SEARCH_HISTORY_KEY);
                renderSuggestions();
                return;
            }
            const item = event.target.closest('.suggestion-item');
            if (!item) return;
            event.preventDefault();
            if (item.dataset.history) {
                selectHistory(item.dataset.history);
                return;
            }
            const product = products.find(candidate => candidate.id === Number(item.dataset.productId));
            if (product) selectProduct(product);
        });

        document.addEventListener('click', event => {
            if (!input.contains(event.target) && !suggestionsElement.contains(event.target)) closeSuggestions();
        });
    }

    const navSearchInput = document.getElementById('navSearchInput');
    const heroSearchInput = document.getElementById('searchInput');
    setupSearchSuggestions(navSearchInput, document.getElementById('navSuggestions'), { syncNav:true, showWhenEmpty:true });
    setupSearchSuggestions(heroSearchInput, document.getElementById('heroSuggestions'), { showWhenEmpty:false });

    function syncClearButtons() {
        document.getElementById('navSearchClear')?.classList.toggle('visible', Boolean(navSearchInput?.value));
        document.getElementById('heroSearchClear')?.classList.toggle('visible', Boolean(heroSearchInput?.value));
    }

    navSearchInput?.addEventListener('input', syncClearButtons);
    heroSearchInput?.addEventListener('input', syncClearButtons);

    document.getElementById('navSearchClear')?.addEventListener('click', () => {
        navSearchInput.value = '';
        heroSearchInput.value = '';
        syncClearButtons();
        renderProducts(products);
        document.getElementById('navSuggestions')?.classList.remove('open');
        navSearchInput.focus();
    });

    document.getElementById('heroSearchClear')?.addEventListener('click', () => {
        heroSearchInput.value = '';
        navSearchInput.value = '';
        syncClearButtons();
        renderProducts(products);
        document.getElementById('heroSuggestions')?.classList.remove('open');
        heroSearchInput.focus();
    });

    document.getElementById('searchCategory')?.addEventListener('change', searchProducts);
    document.getElementById('searchSort')?.addEventListener('change', searchProducts);
    document.getElementById('clearSearchFilters')?.addEventListener('click', () => {
        navSearchInput.value = '';
        heroSearchInput.value = '';
        document.getElementById('searchCategory').value = '';
        document.getElementById('searchSort').value = 'relevance';
        window.activeCategory = '';
        window.activeProductList = products;
        syncClearButtons();
        renderProducts(products);
        showToast('Search filters cleared', 'success');
    });
    syncClearButtons();

    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => backToTop?.classList.toggle('visible', window.scrollY > 480), { passive:true });

    const observedSections = ['home', 'featured', 'categories', 'products', 'comparisonSection', 'about']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    const navItems = document.querySelectorAll('.nav-link[data-nav-target]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            navItems.forEach(item => item.classList.toggle('active', item.dataset.navTarget === visible.target.id));
        }, { rootMargin:'-20% 0px -65% 0px', threshold:[0.05,0.25,0.5] });
        observedSections.forEach(section => observer.observe(section));
    }
});
