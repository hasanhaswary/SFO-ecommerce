import { AppState } from '../state/store.js';

export function renderProductCard(p) {
  const isWishlisted = AppState.wishlist.includes(p.id);
  const tagsList = p.tags ? p.tags.split(',') : ['TECHNICAL'];

  return `
    <div class="product-card">
      <div class="product-card-img-wrap">
        <div class="product-tag-badges">
          ${tagsList.slice(0, 2).map(t => `<span class="tag-badge">${t.trim()}</span>`).join('')}
        </div>
        <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${p.id})">
          <svg width="16" height="16" fill="${isWishlisted ? '#ffffff' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
        <img class="product-card-img" src="${p.image}" alt="${p.name}" onclick="navigateTo('product', '${p.slug}')" style="cursor: pointer;">
      </div>

      <div class="product-card-body" onclick="navigateTo('product', '${p.slug}')" style="cursor: pointer;">
        <h4 class="product-card-title">${p.name}</h4>
        <div class="product-card-rating">
          <span class="stars">★ ${(Number(p.rating) || 4.8).toFixed(1)}</span>
          <span>(${p.reviewCount || 42})</span>
        </div>
        <div class="product-card-price-row">
          <span class="product-price">R ${(Number(p.price) || 0).toFixed(2)}</span>
          ${p.originalPrice ? `<span class="product-price-original">R ${(Number(p.originalPrice) || 0).toFixed(2)}</span>` : ''}
        </div>
      </div>

      <div class="product-card-footer">
        <button class="btn btn-secondary btn-sm btn-full" onclick="addToCart(${p.id})">
          + QUICK ADD
        </button>
      </div>
    </div>
  `;
}
