import { AppState } from '../state/store.js';
import { fetchProductsApi } from '../api/productApi.js';
import { renderProductCard } from '../components/productCard.js';

export async function renderHomeView(container) {
  let productsUrl = '/api/products';
  const queryParams = [];
  if (AppState.activeCategory && AppState.activeCategory !== 'All') {
    queryParams.push(`category=${encodeURIComponent(AppState.activeCategory)}`);
  }
  if (AppState.searchQuery) {
    queryParams.push(`search=${encodeURIComponent(AppState.searchQuery)}`);
  }
  if (queryParams.length > 0) {
    productsUrl += '?' + queryParams.join('&');
  }

  try {
    const res = await fetchProductsApi({
      category: (AppState.activeCategory && AppState.activeCategory !== 'All' && AppState.activeCategory !== 'Wishlist') ? AppState.activeCategory : null,
      search: AppState.searchQuery
    });
    if (res && res.success) {
      AppState.products = res.products || [];
    }
  } catch (err) {
    console.error('Failed to load products:', err);
  }

  const categories = ['All', 'Hiking', 'Running', 'Camping', 'Footwear', 'Apparel', 'Equipment'];
  const showHero = AppState.isMainPage && !AppState.searchQuery && AppState.activeCategory !== 'Wishlist';

  let displayedProducts = AppState.products;
  if (AppState.activeCategory === 'Wishlist') {
    displayedProducts = AppState.products.filter(p => AppState.wishlist.includes(p.id));
  }
  if (showHero && AppState.products.length > 0) {
    const categoryMap = {};
    AppState.products.forEach(p => {
      const cat = p.category || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(p);
    });

    const featured = [];
    const selectedIds = new Set();

    Object.keys(categoryMap).forEach(cat => {
      if (categoryMap[cat].length > 0 && featured.length < 8) {
        const item = categoryMap[cat][0];
        featured.push(item);
        selectedIds.add(item.id);
      }
    });

    Object.keys(categoryMap).forEach(cat => {
      if (categoryMap[cat].length > 1 && featured.length < 8) {
        const item = categoryMap[cat][1];
        if (!selectedIds.has(item.id)) {
          featured.push(item);
          selectedIds.add(item.id);
        }
      }
    });

    if (featured.length < 8) {
      AppState.products.forEach(p => {
        if (!selectedIds.has(p.id) && featured.length < 8) {
          featured.push(p);
          selectedIds.add(p.id);
        }
      });
    }

    displayedProducts = featured;
  }

  container.innerHTML = `
    ${showHero ? `
    <!-- HERO BANNER -->
    <section class="hero-banner">
      <div class="site-container">
        <div class="hero-content">
          <span class="eyebrow-tag">EST. 1984 | ALPS TESTED</span>
          <h1 class="hero-title">ENGINEERED FOR THE WILD.</h1>
          <p class="hero-desc">
            Professional-grade gear for hikers, trail runners, and explorers. Precision-built to survive the most demanding terrain on the planet.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="filterByNav('Footwear')">SHOP NEW ARRIVALS &rarr;</button>
            <button class="btn btn-secondary" style="color: #ffffff; border-color: #ffffff;" onclick="filterByNav('Equipment')">VIEW LOOKBOOK</button>
          </div>
        </div>
      </div>
      <div class="coordinates-badge">
        <div>LATITUDE: <span>45.8327° N</span></div>
        <div>LONGITUDE: <span>6.8651° E</span></div>
        <div>ELEVATION: <span>4,810M</span></div>
      </div>
    </section>

    <!-- VALUE HIGHLIGHTS BAR -->
    <section class="highlights-bar">
      <div class="site-container">
        <div class="highlights-grid">
          <div class="highlight-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div class="highlight-text">
              <h5>LIFETIME WARRANTY</h5>
              <p>Built to last a lifetime</p>
            </div>
          </div>
          <div class="highlight-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <div class="highlight-text">
              <h5>EXPRESS SHIPPING</h5>
              <p>Basecamp delivery in 48h</p>
            </div>
          </div>
          <div class="highlight-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <div class="highlight-text">
              <h5>100% RECYCLED</h5>
              <p>Sustainably engineered</p>
            </div>
          </div>
          <div class="highlight-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <div class="highlight-text">
              <h5>PRO SUPPORT</h5>
              <p>Expert trail consultants</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- STORE PRODUCTS SECTION -->
    <section class="site-container" style="${!showHero ? 'padding-top: 40px;' : ''}">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <span class="label-caps">// CORE COLLECTION</span>
          <h2 class="section-title" style="margin-bottom: 0;">
            ${AppState.searchQuery ? `SEARCH RESULTS FOR "${AppState.searchQuery.toUpperCase()}"` : (showHero ? 'FEATURED GEAR' : 'OUR COLLECTION')}
          </h2>
        </div>

        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div class="category-filter-pills" style="margin-bottom: 0;">
            ${categories.map(cat => `
              <button class="filter-pill ${AppState.activeCategory === cat ? 'active' : ''}" onclick="selectCategory('${cat}')">
                ${cat}
              </button>
            `).join('')}
          </div>

          ${showHero ? `
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="btn btn-secondary btn-sm" onclick="scrollProductCarousel(-1)" style="padding: 6px 14px; font-size: 1.1rem; line-height: 1;" title="Previous">&larr;</button>
              <button class="btn btn-secondary btn-sm" onclick="scrollProductCarousel(1)" style="padding: 6px 14px; font-size: 1.1rem; line-height: 1;" title="Next">&rarr;</button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- PRODUCT CARDS SECTION -->
      ${showHero ? `
        <div class="products-carousel-wrap">
          <div class="products-carousel" id="products-carousel">
            ${displayedProducts.length === 0 ? `
              <div style="width: 100%; padding: 60px 0; text-align: center; font-family: var(--font-mono); color: var(--color-slate-light);">
                NO GEAR MANIFEST ITEMS MATCH YOUR FILTER CRITERIA.
              </div>
            ` : displayedProducts.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      ` : `
        <div class="grid-4" id="products-grid">
          ${displayedProducts.length === 0 ? `
            <div style="grid-column: 1 / -1; padding: 60px 0; text-align: center; font-family: var(--font-mono); color: var(--color-slate-light);">
              NO GEAR MANIFEST ITEMS MATCH YOUR FILTER CRITERIA.
            </div>
          ` : displayedProducts.map(p => renderProductCard(p)).join('')}
        </div>
      `}

      <!-- BRAND FEATURE CALLOUT BANNER -->
      <div style="margin-top: 60px; display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <div style="position: relative; background: linear-gradient(rgba(5,26,15,0.7), rgba(5,26,15,0.9)), url('https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80') center/cover; padding: 48px; color: #ffffff; border: 2px solid var(--color-primary);">
          <h3 style="font-size: 2rem; margin-bottom: 12px;">FORGE-TEX™ MEMBRANE</h3>
          <p style="color: #c2d4c8; max-width: 500px; margin-bottom: 24px;">
            Our proprietary breathable waterproof tech, tested in the harshest Alpine conditions across Mont Blanc and North Cascades.
          </p>
          <button class="btn btn-secondary" style="color: #ffffff; border-color: #ffffff;" onclick="filterByNav('Apparel')">EXPLORE THE TECH &rarr;</button>
        </div>

        <div style="background-color: var(--color-accent); padding: 36px; color: #ffffff; border: 2px solid var(--color-accent); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            <h3 style="font-size: 1.5rem; margin: 12px 0 8px;">ERGONOMIC PRECISION</h3>
            <p style="font-size: 0.875rem; opacity: 0.9;">
              Every seam, every buckle, and every stitch is calculated for maximum mobility and weight distribution.
            </p>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 12px; margin-top: 20px;">
            TENSILE STRENGTH: 4500N<br>
            THERMAL RATING: -25°C
          </div>
        </div>
      </div>
    </section>
  `;
}
