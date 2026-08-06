import { AppState } from '../state/store.js';

export function renderSettingsView(container) {
  if (!AppState.user) {
    window.navigateTo('login');
    return;
  }
  container.innerHTML = `
    <div class="site-container" style="padding: 40px 0; max-width: 600px;">
      <h2 style="font-family: var(--font-display); margin-bottom: 24px;">COMMAND CENTER PROFILE</h2>
      <div style="background: #0c120e; border: 1px solid var(--color-border); padding: 24px;">
        <p><strong>Name:</strong> ${AppState.user.fullName}</p>
        <p><strong>Email:</strong> ${AppState.user.email}</p>
        <p><strong>Loyalty Tier:</strong> ${AppState.user.loyaltyTier || 'Lead Explorer'}</p>
        <p><strong>Loyalty Points:</strong> ${AppState.user.loyaltyPoints || 500}</p>
        <button class="btn btn-secondary" style="margin-top: 16px;" onclick="handleLogout()">LOGOUT</button>
      </div>
    </div>
  `;
}
