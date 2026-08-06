import { AppState } from '../state/store.js';
import { formatCurrency } from '../utils/formatters.js';

export function updateCartDrawerUI() {
  const count = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  const bodyContainer = document.getElementById('cart-drawer-body-container');
  const footerContainer = document.getElementById('cart-drawer-footer-container');

  if (!bodyContainer) return;

  if (AppState.cart.length === 0) {
    bodyContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; font-family: var(--font-mono); color: var(--color-slate-light);">
        YOUR MANIFEST IS EMPTY.
      </div>
    `;
    if (footerContainer) {
      footerContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); color: var(--color-slate-light);">
          <span>SUBTOTAL:</span>
          <span>R 0.00</span>
        </div>
      `;
    }
    return;
  }

  const subtotal = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  bodyContainer.innerHTML = AppState.cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div style="flex: 1;">
        <h5 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 4px; color: var(--color-text);">${item.name}</h5>
        <div style="font-size: 0.75rem; color: var(--color-slate-light); font-family: var(--font-mono);">${item.variant || 'Standard'}</div>
        <div style="font-family: var(--font-mono); font-weight: 700; color: var(--color-accent); margin-top: 4px;">${formatCurrency(item.price)}</div>
        <div class="qty-picker" style="margin-top: 8px; transform: scale(0.9); transform-origin: left center;">
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.quantity - 1})">-</button>
          <input type="text" class="qty-input" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${idx})" style="background: none; border: none; color: var(--color-error); font-size: 1.4rem; cursor: pointer; height: fit-content; line-height: 1;" title="Remove">&times;</button>
    </div>
  `).join('');

  if (footerContainer) {
    footerContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-family: var(--font-mono);">
        <span>SUBTOTAL:</span>
        <span style="font-weight: 700; color: var(--color-accent); font-size: 1.15rem;">${formatCurrency(subtotal)}</span>
      </div>
      <button class="btn btn-primary btn-full" onclick="closeCartDrawer(); navigateTo('checkout');">
        PROCEED TO CHECKOUT &rarr;
      </button>
    `;
  }
}

