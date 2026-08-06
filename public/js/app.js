import { store } from './state/store.js';
import { showToast, formatCurrency } from './utils/toast.js';
import { fetchProductsApi, fetchProductBySlugApi, postReviewApi } from './api/productApi.js';
import { loginApi, registerApi, getMeApi } from './api/authApi.js';
import { createOrderApi, fetchOrdersApi } from './api/orderApi.js';
import { fetchProfileApi, updateProfileApi, updateSecurityApi } from './api/userApi.js';
import { renderProductCard } from './components/productCard.js';
import { updateCartDrawerUI } from './components/cartDrawer.js';

let cachedProducts = [];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  store.subscribe(() => {
    updateHeaderUI();
    updateCartDrawerUI();
  });

  // Verify auth session token if present
  if (store.token) {
    try {
      const res = await getMeApi();
      if (res && res.success) {
        store.setAuth(res.user, store.token);
      } else {
        store.logout();
      }
    } catch (e) {
      store.logout();
    }
  }

  updateHeaderUI();
  updateCartDrawerUI();
  renderCurrentView();
});

// --- ROUTER / VIEW ENGINE ---
const renderCurrentView = async () => {
  const main = document.getElementById('app-main');
  if (!main) return;

  if (store.activePage === 'home') {
    await renderHomeView(main);
  } else if (store.activePage === 'detail') {
    await renderDetailView(main);
  } else if (store.activePage === 'checkout') {
    renderCheckoutView(main);
  } else if (store.activePage === 'login') {
    renderLoginView(main);
  } else if (store.activePage === 'orders') {
    await renderOrdersView(main);
  } else if (store.activePage === 'settings') {
    await renderSettingsView(main);
  }
};

// --- VIEWS ---
const renderHomeView = async (container) => {
  container.innerHTML = `
    <!-- HERO BANNER -->
    <section class="hero-section">
      <div class="site-container hero-content">
        <div class="hero-tag">ENGINEERED FOR EXTREME CLIMATES</div>
        <h1 class="hero-title">GEAR UP FOR THE UNFORGIVING.</h1>
        <p class="hero-sub">
          High-altitude tents, carbon-reinforced footwear, and ultralight tactical equipment tested in sub-zero alpine conditions.
        </p>
        <div style="display: flex; gap: 16px; margin-top: 24px;">
          <button class="btn btn-primary" onclick="filterByNav('All')">EXPLORE MANIFEST</button>
          <button class="btn btn-secondary" onclick="filterByNav('Footwear')">FOOTWEAR</button>
        </div>
      </div>
    </section>

    <!-- CATALOG CONTROLS BAR -->
    <section class="site-container" style="margin-top: 40px;">
      <div class="catalog-header">
        <div>
          <h2 style="font-size: 1.5rem; font-family: var(--font-display);">EQUIPMENT MANIFEST</h2>
          <p style="font-size: 0.85rem; color: var(--color-slate-light);">FIELD-READY TECHNICAL GEAR</p>
        </div>

        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <select id="sort-select" class="form-control" style="width: auto; font-size: 0.85rem;" onchange="handleSortChange(this.value)">
            <option value="newest">Sort: Newest Arrival</option>
            <option value="price_asc">Sort: Price (Low to High)</option>
            <option value="price_desc">Sort: Price (High to Low)</option>
            <option value="rating">Sort: Highest Rating</option>
          </select>
        </div>
      </div>

      <!-- CATEGORY PILLS -->
      <div class="category-pills">
        ${['All', 'Footwear', 'Hiking', 'Camping', 'Apparel', 'Running'].map(cat => `
          <button class="pill-btn ${store.currentCategory === cat ? 'active' : ''}" onclick="filterByNav('${cat}')">
            ${cat.toUpperCase()}
          </button>
        `).join('')}
      </div>

      <!-- PRODUCT GRID -->
      <div id="product-grid-container" class="product-grid" style="margin-top: 24px;">
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--color-slate-light);">
          Loading tactical equipment manifest...
        </div>
      </div>
    </section>
  `;

  try {
    const res = await fetchProductsApi({
      category: store.currentCategory,
      search: store.searchQuery,
      sort: store.currentSort
    });

    if (res && res.success) {
      cachedProducts = res.products;
      const grid = document.getElementById('product-grid-container');
      if (grid) {
        if (cachedProducts.length === 0) {
          grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--color-slate-light);">No gear found matching criteria.</div>`;
        } else {
          grid.innerHTML = cachedProducts.map(renderProductCard).join('');
        }
      }
    }
  } catch (e) {
    showToast('Error loading product catalog', 'error');
  }
};

const renderDetailView = async (container) => {
  if (!store.selectedProductSlug) {
    store.activePage = 'home';
    renderCurrentView();
    return;
  }

  container.innerHTML = `<div class="site-container" style="padding: 60px 0; text-align: center;">Loading gear specifications...</div>`;

  try {
    const res = await fetchProductBySlugApi(store.selectedProductSlug);
    if (!res || !res.success) {
      showToast('Product not found', 'error');
      store.activePage = 'home';
      renderCurrentView();
      return;
    }

    const p = res.product;
    const isWishlisted = store.wishlist.includes(p.id);
    const specsObj = p.specs ? JSON.parse(p.specs) : {};

    container.innerHTML = `
      <div class="site-container" style="padding: 40px 0;">
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('home')" style="margin-bottom: 24px;">
          ← BACK TO MANIFEST
        </button>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div>
            <img src="${p.image}" alt="${p.name}" style="width: 100%; border: 1px solid var(--color-border); background: #0c120e;">
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-accent); font-weight: 700;">${p.category.toUpperCase()}</div>
            <h1 style="font-family: var(--font-display); font-size: 2.2rem; margin: 8px 0 16px; color: #fff;">${p.name}</h1>
            <div style="font-family: var(--font-mono); font-size: 1.5rem; color: var(--color-accent); font-weight: 700; margin-bottom: 16px;">
              ${formatCurrency(p.price)}
            </div>
            <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">${p.description}</p>

            <div style="display: flex; gap: 16px; margin-bottom: 32px;">
              <button class="btn btn-primary" style="flex: 1;" onclick="addToCartFromDetail(${p.id})">ADD TO MANIFEST</button>
              <button class="icon-badge-btn" style="width: 48px; height: 48px;" onclick="toggleWishlist(${p.id})">
                <svg width="20" height="20" fill="${isWishlisted ? 'var(--color-accent)' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>

            <!-- SPECS TABLE -->
            <h4 style="font-family: var(--font-display); margin-bottom: 12px;">TECHNICAL SPECIFICATIONS</h4>
            <table class="specs-table" style="width: 100%;">
              <tbody>
                ${Object.entries(specsObj).map(([k, v]) => `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-slate-light);">${k}</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid var(--color-border); text-align: right; color: #fff; font-weight: 600;">${v}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    showToast('Failed to load product', 'error');
  }
};

const renderCheckoutView = (container) => {
  if (store.cart.length === 0) {
    container.innerHTML = `
      <div class="site-container" style="padding: 80px 0; text-align: center;">
        <h2>YOUR MANIFEST IS EMPTY</h2>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="navigateTo('home')">RETURN TO CATALOG</button>
      </div>
    `;
    return;
  }

  const subtotal = store.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const shipping = subtotal > 1500 ? 0 : 150;
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + shipping + vat;

  container.innerHTML = `
    <div class="site-container" style="padding: 40px 0;">
      <h2 style="font-family: var(--font-display); margin-bottom: 24px;">SECURE CHECKOUT DISPATCH</h2>
      <div style="display: grid; grid-template-columns: 1fr 400px; gap: 40px;">
        <form onsubmit="handleCheckoutSubmit(event)">
          <div style="background: #0c120e; border: 1px solid var(--color-border); padding: 24px; margin-bottom: 24px;">
            <h4 style="margin-bottom: 16px;">DISPATCH DESTINATION</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <input type="text" id="chk-name" placeholder="Full Name" class="form-control" required value="${store.user ? store.user.fullName : ''}">
              <input type="email" id="chk-email" placeholder="Email Address" class="form-control" required value="${store.user ? store.user.email : ''}">
              <input type="text" id="chk-street" placeholder="Street Address" class="form-control" style="grid-column: 1/-1;" required>
              <input type="text" id="chk-city" placeholder="City" class="form-control" required>
              <input type="text" id="chk-state" placeholder="State/Province" class="form-control" required>
              <input type="text" id="chk-zip" placeholder="Zip/Postal Code" class="form-control" required>
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-lg" type="submit">DISPATCH ORDER & PAY ${formatCurrency(total)}</button>
        </form>

        <div style="background: #0c120e; border: 1px solid var(--color-border); padding: 24px; height: fit-content;">
          <h4 style="margin-bottom: 16px;">ORDER SUMMARY</h4>
          ${store.cart.map(i => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.85rem;">
              <span>${i.name} (x${i.quantity})</span>
              <span style="font-family: var(--font-mono);">${formatCurrency(i.price * i.quantity)}</span>
            </div>
          `).join('')}
          <hr style="border-color: var(--color-border); margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--color-accent); font-family: var(--font-mono);">
            <span>TOTAL:</span>
            <span>${formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderLoginView = (container) => {
  container.innerHTML = `
    <div class="site-container" style="padding: 80px 0; max-width: 480px;">
      <div style="background: #0c120e; border: 1px solid var(--color-border); padding: 32px;">
        <h3 style="font-family: var(--font-display); text-align: center; margin-bottom: 24px;">BASECAMP LOGIN</h3>
        <form onsubmit="handleLoginSubmit(event)">
          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.8rem; font-family: var(--font-mono);">EXPEDITION EMAIL</label>
            <input type="email" id="login-email" class="form-control" required style="margin-top: 4px;">
          </div>
          <div style="margin-bottom: 24px;">
            <label style="font-size: 0.8rem; font-family: var(--font-mono);">PASSKEY</label>
            <input type="password" id="login-password" class="form-control" required style="margin-top: 4px;">
          </div>
          <button class="btn btn-primary btn-block" type="submit">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  `;
};

const renderOrdersView = async (container) => {
  if (!store.user) {
    navigateTo('login');
    return;
  }
  container.innerHTML = `<div class="site-container" style="padding: 60px 0;">Loading expedition history...</div>`;
  try {
    const res = await fetchOrdersApi();
    if (res && res.success) {
      container.innerHTML = `
        <div class="site-container" style="padding: 40px 0;">
          <h2 style="font-family: var(--font-display); margin-bottom: 24px;">EXPEDITION MISSION HISTORY</h2>
          ${res.orders.map(o => `
            <div style="background: #0c120e; border: 1px solid var(--color-border); padding: 20px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-family: var(--font-mono);">
                <span style="color: var(--color-accent); font-weight: 700;">${o.orderNumber}</span>
                <span style="color: #4caf50;">STATUS: ${o.status}</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--color-slate-light);">
                Total: ${formatCurrency(o.totalAmount)} | Address: ${o.shippingAddress}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (e) {
    showToast('Failed to load orders', 'error');
  }
};

const renderSettingsView = async (container) => {
  if (!store.user) {
    navigateTo('login');
    return;
  }
  container.innerHTML = `
    <div class="site-container" style="padding: 40px 0; max-width: 600px;">
      <h2 style="font-family: var(--font-display); margin-bottom: 24px;">COMMAND CENTER PROFILE</h2>
      <div style="background: #0c120e; border: 1px solid var(--color-border); padding: 24px;">
        <p><strong>Name:</strong> ${store.user.fullName}</p>
        <p><strong>Email:</strong> ${store.user.email}</p>
        <p><strong>Loyalty Tier:</strong> ${store.user.loyaltyTier}</p>
        <p><strong>Loyalty Points:</strong> ${store.user.loyaltyPoints}</p>
        <button class="btn btn-secondary" style="margin-top: 16px;" onclick="handleLogout()">LOGOUT</button>
      </div>
    </div>
  `;
};

// --- GLOBAL WINDOW HANDLERS FOR BACKWARD COMPATIBILITY ---
window.navigateTo = (page, slug = null) => {
  store.activePage = page;
  if (slug) store.selectedProductSlug = slug;
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.viewProductDetail = (slug) => window.navigateTo('detail', slug);

window.filterByNav = (cat) => {
  store.currentCategory = cat;
  store.activePage = 'home';
  renderCurrentView();
};

window.quickAddToCart = (productId) => {
  const p = cachedProducts.find(item => item.id === productId);
  if (p) {
    store.addToCart(p, 1);
    showToast(`ADDED ${p.name.toUpperCase()} TO MANIFEST`, 'success');
  }
};

window.addToCartFromDetail = (productId) => {
  window.quickAddToCart(productId);
};

window.toggleWishlist = (productId) => {
  const active = store.toggleWishlist(productId);
  showToast(active ? 'ADDED TO WISHLIST' : 'REMOVED FROM WISHLIST', 'info');
  renderCurrentView();
};

window.openCartDrawer = () => {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.add('active');
};

window.closeCartDrawer = () => {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.remove('active');
};

window.removeFromCart = (index) => store.removeFromCart(index);

window.handleSortChange = (sortVal) => {
  store.currentSort = sortVal;
  renderCurrentView();
};

window.handleHeaderSearch = (e) => {
  if (e.key === 'Enter') window.executeHeaderSearch();
};

window.executeHeaderSearch = () => {
  const input = document.getElementById('header-search-input');
  if (input) {
    store.searchQuery = input.value.trim();
    store.activePage = 'home';
    renderCurrentView();
  }
};

window.handleLoginSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await loginApi(email, password);
    if (res && res.success) {
      store.setAuth(res.user, res.token);
      showToast('AUTHENTICATION SUCCESSFUL', 'success');
      window.navigateTo('home');
    } else {
      showToast(res.error || 'Authentication failed', 'error');
    }
  } catch (err) {
    showToast('Login connection error', 'error');
  }
};

window.handleCheckoutSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    items: store.cart,
    fullName: document.getElementById('chk-name').value,
    email: document.getElementById('chk-email').value,
    streetAddress: document.getElementById('chk-street').value,
    city: document.getElementById('chk-city').value,
    state: document.getElementById('chk-state').value,
    zipCode: document.getElementById('chk-zip').value,
    shippingMethod: 'Standard Ground'
  };

  try {
    const res = await createOrderApi(payload);
    if (res && res.success) {
      store.clearCart();
      showToast('EXPEDITION ORDER DISPATCHED SUCCESSFULLY', 'success');
      window.navigateTo('orders');
    } else {
      showToast(res.error || 'Checkout dispatch failed', 'error');
    }
  } catch (err) {
    showToast('Checkout server error', 'error');
  }
};

window.handleLogout = () => {
  store.logout();
  showToast('LOGGED OUT OF BASECAMP', 'info');
  window.navigateTo('home');
};

const updateHeaderUI = () => {
  const authBtn = document.getElementById('user-auth-btn');
  const wishlistBadge = document.getElementById('wishlist-count-badge');

  if (authBtn) {
    if (store.user) {
      authBtn.title = `Logged in as ${store.user.fullName}`;
      authBtn.onclick = () => window.navigateTo('settings');
    } else {
      authBtn.title = 'Login to Basecamp';
      authBtn.onclick = () => window.navigateTo('login');
    }
  }

  if (wishlistBadge) {
    const count = store.wishlist.length;
    wishlistBadge.textContent = count;
    wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
  }
};
