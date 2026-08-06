/**
 * Global State Management Store
 * Manages reactive state for authentication, cart, wishlist, active page navigation, search, and checkout state.
 * Synchronizes cart, token, and user session to localStorage.
 */

const initialUser = JSON.parse(localStorage.getItem('sf_user') || 'null');

export const AppState = {
  token: localStorage.getItem('sf_token') || null,
  user: initialUser,
  cart: JSON.parse(localStorage.getItem('sf_cart') || '[]'),
  wishlist: initialUser ? JSON.parse(localStorage.getItem(`sf_wishlist_${initialUser.id}`) || '[]') : JSON.parse(localStorage.getItem('sf_wishlist') || '[]'),
  products: [],
  currentProduct: null,
  currentView: 'home',
  activeCategory: 'All',
  searchQuery: '',
  currentSort: 'newest',
  selectedProductSlug: null,
  checkoutStep: 1,
  checkoutShipping: null,
  selectedPaymentMethod: 'card',
  lastCompletedOrder: null,
  orders: [],
  appliedPromo: null,

  listeners: [],

  subscribe(callback) {
    this.listeners.push(callback);
  },

  notify() {
    this.listeners.forEach(cb => cb(this));
  },

  setAuth(user, token) {
    this.user = user;
    this.token = token;
    if (token) localStorage.setItem('sf_token', token);
    else localStorage.removeItem('sf_token');

    if (user) {
      localStorage.setItem('sf_user', JSON.stringify(user));
      this.wishlist = JSON.parse(localStorage.getItem(`sf_wishlist_${user.id}`) || '[]');
    } else {
      localStorage.removeItem('sf_user');
      this.wishlist = [];
    }
    this.notify();
  },

  logout() {
    this.setAuth(null, null);
  },

  setCart(cart) {
    this.cart = cart;
    localStorage.setItem('sf_cart', JSON.stringify(cart));
    this.notify();
  },

  addToCart(product, quantity = 1, variant = 'Standard') {
    const existingIndex = this.cart.findIndex(
      item => item.productId === product.id && item.variant === variant
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        variant
      });
    }
    this.setCart(this.cart);
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.setCart(this.cart);
  },

  updateCartQuantity(index, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(index);
    } else {
      this.cart[index].quantity = newQty;
      this.setCart(this.cart);
    }
  },

  clearCart() {
    this.setCart([]);
  },

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(productId);
    }

    if (this.user) {
      localStorage.setItem(`sf_wishlist_${this.user.id}`, JSON.stringify(this.wishlist));
    } else {
      localStorage.setItem('sf_wishlist', JSON.stringify(this.wishlist));
    }

    this.notify();
    return this.wishlist.includes(productId);
  }
};
