import { AppState } from '../state/store.js';
import { formatCurrency } from '../utils/formatters.js';
import { createOrderApi } from '../api/orderApi.js';
import { showToast } from '../utils/toast.js';

export function renderCheckoutView(container) {
  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="site-container" style="padding: 80px 0; text-align: center;">
        <h2 style="font-size: 2rem; color: var(--color-primary);">YOUR MANIFEST IS EMPTY</h2>
        <p style="color: var(--color-text-muted); margin: 12px 0 24px;">Select technical equipment from the catalog before proceeding to dispatch checkout.</p>
        <button class="btn btn-primary" onclick="navigateTo('home')">EXPLORE GEAR CATALOG &rarr;</button>
      </div>
    `;
    return;
  }

  const subtotal = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const shipping = subtotal >= 1500 ? 0 : 150;
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + shipping + vat;

  container.innerHTML = `
    <div class="site-container" style="padding-top: 30px; padding-bottom: 60px;">
      <!-- TOP NAVIGATION BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="label-caps" style="color: var(--color-accent);">// EXPEDITION DISPATCH PROTOCOL</span>
          <h1 style="font-size: 2.2rem; color: var(--color-primary); margin: 4px 0 0;">SECURE CHECKOUT DISPATCH</h1>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('home')">&larr; BACK TO CATALOG</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 420px; gap: 32px; align-items: start;">
        <!-- FORM COLUMN -->
        <form onsubmit="handleCheckoutSubmit(event)">
          <!-- DISPATCH DESTINATION -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 32px; margin-bottom: 24px; border-radius: 4px; color: var(--color-text-main);">
            <h3 style="font-size: 1.25rem; color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; margin-bottom: 20px;">
              📍 01 DISPATCH DESTINATION
            </h3>

            <div class="form-group">
              <label class="form-label">FULL NAME</label>
              <input type="text" id="chk-name" placeholder="Alex Honnold" class="form-control" required value="${AppState.user ? AppState.user.fullName : ''}">
            </div>

            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="chk-email" placeholder="alex.honnold@summitforge.com" class="form-control" required value="${AppState.user ? AppState.user.email : ''}">
            </div>

            <div class="form-group">
              <label class="form-label">STREET ADDRESS</label>
              <input type="text" id="chk-street" placeholder="882 Kloof Street, Gardens" class="form-control" required value="${AppState.user?.shippingAddress ? AppState.user.shippingAddress.split(',')[0] : '882 Kloof Street, Gardens'}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">CITY</label>
                <input type="text" id="chk-city" class="form-control" required value="Cape Town">
              </div>
              <div class="form-group">
                <label class="form-label">PROVINCE</label>
                <input type="text" id="chk-state" class="form-control" required value="Western Cape">
              </div>
              <div class="form-group">
                <label class="form-label">POSTAL CODE</label>
                <input type="text" id="chk-zip" class="form-control" required value="8001">
              </div>
            </div>
          </div>

          <!-- PAYMENT AUTHORIZATION -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 32px; margin-bottom: 24px; border-radius: 4px; color: var(--color-text-main);">
            <h3 style="font-size: 1.25rem; color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; margin-bottom: 20px;">
              💳 02 PAYMENT AUTHORIZATION
            </h3>

            <div class="form-group">
              <label class="form-label">CARDHOLDER NAME</label>
              <input type="text" class="form-control" value="${AppState.user ? AppState.user.fullName : 'A H HONNOLD'}" required>
            </div>

            <div class="form-group">
              <label class="form-label">CARD NUMBER</label>
              <input type="text" class="form-control" value="4532 8901 2284 9912" maxlength="19" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">EXPIRY DATE</label>
                <input type="text" class="form-control" value="12 / 28" placeholder="MM / YY" required>
              </div>
              <div class="form-group">
                <label class="form-label">CVV / CVC</label>
                <input type="text" class="form-control" value="882" placeholder="882" required>
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-full" style="padding: 18px; font-size: 1.05rem;" type="submit">
            🔒 PAY ${formatCurrency(total)} & AUTHORIZE DISPATCH &rarr;
          </button>
        </form>

        <!-- SUMMARY COLUMN -->
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 32px; border-radius: 4px; color: var(--color-text-main); position: sticky; top: 100px;">
          <h3 style="font-size: 1.2rem; color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; margin-bottom: 20px;">
            🎒 ORDER SUMMARY
          </h3>

          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; max-height: 300px; overflow-y: auto;">
            ${AppState.cart.map(i => `
              <div style="display: flex; gap: 12px; align-items: center; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 12px;">
                <img src="${i.image}" style="width: 48px; height: 48px; object-fit: cover; border: 1px solid var(--color-border); border-radius: 2px;">
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 0.9rem; color: var(--color-primary);">${i.name}</div>
                  <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-slate-light);">Qty: ${i.quantity} | ${i.variant || 'Standard'}</div>
                </div>
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 0.9rem;">${formatCurrency(i.price * i.quantity)}</div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; font-family: var(--font-mono); font-size: 0.85rem; border-top: 1px solid var(--color-border); padding-top: 16px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-slate-light);">SUBTOTAL:</span>
              <span>${formatCurrency(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-slate-light);">SHIPPING DISPATCH:</span>
              <span style="color: ${shipping === 0 ? 'var(--color-success)' : 'inherit'}; font-weight: ${shipping === 0 ? '700' : 'normal'};">
                ${shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-slate-light);">VAT (15%):</span>
              <span>${formatCurrency(vat)}</span>
            </div>
            <hr style="border-color: var(--color-border); margin: 8px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: var(--color-accent);">
              <span>GRAND TOTAL:</span>
              <span>${formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
