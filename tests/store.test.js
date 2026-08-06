import test from 'node:test';
import assert from 'node:assert/strict';
import { AppState } from '../public/js/state/store.js';

test('AppState cart should add items and calculate quantities correctly', (t) => {
  AppState.clearCart();
  assert.equal(AppState.cart.length, 0);

  const product = { id: 1, name: 'Alpine Tent', price: 2500, image: '/img.jpg' };
  AppState.addToCart(product, 2);

  assert.equal(AppState.cart.length, 1);
  assert.equal(AppState.cart[0].quantity, 2);

  AppState.updateCartQuantity(0, 5);
  assert.equal(AppState.cart[0].quantity, 5);

  AppState.removeFromCart(0);
  assert.equal(AppState.cart.length, 0);
});

test('AppState wishlist should toggle items correctly', (t) => {
  AppState.wishlist = [];
  const added = AppState.toggleWishlist(101);
  assert.equal(added, true);
  assert.equal(AppState.wishlist.includes(101), true);

  const removed = AppState.toggleWishlist(101);
  assert.equal(removed, false);
  assert.equal(AppState.wishlist.includes(101), false);
});
