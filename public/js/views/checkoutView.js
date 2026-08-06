import { AppState } from '../state/store.js';
import { formatCurrency } from '../utils/formatters.js';
import { createOrderApi } from '../api/orderApi.js';
import { showToast } from '../utils/toast.js';

export function renderCheckoutView(container) {
  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="site-container" style="padding: 80px 0; text-align: center;">
        <h2>YOUR MANIFEST IS EMPTY</h2>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="navigateTo('home')">RETURN TO CATALOG</button>
      </div>
    `;
    return;
  }

  const subtotal = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
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
              <input type="text" id="chk-name" placeholder="Full Name" class="form-control" required value="${AppState.user ? AppState.user.fullName : ''}">
              <input type="email" id="chk-email" placeholder="Email Address" class="form-control" required value="${AppState.user ? AppState.user.email : ''}">
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
          ${AppState.cart.map(i => `
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
}
