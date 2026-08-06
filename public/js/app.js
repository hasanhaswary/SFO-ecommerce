import { AppState } from './state/store.js';
import { showToast } from './utils/toast.js';
import { updateHeaderUI } from './components/navbar.js';
import { updateCartDrawerUI } from './components/cartDrawer.js';
import { renderHomeView } from './views/homeView.js';
import { renderDetailView } from './views/detailView.js';
import { renderCheckoutView } from './views/checkoutView.js';
import { renderLoginView, renderRegisterView, renderForgotPasswordView } from './views/authViews.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderOrdersView } from './views/ordersView.js';
import { renderSettingsView } from './views/settingsView.js';
import { renderFavoritesView } from './views/favoritesView.js';
import { loginApi, registerApi, getMeApi } from './api/authApi.js';
import { createOrderApi } from './api/orderApi.js';
import { apiRequest } from './api/apiClient.js';

// --- ROUTER / VIEW ENGINE ---
export async function renderApp() {
  updateHeaderUI();
  updateCartDrawerUI();

  const main = document.getElementById('app-main');
  if (!main) return;

  switch (AppState.currentView) {
    case 'home':
      await renderHomeView(main);
      break;
    case 'product':
    case 'detail':
      await renderDetailView(main);
      break;
    case 'login':
      renderLoginView(main);
      break;
    case 'register':
      renderRegisterView(main);
      break;
    case 'forgot':
      renderForgotPasswordView(main);
      break;
    case 'checkout':
      renderCheckoutView(main);
      break;
    case 'dashboard':
      await renderDashboardView(main);
      break;
    case 'orders':
      await renderOrdersView(main);
      break;
    case 'settings':
      renderSettingsView(main);
      break;
    case 'favourites':
    case 'wishlist':
      await renderFavoritesView(main);
      break;
    default:
      await renderHomeView(main);
  }
}

// --- GLOBAL WINDOW EVENT HANDLERS ---
window.goToMainPage = () => {
  AppState.isMainPage = true;
  AppState.activeCategory = 'All';
  AppState.searchQuery = '';
  window.navigateTo('home');
};

window.navigateTo = (view, param = null) => {
  AppState.currentView = view;
  if (view === 'product') {
    AppState.selectedProductSlug = param;
  }
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.selectCategory = (category) => {
  AppState.isMainPage = false;
  AppState.activeCategory = category;
  AppState.searchQuery = '';
  window.navigateTo('home');
};

window.filterByNav = (category) => {
  window.selectCategory(category);
};

window.scrollProductCarousel = (direction) => {
  const container = document.getElementById('products-carousel');
  if (container) {
    const scrollAmount = (280 + 20) * 2 * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

window.addToCart = (productId, quantity = 1, variant = null) => {
  const product = AppState.products.find(p => p.id === productId) || AppState.currentProduct;
  if (!product) return;

  AppState.addToCart(product, quantity, variant || `${product.name} / Standard`);
  showToast(`ADDED TO GEAR MANIFEST: ${product.name}`, 'success');
  window.openCartDrawer();
};

window.quickAddToCart = (productId) => {
  window.addToCart(productId);
};

window.addDetailToCart = () => {
  if (AppState.currentProduct) {
    const qtyInput = document.getElementById('detail-qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    window.addToCart(AppState.currentProduct.id, qty);
  }
};

window.adjustDetailQty = (delta) => {
  const input = document.getElementById('detail-qty-input');
  if (input) {
    const current = parseInt(input.value) || 1;
    input.value = Math.max(1, current + delta);
  }
};

window.updateCartQty = (index, newQty) => {
  AppState.updateCartQuantity(index, newQty);
  updateCartDrawerUI();
};

window.removeFromCart = (index) => {
  AppState.removeFromCart(index);
  updateCartDrawerUI();
};

window.toggleWishlist = (productId) => {
  if (!AppState.user) {
    showToast('PLEASE LOG IN TO SAVE FAVORITES', 'info');
    window.navigateTo('login');
    return;
  }
  const active = AppState.toggleWishlist(productId);
  showToast(active ? 'ADDED TO FAVORITES' : 'REMOVED FROM FAVORITES', active ? 'success' : 'info');
  renderApp();
};

window.openCartDrawer = () => {
  updateCartDrawerUI();
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.add('open');
};

window.closeCartDrawer = () => {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.remove('open');
};

window.toggleWishlistModal = () => {
  window.navigateTo('favourites');
};

window.handleHeaderSearch = (e) => {
  if (e.key === 'Enter') window.executeHeaderSearch();
};

window.executeHeaderSearch = () => {
  const query = document.getElementById('header-search-input')?.value.trim();
  AppState.isMainPage = false;
  AppState.searchQuery = query || '';
  window.navigateTo('home');
};

window.handleLoginSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const data = await loginApi(email, password);
    if (data && data.success) {
      AppState.setAuth(data.user, data.token);
      showToast('BASECAMP AUTHENTICATION SUCCESSFUL', 'success');
      window.navigateTo('dashboard');
    } else {
      showToast(data.error || 'Authentication failed', 'error');
    }
  } catch (err) {
    showToast(err.message || 'Login failed', 'error');
  }
};

window.handleRegisterSubmit = async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const enrollClub = document.getElementById('reg-club').checked;

  try {
    const data = await registerApi({ fullName, email, password, enrollClub });
    if (data && data.success) {
      AppState.setAuth(data.user, data.token);
      showToast('BASECAMP PROTOCOL INITIALIZED', 'success');
      window.navigateTo('dashboard');
    } else {
      showToast(data.error || 'Registration failed', 'error');
    }
  } catch (err) {
    showToast(err.message || 'Registration failed', 'error');
  }
};

window.handleForgotSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  try {
    await apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    showToast('RECOVERY LINK DISPATCHED TO YOUR INBOX', 'success');
    window.navigateTo('login');
  } catch (err) {
    showToast(err.message || 'Forgot password failed', 'error');
  }
};

window.handleCheckoutSubmit = async (e) => {
  e.preventDefault();

  if (!AppState.user) {
    showToast('PLEASE LOG IN TO BASECAMP BEFORE DISPATCHING CHECKOUT', 'error');
    window.navigateTo('login');
    return;
  }

  const items = AppState.cart.map(i => ({
    productId: i.productId || i.id,
    quantity: i.quantity,
    variant: i.variant || `${i.name} / Standard`
  }));

  const payload = {
    items,
    fullName: document.getElementById('chk-name').value,
    email: document.getElementById('chk-email').value,
    shippingAddress: `${document.getElementById('chk-street').value}, ${document.getElementById('chk-city').value}, ${document.getElementById('chk-state').value} ${document.getElementById('chk-zip').value}`,
    shippingMethod: 'Standard Ground'
  };

  try {
    const res = await createOrderApi(payload);
    if (res && res.success) {
      AppState.clearCart();
      showToast(`EXPEDITION ORDER DISPATCHED! (${res.order?.orderNumber || 'CONFIRMED'})`, 'success');
      window.navigateTo('orders');
    } else {
      showToast(res.error || 'Checkout dispatch failed', 'error');
    }
  } catch (err) {
    showToast(err.message || 'Checkout server error', 'error');
  }
};


window.claimRefund = async (orderId) => {
  if (!confirm('Are you sure you want to process a return for this order?')) return;
  try {
    const data = await apiRequest(`/api/orders/${orderId}/refund`, { method: 'POST' });
    showToast(data.message || 'RETURN DISPATCHED', 'success');
    renderApp();
  } catch (err) {
    showToast(err.message || 'Refund claim failed', 'error');
  }
};

window.handleSettingsUpdate = async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('set-name').value;
  const bio = document.getElementById('set-bio').value;
  const twoFactorEnabled = document.getElementById('set-2fa').checked;
  const shippingAddress = document.getElementById('set-shipping').value;

  try {
    const data = await apiRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, bio, shippingAddress })
    });

    await apiRequest('/api/user/security', {
      method: 'PUT',
      body: JSON.stringify({ twoFactorEnabled })
    });

    if (data && data.user) {
      AppState.setAuth(data.user, AppState.token);
    }

    showToast('COMMAND CENTER MANIFEST UPDATED', 'success');
    renderApp();
  } catch (err) {
    showToast(err.message || 'Settings update failed', 'error');
  }
};

window.retireAccount = async () => {
  if (!confirm('CRITICAL ACTION: Are you sure you want to permanently delete your account?')) return;
  try {
    await apiRequest('/api/user/retire', { method: 'DELETE' });
    showToast('ACCOUNT RETIRED AND PURGED', 'info');
    window.handleLogout();
  } catch (err) {
    showToast(err.message || 'Account deletion failed', 'error');
  }
};

window.handleLogout = () => {
  AppState.logout();
  showToast('LOGGED OUT OF BASECAMP', 'info');
  window.navigateTo('home');
};

// --- INITIALIZATION & SUBSCRIPTIONS ---
AppState.subscribe(() => {
  updateHeaderUI();
  updateCartDrawerUI();
});

document.addEventListener('DOMContentLoaded', async () => {
  AppState.isMainPage = true;
  AppState.currentView = 'home';
  AppState.activeCategory = 'All';
  AppState.searchQuery = '';

  if (AppState.token) {
    try {
      const data = await getMeApi();
      if (data && data.user) {
        AppState.setAuth(data.user, AppState.token);
      }
    } catch (e) {
      AppState.logout();
    }
  }

  renderApp();
});

