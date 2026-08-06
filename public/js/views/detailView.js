import { AppState } from '../state/store.js';
import { fetchProductBySlugApi, postReviewApi } from '../api/productApi.js';
import { showToast } from '../utils/toast.js';

export async function renderDetailView(container) {
  if (!AppState.selectedProductSlug) {
    window.navigateTo('home');
    return;
  }

  try {
    const res = await fetchProductBySlugApi(AppState.selectedProductSlug);
    if (!res || !res.success) {
      showToast('Failed to load product page details.', 'error');
      window.navigateTo('home');
      return;
    }

    const p = res.product;
    AppState.currentProduct = p;
    const specsObj = p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : {};
    const isWishlisted = AppState.wishlist.includes(p.id);

    container.innerHTML = `
      <div class="site-container" style="padding-top: 30px;">
        <!-- HEADER TOP NAVIGATION BAR -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('home')">&larr; BACK TO CATALOG</button>
          
          <!-- BREADCRUMB -->
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-slate-light);">
            <a href="#" onclick="navigateTo('home'); return false;">HOME</a> &gt; 
            <a href="#" onclick="selectCategory('${p.category}'); navigateTo('home'); return false;">${p.category.toUpperCase()}</a> &gt; 
            <span style="color: var(--color-primary); font-weight: 700;">${p.name.toUpperCase()}</span>
          </div>
        </div>

        <div class="product-detail-layout">
          <!-- GALLERY -->
          <div class="product-gallery">
            <div class="gallery-thumbs">
              <div class="thumb-item active"><img src="${p.image}" alt="${p.name}"></div>
              ${p.additionalImages ? p.additionalImages.split(',').map(img => `
                <div class="thumb-item"><img src="${img.trim()}" alt="${p.name}"></div>
              `).join('') : ''}
            </div>

            <div class="gallery-main-img">
              <img id="main-product-img" src="${p.image}" alt="${p.name}">
            </div>
          </div>

          <!-- INFO PANEL -->
          <div class="product-info-panel">
            <span class="eyebrow-tag">TECHNICAL ${p.category.toUpperCase()}</span>
            <h1>${p.name}</h1>

            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div class="stars">★★★★★</div>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-slate-light);">
                ${p.rating} (${p.reviewCount} Reviews)
              </span>
            </div>

            <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px;">
              <span style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; color: var(--color-primary);">R ${Number(p.price).toFixed(2)}</span>
              ${p.originalPrice ? `<span style="text-decoration: line-through; color: var(--color-slate-light); font-size: 1.2rem;">R ${Number(p.originalPrice).toFixed(2)}</span>` : ''}
            </div>

            <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">
              ${p.description}
            </p>

            <div class="specs-summary-box">
              <div class="spec-item-inline">
                <label>WEIGHT</label>
                <span>${p.weight || 'Standard'}</span>
              </div>
              <div class="spec-item-inline">
                <label>WEATHERPROOF</label>
                <span>${p.weatherproof || 'Alpine Shield'}</span>
              </div>
              <div class="spec-item-inline">
                <label>AVAILABILITY</label>
                <span style="color: var(--color-success);">IN STOCK (${p.stock})</span>
              </div>
            </div>

            <!-- ADD TO CART ROW -->
            <div style="display: flex; gap: 16px; margin: 28px 0;">
              <div class="qty-picker">
                <button class="qty-btn" onclick="adjustDetailQty(-1)">-</button>
                <input type="text" id="detail-qty-input" class="qty-input" value="1" readonly>
                <button class="qty-btn" onclick="adjustDetailQty(1)">+</button>
              </div>

              <button class="btn btn-primary" style="flex: 1;" onclick="addDetailToCart()">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                ADD TO CART
              </button>

              <button class="icon-badge-btn" style="width: 48px; height: 48px;" onclick="toggleWishlist(${p.id})">
                <svg width="20" height="20" fill="${isWishlisted ? 'var(--color-accent)' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-slate-light); border-top: 1px solid var(--color-border); padding-top: 16px;">
              <div>🚚 FREE DISPATCH OVER R 1 500</div>
              <div>🛡️ LIFETIME WARRANTY</div>
              <div>⚡ 48H BASECAMP DELIVERY</div>
            </div>
          </div>
        </div>

        <!-- SPECIFICATIONS & FIELD NOTES -->
        <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div>
            <span class="label-caps">// TECHNICAL METRICS</span>
            <h3 style="font-size: 1.5rem; margin-bottom: 20px;">FULL SPECIFICATIONS</h3>
            <table class="specs-table">
              <tbody>
                ${Object.entries(specsObj).map(([k, v]) => `
                  <tr>
                    <td class="spec-label">${k}</td>
                    <td class="spec-value">${v}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td class="spec-label">MATERIALS</td>
                  <td class="spec-value">${p.materials || 'Carbon-Reinforced Ripstop Polymer'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <span class="label-caps">// ALPINE TESTING</span>
            <h3 style="font-size: 1.5rem; margin-bottom: 20px;">FIELD TEST REPORT</h3>
            <div style="background: var(--color-surface); border: 2px solid var(--color-primary); padding: 24px; border-radius: 4px;">
              <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6; font-style: italic;">
                "${p.fieldNotes || 'Tested on Matterhorn ridge traverses during sub-zero squalls. Flawless structural integrity and zero moisture penetration recorded during 72h continuous exposure.'}"
              </p>
              <div style="margin-top: 20px; display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 0.8rem;">
                <div style="width: 36px; height: 36px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000;">SF</div>
                <div>
                  <strong>SUMMIT FORGE LABS</strong><br>
                  <span style="color: var(--color-slate-light);">FIELD TESTING DIVISION &bull; MONT BLANC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    showToast('Failed to load product page details.', 'error');
    window.navigateTo('home');
  }
}
