window.wishlist = JSON.parse(localStorage.getItem('nearbyWishlist') || '[]');
window.priceAlerts = JSON.parse(localStorage.getItem('nearbyPriceAlerts') || '[]');

function saveWishlist() {
    localStorage.setItem('nearbyWishlist', JSON.stringify(window.wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const count = document.getElementById('wishlistCount');
    if (count) count.textContent = window.wishlist.length;
}

function toggleWishlist(button, productId) {
    const index = window.wishlist.indexOf(productId);
    if (index >= 0) window.wishlist.splice(index, 1); else window.wishlist.push(productId);
    button.classList.toggle('active', index < 0);
    button.textContent = index < 0 ? '♥' : '♡';
    saveWishlist();
    showToast(index < 0 ? 'Added to wishlist' : 'Removed from wishlist', 'success');
}

function openFeatureModal(title, eyebrow, html) {
    document.getElementById('featureModalTitle').textContent = title;
    document.getElementById('featureModalEyebrow').textContent = eyebrow;
    document.getElementById('featureModalContent').innerHTML = html;
    document.getElementById('featureModal').classList.add('open');
}
function closeFeatureModal() { document.getElementById('featureModal').classList.remove('open'); }

function openWishlist() {
    const saved = products.filter(product => window.wishlist.includes(product.id));
    const html = saved.length ? saved.map(product => `<div class="wishlist-row"><img src="${productImages[product.category]}" alt="${product.name}"><div><strong>${product.name}</strong><span>${product.brand}</span></div><button onclick="toggleWishlist(document.querySelector('.wishlist-button'),${product.id});openWishlist()">Remove</button><button onclick="compareProduct(${product.id});closeFeatureModal()">View prices</button></div>`).join('') : '<div class="empty-state compact"><h3>Your wishlist is empty</h3><p>Tap the heart on a product to save it here.</p></div>';
    openFeatureModal('Saved products', 'WISHLIST', html);
}

function toggleProductCompare(checkbox, productId) {
    window.compareSelection = window.compareSelection || new Set();
    checkbox.checked ? window.compareSelection.add(productId) : window.compareSelection.delete(productId);
    updateMultiCompareBar();
}
function updateMultiCompareBar() {
    const count = window.compareSelection?.size || 0;
    document.getElementById('multiCompareCount').textContent = count;
    document.getElementById('multiCompareBar').classList.toggle('show', count > 0);
}
function clearProductCompare() {
    window.compareSelection?.clear();
    document.querySelectorAll('.compare-checkbox input').forEach(input => input.checked = false);
    updateMultiCompareBar();
}
function openMultiComparison() {
    const selected = [...(window.compareSelection || [])].map(id => products.find(product => product.id === id)).filter(Boolean);
    if (selected.length < 2) { showToast('Select at least two products', 'info'); return; }
    const fields = ['RAM','Storage','Processor','Display','Resolution','SmartTV','HDR','Battery','Screen','Camera'];
    let html = `<div class="compare-table-wrap"><table class="multi-compare-table"><thead><tr><th>Specification</th>${selected.map(p => `<th>${p.name}</th>`).join('')}</tr></thead><tbody>
        <tr><td>Brand</td>${selected.map(p => `<td>${p.brand}</td>`).join('')}</tr>
        <tr><td>Rating</td>${selected.map(p => `<td>★ ${p.rating}</td>`).join('')}</tr>
        <tr><td>Lowest price</td>${selected.map(p => `<td><strong>₹${Math.min(...getInStockOffers(p.id).map(o => o.price)).toLocaleString()}</strong></td>`).join('')}</tr>`;
    fields.forEach(field => html += `<tr><td>${field}</td>${selected.map(p => `<td>${p.specifications[field] || '—'}</td>`).join('')}</tr>`);
    html += '</tbody></table></div>'; 
    openFeatureModal('Product comparison', 'SIDE-BY-SIDE', html);
}

function applyAdvancedFilters() {
    const brand = document.getElementById('brandFilter')?.value;
    const rating = Number(document.getElementById('ratingFilter')?.value || 0);
    const maxPrice = Number(document.getElementById('productPriceFilter')?.value || 0);
    const radius = Number(document.getElementById('radiusFilter')?.value || 999);
    const demoDistanceByShop = {1:1.2,2:2.4,3:4.1,4:6.3,5:8.7};
    let result = products.filter(product => (!brand || product.brand === brand) && product.rating >= rating);
    result = result.filter(product => {
        const offers = getInStockOffers(product.id);
        const nearbyOffers = offers.filter(offer => radius >= 999 || (demoDistanceByShop[offer.shopId] <= radius));
        if (!nearbyOffers.length) return false;
        const lowest = Math.min(...nearbyOffers.map(offer => offer.price));
        return !maxPrice || lowest <= maxPrice;
    });
    window.activeProductList = result;
    renderProducts(result);
}
function resetAdvancedFilters() {
    ['brandFilter','productPriceFilter'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('ratingFilter').value = '0';
    document.getElementById('radiusFilter').value = '999';
    renderProducts(products);
}

function recommendProducts() {
    const budget = Number(document.getElementById('recommendBudget').value || 999999);
    const category = document.getElementById('recommendCategory').value;
    const matches = products.filter(product => (!category || product.category === category) && Math.min(...getInStockOffers(product.id).map(o => o.price)) <= budget)
        .sort((a,b) => (b.rating - a.rating) || (Math.min(...getInStockOffers(a.id).map(o => o.price)) - Math.min(...getInStockOffers(b.id).map(o => o.price))))
        .slice(0,3);
    document.getElementById('recommendationResults').innerHTML = matches.length ? matches.map(product => `<button onclick="compareProduct(${product.id})"><strong>${product.name}</strong><span>★ ${product.rating} · from ₹${Math.min(...getInStockOffers(product.id).map(o => o.price)).toLocaleString()}</span></button>`).join('') : '<p>No exact match found. Try a larger budget.</p>';
}

function openPriceAlert(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    const current = Math.min(...getInStockOffers(productId).map(o => o.price));
    openFeatureModal('Price-drop alert', 'SMART ALERTS', `<form class="feature-form" onsubmit="savePriceAlert(event,${productId})"><p><strong>${product.name}</strong><br>Current lowest price: ₹${current.toLocaleString()}</p><label>Target price<input name="targetPrice" type="number" min="1" required value="${current}"></label><label>Email for notification<input name="email" type="email" required placeholder="you@gmail.com"></label><button class="primary-btn" type="submit">Create alert</button></form>`);
}
function savePriceAlert(event, productId) {
    event.preventDefault();
    const data = new FormData(event.target);
    window.priceAlerts.push({productId, targetPrice:Number(data.get('targetPrice')), email:data.get('email')});
    localStorage.setItem('nearbyPriceAlerts', JSON.stringify(window.priceAlerts));
    closeFeatureModal(); showToast('Price-drop alert created', 'success');
}

function openDashboard(type) {
    if (type === 'shop') {
        openFeatureModal('Shop dashboard', 'SHOP OWNER', `<div class="dashboard-stats"><div><small>Products</small><strong>9</strong></div><div><small>Enquiries</small><strong>14</strong></div><div><small>Verified</small><strong>Yes</strong></div></div><div class="dashboard-actions"><button onclick="showToast('Product editor opened','info')">Add / edit product</button><button onclick="showToast('Stock manager opened','info')">Manage stock</button><button onclick="showToast('Shop details opened','info')">Shop details</button></div>`);
    } else {
        openFeatureModal('Admin dashboard', 'VERIFICATION & MODERATION', `<div class="dashboard-stats"><div><small>Pending shops</small><strong>5</strong></div><div><small>Price reports</small><strong>3</strong></div><div><small>Reviews</small><strong>12</strong></div></div><div class="admin-list"><div><span>Tech World<br><small>GST and location documents</small></span><button onclick="showToast('Shop registration approved','success')">Approve</button></div><div><span>Digital Point<br><small>Review for verification</small></span><button onclick="showToast('Shop sent for recheck','info')">Review</button></div></div>`);
    }
}

function submitVerifiedReview(event) {
    event.preventDefault();
    const shop = document.getElementById('reviewShop').value;
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value.trim();
    if (!shop || text.length < 10) { showToast('Complete the review before submitting', 'info'); return; }
    const reviews = JSON.parse(localStorage.getItem('nearbyModeratedReviews') || '[]');
    reviews.push({ shop, rating: Number(rating), text, status: 'pending' });
    localStorage.setItem('nearbyModeratedReviews', JSON.stringify(reviews));
    event.target.reset();
    showToast('Review submitted for moderation', 'success');
}

function submitShopReview(event) {
    event.preventDefault();
}

window.addEventListener('DOMContentLoaded', () => {
    updateWishlistCount();
    window.compareSelection = new Set();
});
