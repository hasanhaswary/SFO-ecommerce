import { AppState } from '../state/store.js';

export function updateHeaderUI() {
  const authBtn = document.getElementById('user-auth-btn');
  const wishlistBadge = document.getElementById('wishlist-count-badge');

  if (authBtn) {
    if (AppState.user) {
      authBtn.title = `Command Center (${AppState.user.fullName})`;
      authBtn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      `;
      authBtn.onclick = () => window.navigateTo('dashboard');
    } else {
      authBtn.title = 'Login to Basecamp';
      authBtn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
      `;
      authBtn.onclick = () => window.navigateTo('login');
    }
  }

  if (wishlistBadge) {
    const count = AppState.wishlist.length;
    wishlistBadge.textContent = count;
    wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  const categories = ['Hiking', 'Running', 'Camping', 'Footwear', 'Apparel'];
  categories.forEach(cat => {
    const el = document.getElementById(`nav-${cat}`);
    if (el) {
      if (AppState.currentView === 'home' && AppState.activeCategory === cat) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });
}

