import { AppState } from '../state/store.js';

export function updateCartDrawerUI() {
  const count = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  const container = document.getElementById('cart-drawer-items');
  if (!container) return;

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; font-family: var(--font-mono); color: var(--color-slate-light);">
        YOUR MANIFEST IS EMPTY.
      </div>
    `;
    const totalEl = document.getElementById('cart-subtotal');
    if (totalEl) totalEl.innerText = 'R 0.00';
    return;
  }

  const subtotal = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalEl = document.getElementById('cart-subtotal');
  if (totalEl) totalEl.innerText = `R ${subtotal.toFixed(2)}`;

  container.innerHTML = AppState.cart.map((item, idx) => `
    <div class="cart-drawer-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <div class="cart-item-variant">${item.variant || 'Standard'}</div>
        <div class="cart-item-price">R ${Number(item.price).toFixed(2)}</div>
        <div class="qty-picker" style="margin-top: 8px;">
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.quantity - 1})">-</button>
          <input type="text" class="qty-input" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">&times;</button>
    </div>
  `).join('');
}
