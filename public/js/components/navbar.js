import { AppState } from '../state/store.js';

export function updateHeaderUI() {
  const authBtn = document.getElementById('user-auth-btn');
  const wishlistBadge = document.getElementById('wishlist-count-badge');

  if (authBtn) {
    if (AppState.user) {
      authBtn.title = `Logged in as ${AppState.user.fullName}`;
      authBtn.onclick = () => window.navigateTo('settings');
    } else {
      authBtn.title = 'Login to Basecamp';
      authBtn.onclick = () => window.navigateTo('login');
    }
  }

  if (wishlistBadge) {
    const count = AppState.wishlist.length;
    wishlistBadge.textContent = count;
    wishlistBadge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}
