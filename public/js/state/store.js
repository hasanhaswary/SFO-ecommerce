/**
 * Centralized State Management Store (Pub/Sub Pattern)
 * Holds reactive application state (cart, wishlist, auth tokens, active navigation)
 * and synchronizes state changes to LocalStorage so data persists across browser reloads.
 */
class AppStore {
  constructor() {
    // Restore state from LocalStorage or default to empty values
    this.cart = JSON.parse(localStorage.getItem('sf_cart') || '[]');
    this.wishlist = JSON.parse(localStorage.getItem('sf_wishlist') || '[]');
    this.token = localStorage.getItem('sf_token') || null;
    this.user = JSON.parse(localStorage.getItem('sf_user') || 'null');
    
    // UI Navigation State
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.currentSort = 'newest';
    this.activePage = 'home'; // Active view ('home', 'detail', 'checkout', 'login', 'orders', 'settings')
    this.selectedProductSlug = null;

    // List of subscriber callback functions notified whenever state changes
    this.listeners = [];
  }

  /**
   * Registers a subscriber callback function that runs whenever state is updated
   * @param {Function} listener - Callback function receiving current store instance
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Triggers all subscriber callbacks to re-render UI components on state change
   */
  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  /**
   * Updates cart array and persists to LocalStorage
   * @param {Array} cart - Updated array of cart item objects
   */
  setCart(cart) {
    this.cart = cart;
    localStorage.setItem('sf_cart', JSON.stringify(cart));
    this.notify();
  }

  /**
   * Adds an item to the shopping cart or increments quantity if item variant exists
   * @param {Object} product - Product object
   * @param {number} quantity - Number of items to add
   * @param {string} variant - Product variant selection
   */
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
  }

  /**
   * Removes a product from the cart array by index position
   * @param {number} index - Position index in cart array
   */
  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.setCart(this.cart);
  }

  /**
   * Empties all items from the shopping cart
   */
  clearCart() {
    this.setCart([]);
  }

  /**
   * Toggles product in/out of the user's wishlist array
   * @param {number} productId - Product ID to toggle
   * @returns {boolean} True if product is now wishlisted, false if removed
   */
  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(productId);
    }
    localStorage.setItem('sf_wishlist', JSON.stringify(this.wishlist));
    this.notify();
    return this.wishlist.includes(productId);
  }

  /**
   * Updates authentication state (user profile + JWT token) in store and LocalStorage
   * @param {Object|null} user - User profile object or null if logging out
   * @param {string|null} token - JWT authentication token string or null
   */
  setAuth(user, token) {
    this.user = user;
    this.token = token;
    if (token) localStorage.setItem('sf_token', token);
    else localStorage.removeItem('sf_token');

    if (user) localStorage.setItem('sf_user', JSON.stringify(user));
    else localStorage.removeItem('sf_user');

    this.notify();
  }

  /**
   * Logs out current user by clearing stored auth credentials
   */
  logout() {
    this.setAuth(null, null);
  }
}

// Export singleton instance of AppStore
export const store = new AppStore();
