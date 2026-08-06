import { AppState } from '../state/store.js';
import { fetchOrdersApi } from '../api/orderApi.js';
import { formatCurrency } from '../utils/formatters.js';
import { showToast } from '../utils/toast.js';

export async function renderOrdersView(container) {
  if (!AppState.user) {
    window.navigateTo('login');
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
}
