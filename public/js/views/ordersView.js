import { AppState } from '../state/store.js';
import { fetchOrdersApi } from '../api/orderApi.js';
import { formatCurrency } from '../utils/formatters.js';
import { showToast } from '../utils/toast.js';

export async function renderOrdersView(container) {
  if (!AppState.user) {
    window.navigateTo('login');
    return;
  }

  try {
    const data = await fetchOrdersApi();
    AppState.orders = data.orders || [];
  } catch (err) {
    console.error('Fetch orders error:', err);
  }

  container.innerHTML = `
    <div class="site-container" style="padding-top: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h1 style="font-size: 2.5rem; color: var(--color-primary); margin-bottom: 4px;">EXPEDITION HISTORY</h1>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width: 600px; margin: 0;">
            Track every mission. Review your tactical acquisitions and manage your elite-tier equipment deployment.
          </p>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('dashboard')">&larr; BACK TO DASHBOARD</button>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('home')">CATALOG &rarr;</button>
        </div>
      </div>

      ${AppState.orders.length === 0 ? `
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 48px; text-align: center; font-family: var(--font-mono); color: var(--color-slate-light); border-radius: 4px;">
          NO EXPEDITION ORDERS LOGGED YET.
        </div>
      ` : AppState.orders.map(o => `
        <div class="order-card" style="background: var(--color-surface); border: 1px solid var(--color-border); margin-bottom: 24px; padding: 24px; border-radius: 4px;">
          <div class="order-card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 16px; margin-bottom: 16px;">
            <div>
              <span class="order-num" style="font-family: var(--font-mono); font-weight: 700; color: var(--color-accent); font-size: 1.1rem; margin-right: 12px;">${o.orderNumber}</span>
              <span class="order-status-badge status-${(o.status || '').toLowerCase()}" style="font-family: var(--font-mono); font-size: 0.75rem; padding: 4px 10px; background: var(--color-primary); color: #ffffff; text-transform: uppercase;">${o.status}</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-slate-light);">
              DEPLOYED: ${new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
            </div>
          </div>

          <div class="order-card-body">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
              <div>
                <span class="label-caps">// EQUIPMENT MANIFEST</span>
                <div class="manifest-items-list" style="margin-top: 12px; display: flex; flex-direction: column; gap: 12px;">
                  ${(o.items || []).map(item => `
                    <div class="manifest-item" style="display: flex; gap: 12px; align-items: center;">
                      <img class="manifest-item-img" src="${item.product?.image || '/assets/images/summit_trek_v2_boots.jpg'}" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid var(--color-border);">
                      <div>
                        <strong style="font-size: 0.9rem;">${item.product?.name || 'Equipment Item'}</strong>
                        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-slate-light);">
                          ${item.variant || 'Standard'} &bull; Qty: ${item.quantity}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div style="text-align: right; min-width: 200px;">
                <span class="label-caps">// TOTAL DISPATCH AMOUNT</span>
                <div style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: var(--color-primary); margin: 4px 0 16px;">
                  ${formatCurrency(o.totalAmount)}
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <button class="btn btn-dark btn-sm" onclick="showToast('PACKAGE TRACKING ACTIVE: EN ROUTE VIA PRIORITY CARRIER', 'info')">TRACK PACKAGE</button>
                  <button class="btn btn-secondary btn-sm" onclick="claimRefund(${o.id})">CLAIM RETURN / REFUND</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
