import { AppState } from '../state/store.js';
import { fetchProductsApi } from '../api/productApi.js';
import { renderProductCard } from '../components/productCard.js';

export async function renderFavoritesView(container) {
  if (!AppState.user) {
    container.innerHTML = `
      <section class="site-container" style="padding-top: 40px; padding-bottom: 60px; min-height: 60vh;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; border-bottom: 2px solid var(--color-border); padding-bottom: 16px;">
          <div>
            <span class="label-caps">// SAVED GEAR</span>
            <h1 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; color: var(--color-primary); margin-top: 4px;">
              YOUR FAVORITES
            </h1>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="goToMainPage()">&larr; BACK TO CATALOG</button>
        </div>

        <div style="text-align: center; padding: 80px 20px; background-color: var(--color-surface); border: 2px dashed var(--color-border); border-radius: 4px;">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--color-primary); margin-bottom: 8px;">
            AUTHENTICATION REQUIRED
          </h3>
          <p style="color: var(--color-text-muted); max-width: 460px; margin: 0 auto 24px; font-size: 0.95rem;">
            Please log in to your Summit Forge account to view or manage your saved favorite gear across sessions.
          </p>
          <button class="btn btn-primary" onclick="navigateTo('login')">LOG IN / REGISTER &rarr;</button>
        </div>
      </section>
    `;
    return;
  }

  if (!AppState.products || AppState.products.length === 0) {
    try {
      const data = await fetchProductsApi();
      AppState.products = data.products || [];
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }

  const favoritedProducts = AppState.products.filter(p => AppState.wishlist.includes(p.id));

  container.innerHTML = `
    <section class="site-container" style="padding-top: 40px; padding-bottom: 60px; min-height: 60vh;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; border-bottom: 2px solid var(--color-border); padding-bottom: 16px;">
        <div>
          <span class="label-caps">// SAVED GEAR</span>
          <h1 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; color: var(--color-primary); margin-top: 4px;">
            YOUR FAVORITES (${AppState.wishlist.length})
          </h1>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="goToMainPage()">&larr; BACK TO CATALOG</button>
      </div>

      ${favoritedProducts.length === 0 ? `
        <div style="text-align: center; padding: 80px 20px; background-color: var(--color-surface); border: 2px dashed var(--color-border); border-radius: 4px;">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--color-primary); margin-bottom: 8px;">
            YOUR FAVORITES MANIFEST IS EMPTY
          </h3>
          <p style="color: var(--color-text-muted); max-width: 460px; margin: 0 auto 24px; font-size: 0.95rem;">
            Click the heart icon on any gear item while exploring our collections to save it to your personal expedition manifest.
          </p>
          <button class="btn btn-primary" onclick="goToMainPage()">EXPLORE GEAR CATALOG &rarr;</button>
        </div>
      ` : `
        <div class="grid-4" id="products-grid">
          ${favoritedProducts.map(p => renderProductCard(p)).join('')}
        </div>
      `}
    </section>
  `;
}
