// Improvements that preserve filtered state and make prototype limitations explicit.
window.activeProductList = window.activeProductList || products;

function updateResultCount(count) {
    const info = document.getElementById('resultInfo');
    if (info) info.textContent = `${count} product${count === 1 ? '' : 's'} found`;
}

function searchProducts() {
    const value = document.getElementById('searchInput').value.toLowerCase().trim();
    const container = document.getElementById('productsContainer');
    container.innerHTML = '<div class="loading-state"><span class="spinner"></span><p>Searching nearby prices...</p></div>';
    window.setTimeout(() => {
        const category = window.activeCategory || '';
        let result = products.filter(product => !category || product.category === category);
        if (value) result = result.filter(product => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(value));
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
