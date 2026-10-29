// Browser-storage prototypes for shop inventory, wishlist, alerts, and dashboard analytics.
const OWNER_SHOP_ID = 1;
const ownerStorage = {
    catalog: JSON.parse(localStorage.getItem('ownerCatalog') || '[]'),
    views: JSON.parse(localStorage.getItem('ownerProductViews') || '{}'),
    deals: JSON.parse(localStorage.getItem('ownerDealViews') || '{}'),
    history: JSON.parse(localStorage.getItem('ownerPriceHistory') || '{}')
};

ownerStorage.catalog.forEach(item => {
    if (item.removed) {
        const productIndex = products.findIndex(product => product.id === item.id);
        if (productIndex >= 0) products.splice(productIndex, 1);
        const offerIndex = shopProducts.findIndex(offer => offer.productId === item.id && offer.shopId === OWNER_SHOP_ID);
        if (offerIndex >= 0) shopProducts.splice(offerIndex, 1);
        return;
    }
    if (item.custom && !products.some(product => product.id === item.id)) {
        products.push({ id:item.id, name:item.name, brand:item.brand, category:item.category, icon:'📦', price:item.price, rating:5, description:'Owner-added product.', specifications:{Brand:item.brand, Category:item.category} });
    }
    if (!item.custom) {
        const offer = shopProducts.find(entry => entry.productId === item.id && entry.shopId === OWNER_SHOP_ID);
        if (offer) { offer.price = item.price; offer.stock = item.stock; }
        else shopProducts.push({ productId:item.id, shopId:OWNER_SHOP_ID, price:item.price, stock:item.stock, warranty:'1 Year' });
    } else {
        let offer = shopProducts.find(entry => entry.productId === item.id && entry.shopId === OWNER_SHOP_ID);
        if (offer) { offer.price = item.price; offer.stock = item.stock; }
        else shopProducts.push({ productId:item.id, shopId:OWNER_SHOP_ID, price:item.price, stock:item.stock, warranty:'1 Year' });
    }
});

function persistOwnerData() {
    localStorage.setItem('ownerCatalog', JSON.stringify(ownerStorage.catalog));
    localStorage.setItem('ownerProductViews', JSON.stringify(ownerStorage.views));
    localStorage.setItem('ownerDealViews', JSON.stringify(ownerStorage.deals));
    localStorage.setItem('ownerPriceHistory', JSON.stringify(ownerStorage.history));
}

function getOwnerInventory() {
    const base = products.map(product => {
        const offer = shopProducts.find(item => item.productId === product.id && item.shopId === OWNER_SHOP_ID);
        const custom = ownerStorage.catalog.find(item => item.id === product.id && !item.removed);
        const removed = ownerStorage.catalog.find(item => item.id === product.id && item.removed);
        if (removed) return null;
        return {
            id: product.id,
            name: custom?.name || product.name,
            brand: custom?.brand || product.brand,
            category: custom?.category || product.category,
            price: custom?.price ?? offer?.price ?? product.price,
            stock: custom?.stock ?? offer?.stock ?? 0
        };
    }).filter(Boolean);
    return base.concat(ownerStorage.catalog.filter(item => item.custom && !item.removed && !products.some(product => product.id === item.id)));
}

function openDashboard(type) {
    if (type === 'shop') {
        if (sessionStorage.getItem('nearbyOwnerSession')) window.location.href = 'owner-dashboard.html';
        else window.location.href = 'owner-login.html';
    } else if (typeof openAdminDashboard === 'function') openAdminDashboard();
}

function openShopOwnerDashboard() {
    const inventory = getOwnerInventory();
    const totalViews = Object.values(ownerStorage.views).reduce((sum, value) => sum + value, 0);
    const dealsViewed = Object.values(ownerStorage.deals).reduce((sum, value) => sum + value, 0);
    const rows = inventory.map(item => `<tr>
        <td><strong>${item.name}</strong><br><small>${item.brand} · ${item.category}</small></td>
        <td>₹${Number(item.price).toLocaleString()}</td>
        <td><span class="stock-pill ${item.stock > 0 ? 'live' : ''}">${item.stock > 0 ? item.stock + ' in stock' : 'Out of stock'}</span></td>
        <td>${ownerStorage.views[item.id] || 0}</td>
        <td class="table-actions"><button onclick="editOwnerProduct(${item.id})">Edit</button><button class="danger-action" onclick="removeOwnerProduct(${item.id})">Remove</button></td>
    </tr>`).join('');
    openFeatureModal('Shop owner dashboard', 'CATALOG & PERFORMANCE', `<div class="dashboard-stats"><div><small>Catalog products</small><strong>${inventory.length}</strong></div><div><small>Product views</small><strong>${totalViews}</strong></div><div><small>Deal views</small><strong>${dealsViewed}</strong></div></div><div class="owner-toolbar"><button class="primary-btn" onclick="addOwnerProduct()">+ Add product</button><button onclick="openOwnerReviews()">Manage reviews</button></div><div class="owner-table-wrap"><table class="owner-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Views</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`);
}

function ownerProductForm(product = null) {
    return `<form class="feature-form owner-product-form" onsubmit="saveOwnerProduct(event,${product?.id || 'null'})">
        <div class="owner-form-grid"><label>Product name<input name="name" required value="${product?.name || ''}" placeholder="Example: Redmi Note 15"></label><label>Brand<input name="brand" required value="${product?.brand || ''}" placeholder="Brand"></label></div>
        <div class="owner-form-grid"><label>Category<select name="category" required>${['Mobile','Laptop','TV','Headphones','Camera','Gaming'].map(category => `<option ${product?.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></label><label>Price (₹)<input name="price" type="number" min="1" required value="${product?.price || ''}"></label></div>
        <label>Stock quantity<input name="stock" type="number" min="0" required value="${product?.stock ?? 0}"></label>
        <button class="primary-btn" type="submit">${product ? 'Save changes' : 'Add product'}</button>
    </form>`;
}
function addOwnerProduct() { openFeatureModal('Add product', 'SHOP CATALOG', ownerProductForm()); }
function editOwnerProduct(id) {
    const product = getOwnerInventory().find(item => item.id === id);
    openFeatureModal('Edit product', 'SHOP CATALOG', ownerProductForm(product));
}
function saveOwnerProduct(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    const name = form.get('name');
    const brand = form.get('brand');
    const category = form.get('category');
    const price = Number(form.get('price'));
    const stock = Number(form.get('stock'));
    if (!id) {
        id = Math.max(100, ...products.map(item => Number(item.id) || 0), ...ownerStorage.catalog.map(item => Number(item.id) || 0)) + 1;
        const product = { id, name, brand, category, icon:'📦', price, rating:5, description:'Owner-added product.', specifications:{Brand:brand, Category:category} };
        products.push(product);
        ownerStorage.catalog.push({ id, custom: true, name, brand, category, price, stock });
        shopProducts.push({ productId:id, shopId:OWNER_SHOP_ID, price, stock, warranty:'1 Year' });
        recordPriceHistory(id, price);
    } else {
        const existing = ownerStorage.catalog.find(item => item.id === id);
        if (existing) Object.assign(existing, { name, brand, category, price, stock });
        else ownerStorage.catalog.push({ id, custom: false, name, brand, category, price, stock });
        const offer = shopProducts.find(item => item.productId === id && item.shopId === OWNER_SHOP_ID);
        if (offer) { offer.price = price; offer.stock = stock; }
        else shopProducts.push({ productId:id, shopId:OWNER_SHOP_ID, price, stock, warranty:'1 Year' });
        recordPriceHistory(id, price);
    }
    persistOwnerData();
    openShopOwnerDashboard();
    showToast('Catalog updated', 'success');
}
function removeOwnerProduct(id) {
    const existingIndex = ownerStorage.catalog.findIndex(item => item.id === id);
    const existing = existingIndex >= 0 ? ownerStorage.catalog[existingIndex] : null;
    if (existing?.custom) {
        ownerStorage.catalog.splice(existingIndex, 1);
        const productIndex = products.findIndex(item => item.id === id);
        if (productIndex >= 0) products.splice(productIndex, 1);
    } else if (existingIndex >= 0) {
        Object.assign(ownerStorage.catalog[existingIndex], { removed: true });
    } else {
        ownerStorage.catalog.push({ id, custom: false, removed: true, price:0, stock:0 });
    }
    const offerIndex = shopProducts.findIndex(item => item.productId === id && item.shopId === OWNER_SHOP_ID);
    if (offerIndex >= 0) shopProducts.splice(offerIndex, 1);
    persistOwnerData();
    openShopOwnerDashboard();
    showToast('Product removed from shop catalog', 'success');
}

function openOwnerReviews() {
    const pending = JSON.parse(localStorage.getItem('nearbyModeratedReviews') || '[]');
    const rows = pending.length ? pending.map((review, index) => `<div class="owner-review"><div><strong>${review.shop}</strong><span>★ ${review.rating} · ${review.text}</span></div><div><button onclick="approveOwnerReview(${index})">Approve</button><button class="danger-action" onclick="rejectOwnerReview(${index})">Reject</button></div></div>`).join('') : '<div class="empty-state compact"><h3>No reviews to manage</h3><p>New customer submissions will appear here.</p></div>';
    openFeatureModal('Customer reviews', 'MODERATION', rows);
}
function approveOwnerReview(index) {
    const pending = JSON.parse(localStorage.getItem('nearbyModeratedReviews') || '[]');
    const approved = JSON.parse(localStorage.getItem('nearbyApprovedReviews') || '[]');
    approved.push(pending.splice(index, 1)[0]);
    localStorage.setItem('nearbyModeratedReviews', JSON.stringify(pending));
    localStorage.setItem('nearbyApprovedReviews', JSON.stringify(approved));
    openOwnerReviews(); showToast('Review approved', 'success');
}
function rejectOwnerReview(index) {
    const pending = JSON.parse(localStorage.getItem('nearbyModeratedReviews') || '[]');
    pending.splice(index, 1);
    localStorage.setItem('nearbyModeratedReviews', JSON.stringify(pending));
    openOwnerReviews(); showToast('Review rejected', 'success');
}

function recordPriceHistory(productId, price) {
    ownerStorage.history[productId] = ownerStorage.history[productId] || [];
    ownerStorage.history[productId].push({ price, date: new Date().toISOString() });
    ownerStorage.history[productId] = ownerStorage.history[productId].slice(-12);
}

const originalCompareForAnalytics = window.compareProduct;
window.compareProduct = function(productId) {
    ownerStorage.views[productId] = (ownerStorage.views[productId] || 0) + 1;
    ownerStorage.deals[productId] = (ownerStorage.deals[productId] || 0) + 1;
    persistOwnerData();
    if (typeof originalCompareForAnalytics === 'function') originalCompareForAnalytics(productId);
};

const originalOpenPriceAlert = window.openPriceAlert;
window.openPriceAlert = function(productId) {
    const product = products.find(item => item.id === productId);
    const offer = getInStockOffers(productId);
    const current = offer.length ? Math.min(...offer.map(item => item.price)) : null;
    const history = ownerStorage.history[productId] || (current ? [{ price: current, date: new Date().toISOString() }] : []);
    const alerts = JSON.parse(localStorage.getItem('nearbyPriceAlerts') || '[]');
    const alert = alerts.find(item => item.productId === productId);
    const historyRows = history.slice(-6).map(item => `<div class="history-row"><span>₹${Number(item.price).toLocaleString()}</span><small>${new Date(item.date).toLocaleDateString()}</small></div>`).join('');
    openFeatureModal('Price alert & history', 'PRICE WATCH', `<div class="alert-product"><strong>${product?.name || 'Product'}</strong><span>Current lowest price: ${current ? '₹' + current.toLocaleString() : 'Unavailable'}</span></div><form class="feature-form" onsubmit="saveEnhancedPriceAlert(event,${productId})"><label>Notify me below<input name="targetPrice" type="number" min="1" value="${alert?.targetPrice || current || ''}" required></label><label>Email preference<input name="email" type="email" value="${alert?.email || localStorage.getItem('preferredEmail') || ''}" placeholder="you@example.com" required></label><button class="primary-btn" type="submit">${alert ? 'Update alert' : 'Create alert'}</button></form><div class="price-history"><h3>Recent price history</h3>${historyRows || '<p class="muted">No historical data yet.</p>'}</div>`);
};
function saveEnhancedPriceAlert(event, productId) {
    event.preventDefault();
    const data = new FormData(event.target);
    const alerts = JSON.parse(localStorage.getItem('nearbyPriceAlerts') || '[]');
    const existing = alerts.findIndex(item => item.productId === productId);
    const value = { productId, targetPrice:Number(data.get('targetPrice')), email:data.get('email') };
    if (existing >= 0) alerts[existing] = value; else alerts.push(value);
    localStorage.setItem('nearbyPriceAlerts', JSON.stringify(alerts));
    localStorage.setItem('preferredEmail', value.email);
    closeFeatureModal(); showToast('Price alert and preferences saved', 'success');
}

function toggleWishlist(button, productId) {
    window.wishlist = window.wishlist || JSON.parse(localStorage.getItem('nearbyWishlist') || '[]');
    const index = window.wishlist.indexOf(productId);
    if (index >= 0) window.wishlist.splice(index, 1); else window.wishlist.push(productId);
    button.classList.toggle('active', index < 0);
    button.textContent = index < 0 ? '♥' : '♡';
    localStorage.setItem('nearbyWishlist', JSON.stringify(window.wishlist));
    if (typeof updateWishlistCount === 'function') updateWishlistCount();
    showToast(index < 0 ? 'Saved to wishlist' : 'Removed from wishlist', 'success');
}

window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('preferredEmail');
    if (savedEmail && document.getElementById('authEmail')) document.getElementById('authEmail').value = savedEmail;
});
