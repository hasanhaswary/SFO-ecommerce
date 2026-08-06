import { formatCurrency } from '../utils/formatters.js';
import { store } from '../state/store.js';

export const renderProductCard = (product) => {
  const isWishlisted = store.wishlist.includes(product.id);
  const tagsList = product.tags ? product.tags.split(',') : [];

  return `
    <div class="product-card" onclick="viewProductDetail('${product.slug}')">
      <div class="product-card-badge-container">
        ${tagsList.map(tag => `<span class="badge-tag">${tag}</span>`).join('')}
      </div>

      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
          <svg width="16" height="16" fill="${isWishlisted ? 'var(--color-accent)' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
      </div>

      <div class="product-info">
        <div class="product-category">${product.category.toUpperCase()}</div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description ? product.description.substring(0, 80) + '...' : ''}</p>

        <div class="product-price-row">
          <div class="product-price">
            ${formatCurrency(product.price)}
            ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
          </div>
          <div class="product-rating">
            ★ ${product.rating} <span style="opacity: 0.6;">(${product.reviewCount})</span>
          </div>
        </div>

        <button class="btn btn-primary btn-block btn-sm" style="margin-top: 12px;" onclick="event.stopPropagation(); quickAddToCart(${product.id})">
          ADD TO MANIFEST
        </button>
      </div>
    </div>
  `;
};
