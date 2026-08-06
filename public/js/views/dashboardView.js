import { AppState } from '../state/store.js';
import { fetchOrdersApi } from '../api/orderApi.js';
import { getMeApi } from '../api/authApi.js';
import { renderProductCard } from '../components/productCard.js';
import { formatCurrency } from '../utils/formatters.js';

export async function renderDashboardView(container) {
  if (!AppState.user) {
    window.navigateTo('login');
    return;
  }

  try {
    const [meRes, ordersRes] = await Promise.all([
      getMeApi(),
      fetchOrdersApi()
    ]);

    if (meRes && meRes.user) {
      AppState.user = meRes.user;
    }
    AppState.orders = ordersRes?.orders || [];
  } catch (err) {
    console.error('Fetch dashboard data error:', err);
  }

  const u = AppState.user;
  const userOrders = AppState.orders || [];

  const activeOrders = userOrders.filter(o => {
    const s = (o.status || '').toUpperCase().replace('_', ' ');
    return s !== 'DELIVERED' && s !== 'CANCELLED' && s !== 'REFUNDED' && s !== 'RETURNED';
  });

  const purchasedProducts = [];
  const purchasedIds = new Set();
  userOrders.forEach(o => {
    if (o.items) {
      o.items.forEach(item => {
        if (item.product && !purchasedIds.has(item.product.id)) {
          purchasedIds.add(item.product.id);
          purchasedProducts.push(item.product);
        }
      });
    }
  });

  const totalSummits = u.totalSummits !== undefined && u.totalSummits !== null ? u.totalSummits : 14;
  const milesLogged = u.milesLogged !== undefined && u.milesLogged !== null ? u.milesLogged : 1248.5;
  const loyaltyPoints = u.loyaltyPoints !== undefined && u.loyaltyPoints !== null ? u.loyaltyPoints : 8450;
  const activeCount = activeOrders.length;

  container.innerHTML = `
    <div class="site-container" style="padding-top: 30px; padding-bottom: 60px;">
      <div class="dashboard-layout">
        <!-- SIDEBAR -->
        <aside class="dash-sidebar">
          <div class="user-profile-summary">
            <div class="user-avatar-circle">${u.fullName ? u.fullName.charAt(0).toUpperCase() : 'E'}</div>
            <h4 style="font-size: 1.05rem; color: var(--color-primary); margin: 6px 0 2px;">${u.fullName}</h4>
            <span class="label-caps">${u.loyaltyTier || 'LEAD EXPLORER'}</span>
          </div>

          <ul class="dash-nav-menu">
            <li class="dash-nav-item active"><a href="#" onclick="navigateTo('dashboard'); return false;">📊 Overview</a></li>
            <li class="dash-nav-item"><a href="#" onclick="navigateTo('orders'); return false;">📜 Expedition Orders (${userOrders.length})</a></li>
            <li class="dash-nav-item"><a href="#" onclick="navigateTo('settings'); return false;">⚙️ Command Center</a></li>
            <li class="dash-nav-item"><a href="#" onclick="handleLogout(); return false;" style="color: var(--color-error);">🚪 Disconnect / Logout</a></li>
          </ul>
        </aside>

        <!-- DASHBOARD MAIN CONTENT -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
            <div>
              <span class="label-caps">// MEMBER COMMAND CENTER</span>
              <h1 style="font-size: 2.2rem; color: var(--color-primary); margin-top: 4px;">GEAR LOCKER / ${(u.fullName || '').toUpperCase()}</h1>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="navigateTo('home')">&larr; BACK TO CATALOG</button>
          </div>

          <!-- STATS ROW -->
          <div class="dash-stats-row" style="margin-bottom: 36px;">
            <div class="stat-card stat-card-dark">
              <span class="label-caps" style="color: #a0b8a8;">TOTAL SUMMITS</span>
              <div class="stat-value">${totalSummits}</div>
            </div>

            <div class="stat-card">
              <span class="label-caps">MILES LOGGED</span>
              <div class="stat-value">${milesLogged} <span style="font-size: 1rem;">KM</span></div>
            </div>

            <div class="stat-card">
              <span class="label-caps">ACTIVE DEPLOYMENTS</span>
              <div class="stat-value">${activeCount}</div>
            </div>

            <div class="stat-card stat-card-orange">
              <span class="label-caps" style="color: #ffffff;">CLUB CREDITS</span>
              <div class="stat-value">${loyaltyPoints}</div>
            </div>
          </div>

          <!-- ACTIVE EXPEDITIONS -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.3rem; color: var(--color-primary); margin: 0;">🚚 ACTIVE EXPEDITIONS (${activeCount})</h3>
            ${activeCount > 0 ? `<button class="btn btn-secondary btn-sm" onclick="navigateTo('orders')">VIEW MANIFEST HISTORY &rarr;</button>` : ''}
          </div>

          ${activeCount === 0 ? `
            <div style="background: var(--color-surface); border: 1px dashed var(--color-border); padding: 32px; text-align: center; color: var(--color-slate-light); font-family: var(--font-mono); font-size: 0.85rem; margin-bottom: 32px; border-radius: 4px;">
              NO ACTIVE EXPEDITIONS IN TRANSIT.
            </div>
          ` : `
            <div class="grid-2" style="margin-bottom: 32px;">
              ${activeOrders.map(o => {
                const item = o.items?.[0];
                const count = o.items?.length || 1;
                const statusText = (o.statusLabel || o.status || 'IN TRANSIT').toUpperCase().replace('_', ' ');
                const itemTitle = count > 1 ? `${item?.product?.name || 'Equipment Item'} (+${count - 1} more)` : (item?.product?.name || 'Equipment Order');
                return `
                  <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 20px; display: flex; gap: 16px; border-radius: 4px;">
                    <img src="${item?.product?.image || '/assets/images/summit_trek_v2_boots.jpg'}" style="width: 80px; height: 80px; object-fit: cover; border: 1px solid var(--color-border); aspect-ratio: 1/1; border-radius: 2px;">
                    <div style="flex: 1;">
                      <span class="eyebrow-tag" style="background-color: var(--color-accent); font-size: 0.65rem; color: #000000; font-weight: 700;">${statusText}</span>
                      <h5 style="margin: 6px 0 4px; font-size: 1rem; color: var(--color-primary);">${itemTitle}</h5>
                      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-slate-light);">${o.orderNumber}</div>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-primary); font-weight: 700;">${formatCurrency(o.totalAmount)}</span>
                        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-success); font-weight: 700;">DISPATCHED</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}

          <!-- RECENT GEAR LOCKER -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.3rem; color: var(--color-primary); margin: 0;">🎒 THE LOCKER / RECENT GEAR</h3>
            <button class="btn btn-secondary btn-sm" onclick="navigateTo('orders')">VIEW ALL ORDERS &rarr;</button>
          </div>

          ${purchasedProducts.length === 0 ? `
            <div style="background: var(--color-surface); border: 1px dashed var(--color-border); padding: 32px; text-align: center; color: var(--color-slate-light); font-family: var(--font-mono); font-size: 0.85rem; border-radius: 4px;">
              YOUR GEAR LOCKER IS EMPTY. NO PURCHASED EQUIPMENT LOGGED YET.
            </div>
          ` : `
            <div class="grid-3">
              ${purchasedProducts.slice(0, 3).map(p => `
                <div class="product-card">
                  <div class="product-card-img-wrap">
                    <img src="${p.image}" class="product-card-img" style="aspect-ratio: 1/1; object-fit: cover;">
                  </div>
                  <div class="product-card-body">
                    <h5 class="product-card-title">${p.name}</h5>
                    <span class="product-price">${formatCurrency(p.price)}</span>
                  </div>
                  <div class="product-card-footer">
                    <button class="btn btn-dark btn-sm btn-full" onclick="addToCart(${p.id})">BUY AGAIN</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
