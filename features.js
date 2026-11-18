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
    const html = saved.length ? saved.map(product => `<div class="wishlist-row"><img src="${product.image || product.fallbackImage || productImages[product.category]}" alt="${product.name}" onerror="this.onerror=null;this.src=${JSON.stringify(product.fallbackImage || '')};"><div><strong>${product.name}</strong><span>${product.brand}</span></div><button onclick="toggleWishlist(document.querySelector('.wishlist-button'),${product.id});openWishlist()">Remove</button><button onclick="compareProduct(${product.id});closeFeatureModal()">View prices</button></div>`).join('') : '<div class="empty-state compact"><h3>Your wishlist is empty</h3><p>Tap the heart on a product to save it here.</p></div>';
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
    const minPrice = Number(document.getElementById('minPriceFilter')?.value || 0);
    const radius = Number(document.getElementById('radiusFilter')?.value || 999);
    const demoDistanceByShop = {1:1.2,2:2.4,3:4.1,4:6.3,5:8.7};
    let result = products.filter(product => (!brand || product.brand === brand) && product.rating >= rating);
    result = result.filter(product => {
        const offers = getInStockOffers(product.id);
        const nearbyOffers = offers.filter(offer => radius >= 999 || (demoDistanceByShop[offer.shopId] <= radius));
        if (!nearbyOffers.length) return false;
        const lowest = Math.min(...nearbyOffers.map(offer => offer.price));
        const effectivePrice = product.discountedPrice || lowest;
        return (!maxPrice || effectivePrice <= maxPrice) && effectivePrice >= minPrice;
    });
    window.activeProductList = result;
    renderProducts(result);
}
function resetAdvancedFilters() {
    ['brandFilter','productPriceFilter','minPriceFilter'].forEach(id => document.getElementById(id).value = '');
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
        openFeatureModal('Shop dashboard', 'SHOP OWNER', `<div class="dashboard-stats"><div><small>Products</small><strong>${products.length}</strong></div><div><small>Enquiries</small><strong>14</strong></div><div><small>Verified</small><strong>Yes</strong></div></div><div class="dashboard-actions"><button onclick="showToast('Product editor opened','info')">Add / edit product</button><button onclick="showToast('Stock manager opened','info')">Manage stock</button><button onclick="showToast('Shop details opened','info')">Shop details</button></div>`);
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

window.cart = JSON.parse(localStorage.getItem('nearbyCart') || '[]');

function saveCart() {
    localStorage.setItem('nearbyCart', JSON.stringify(window.cart));
    updateCartCount();
}

function updateCartCount() {
    const count = document.getElementById('cartCount');
    if (count) count.textContent = window.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    const existing = window.cart.find(item => item.productId === productId);
    if (existing) existing.quantity += 1;
    else window.cart.push({ productId, quantity: 1 });
    saveCart();
    showToast(`${product.name} added to cart`, 'success');
}

function changeCartQuantity(productId, change) {
    const item = window.cart.find(entry => entry.productId === productId);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) window.cart = window.cart.filter(entry => entry.productId !== productId);
    saveCart();
    openCart();
}

function removeFromCart(productId) {
    window.cart = window.cart.filter(item => item.productId !== productId);
    saveCart();
    openCart();
}

function openCart() {
    const rows = window.cart.map(item => {
        const product = products.find(candidate => candidate.id === item.productId);
        if (!product) return '';
        const price = product.discountedPrice || product.price;
        return `<div class="cart-row"><img src="${product.image || product.fallbackImage || productImages[product.category]}" alt="${product.name}" onerror="this.onerror=null;this.src=${JSON.stringify(product.fallbackImage || '')};"><div><strong>${product.name}</strong><span>${product.brand}</span><b>₹${(price * item.quantity).toLocaleString()}</b></div><div class="quantity-controls"><button onclick="changeCartQuantity(${product.id},-1)">−</button><span>${item.quantity}</span><button onclick="changeCartQuantity(${product.id},1)">+</button></div><button class="remove-cart" onclick="removeFromCart(${product.id})">Remove</button></div>`;
    }).join('');
    const total = window.cart.reduce((sum, item) => {
        const product = products.find(candidate => candidate.id === item.productId);
        return sum + (product?.discountedPrice || product?.price || 0) * item.quantity;
    }, 0);
    openFeatureModal('Shopping cart', 'YOUR CART', rows ? `${rows}<div class="cart-summary"><strong>Estimated total</strong><b>₹${total.toLocaleString()}</b></div><button class="primary-btn full-width" onclick="showToast('Checkout requires payment integration','info')">Proceed to checkout</button>` : '<div class="empty-state compact"><h3>Your cart is empty</h3><p>Add a product to begin shopping.</p></div>');
}

function renderRelatedProducts(product) {
    const related = products.filter(candidate => candidate.category === product.category && candidate.id !== product.id).slice(0, 4);
    return related.length ? `<div class="related-products"><h3>Related products</h3><div>${related.map(item => `<button onclick="showSpecifications(${item.id})"><img src="${item.image || item.fallbackImage || productImages[item.category]}" alt="${item.name}" onerror="this.onerror=null;this.src=${JSON.stringify(item.fallbackImage || '')};"><strong>${item.name}</strong><span>₹${(item.discountedPrice || item.price).toLocaleString()}</span></button>`).join('')}</div></div>` : '';
}

window.addEventListener('DOMContentLoaded', () => {
    const brandFilter = document.getElementById('brandFilter');
    [...new Set(products.map(product => product.brand))]
        .sort((a, b) => a.localeCompare(b))
        .forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilter?.appendChild(option);
        });
    const categoryConfig = [
        ["Smartphones","smartphone","#2563eb","#dbeafe"],
        ["Laptops","laptop","#7c3aed","#ede9fe"],
        ["Headphones","headphones","#e11d48","#ffe4e6"],
        ["Smartwatches","watch","#0891b2","#cffafe"],
        ["Gaming","gamepad-2","#9333ea","#f3e8ff"],
        ["Cameras","camera","#ea580c","#ffedd5"],
        ["Speakers","speaker","#db2777","#fce7f3"],
        ["Tablets","tablet","#4f46e5","#e0e7ff"],
        ["Televisions","tv","#0284c7","#e0f2fe"],
        ["Keyboards","keyboard","#475569","#e2e8f0"],
        ["Computer Mouse","mouse","#0f766e","#ccfbf1"],
        ["Chargers","plug-zap","#ca8a04","#fef9c3"],
        ["Power Banks","battery-charging","#16a34a","#dcfce7"],
        ["Cables","cable","#6366f1","#e0e7ff"],
        ["Printers","printer","#b91c1c","#fee2e2"],
        ["Storage Devices","hard-drive","#0369a1","#e0f2fe"],
        ["Networking","router","#059669","#d1fae5"],
        ["Smart Home","house-wifi","#7c3aed","#ede9fe"],
        ["Electronic Components","circuit-board","#c2410c","#ffedd5"],
        ["Accessories","shopping-bag","#be185d","#fce7f3"]
    ];
    const categorySvg = {
        smartphone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
        laptop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
        headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/>',
        watch: '<rect x="6" y="6" width="12" height="12" rx="4"/><path d="M9 2h6l1 4H8l1-4ZM8 18h8l-1 4H9l-1-4ZM9 12h6"/>',
        "gamepad-2": '<path d="M6 11h4M8 9v4M15 11h.01M18 11h.01"/><path d="M7 5h10a5 5 0 0 1 4.8 6.4l-1.2 5.2a2.5 2.5 0 0 1-4.2 1.2L14 15H10l-2.4 2.8a2.5 2.5 0 0 1-4.2-1.2l-1.2-5.2A5 5 0 0 1 7 5Z"/>',
        camera: '<path d="M14.5 4l2 3H21a1 1 0 0 1 1 1v11H2V8a1 1 0 0 1 1-1h4.5l2-3h5Z"/><circle cx="12" cy="13" r="4"/>',
        speaker: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="7" r="1"/><circle cx="12" cy="16" r="1"/>',
        tablet: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
        tv: '<rect x="2" y="4" width="20" height="15" rx="2"/><path d="M8 22h8M12 19v3"/>',
        keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M8 16h8"/>',
        mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v7"/>',
        "plug-zap": '<path d="M12 22v-5M9 8V2M15 8V2M7 8h10v3a5 5 0 0 1-10 0V8ZM13 10l-3 5h4l-3 4"/>',
        "battery-charging": '<rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4M12 8l-3 5h4l-3 5"/>',
        cable: '<path d="M7 3v5a5 5 0 0 0 5 5h0a5 5 0 0 1 5 5v3M17 3v5a5 5 0 0 1-5 5M7 21v-3M17 21v-3"/>',
        printer: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/>',
        "hard-drive": '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="12" cy="12" r="3"/><path d="M7 17h.01M17 17h.01"/>',
        router: '<rect x="3" y="10" width="18" height="8" rx="2"/><path d="M8 18v3M16 18v3M7 6a8 8 0 0 1 10 0M9.5 8.5a4 4 0 0 1 5 0"/>',
        "house-wifi": '<path d="M3 11l9-8 9 8M5 10v10h14V10"/><path d="M12 17h.01M9 14a4.2 4.2 0 0 1 6 0M6.5 11.5a8 8 0 0 1 11 0"/>',
        "circuit-board": '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
        "shopping-bag": '<path d="M6 7h12l2 14H4L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>'
    };
    const categoryContainer = document.querySelector('.category-container');
    if (categoryContainer) {
        categoryContainer.innerHTML = categoryConfig
            .map(([category, icon, accent, tint]) => {
                const count = products.filter(product => product.category === category).length;
                return `<button class="category" type="button" data-category="${category}" style="--category-accent:${accent};--category-tint:${tint}" onclick="filterCategory('${category.replace(/'/g, "\\'")}');return false;">
                    <span class="category-icon-wrap" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${categorySvg[icon] || categorySvg['shopping-bag']}</svg></span>
                    <strong>${category}</strong>
                    <span class="category-meta">${count} products</span>
                    <span class="category-explore">Explore <b aria-hidden="true">→</b></span>
                </button>`;
            })
            .join('');
    }
    const searchCategory = document.getElementById('searchCategory');
    if (searchCategory) {
        [...searchCategory.querySelectorAll('option:not([value=""])')].forEach(option => option.remove());
        [...new Set(products.map(product => product.category))].sort((a, b) => a.localeCompare(b)).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            searchCategory.appendChild(option);
        });
    }
    const recommendCategory = document.getElementById('recommendCategory');
    if (recommendCategory) {
        [...recommendCategory.querySelectorAll('option:not([value=""])')].forEach(option => option.remove());
        [...new Set(products.map(product => product.category))].sort((a, b) => a.localeCompare(b)).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            recommendCategory.appendChild(option);
        });
    }
    updateWishlistCount();
    updateCartCount();
    window.compareSelection = new Set();
});
