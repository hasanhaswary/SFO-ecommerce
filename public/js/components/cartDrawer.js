import { store } from '../state/store.js';
import { formatCurrency } from '../utils/formatters.js';

export const updateCartDrawerUI = () => {
  const badge = document.getElementById('cart-count-badge');
  const body = document.getElementById('cart-drawer-body-container');
  const footer = document.getElementById('cart-drawer-footer-container');

  const totalItems = store.cart.reduce((sum, item) => sum + item.quantity, 0);

  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }

  if (!body || !footer) return;

  if (store.cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--color-slate-light);">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin: 0 auto 16px; opacity: 0.4;"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: #fff;">MANIFEST IS EMPTY</h4>
        <p style="font-size: 0.85rem; margin-top: 8px;">No expedition gear loaded into current deployment manifest.</p>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  const subtotal = store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  body.innerHTML = store.cart.map((item, index) => `
    <div style="display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--color-border);">
      <img src="${item.image}" alt="${item.name}" style="width: 64px; height: 64px; object-fit: cover; border: 1px solid var(--color-border);">
      <div style="flex: 1;">
        <h5 style="font-size: 0.9rem; font-weight: 600; color: #fff;">${item.name}</h5>
        <div style="font-size: 0.75rem; color: var(--color-slate-light); margin-top: 2px;">${item.variant}</div>
        <div style="font-family: var(--font-mono); font-weight: 700; color: var(--color-accent); margin-top: 6px;">${formatCurrency(item.price)}</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.1rem;">&times;</button>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #fff;">QTY: ${item.quantity}</span>
      </div>
    </div>
  `).join('');

  footer.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 1rem; color: #fff; margin-bottom: 16px;">
      <span>SUBTOTAL:</span>
      <span style="color: var(--color-accent); font-weight: 700;">${formatCurrency(subtotal)}</span>
    </div>
    <button class="btn btn-primary btn-block" onclick="closeCartDrawer(); navigateTo('checkout');">
      PROCEED TO SECURE CHECKOUT
    </button>
  `;
};
