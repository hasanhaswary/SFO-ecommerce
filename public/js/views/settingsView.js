import { AppState } from '../state/store.js';

export function renderSettingsView(container) {
  if (!AppState.user) {
    window.navigateTo('login');
    return;
  }

  const u = AppState.user;

  container.innerHTML = `
    <div class="site-container" style="padding-top: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <h1 style="font-size: 2.2rem; color: var(--color-primary); margin: 0;">COMMAND CENTER / SETTINGS</h1>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('dashboard')">&larr; BACK TO DASHBOARD</button>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('home')">CATALOG &rarr;</button>
        </div>
      </div>

      <div style="max-width: 800px; background: var(--color-surface); border: 1px solid var(--color-border); padding: 40px; border-radius: 4px;">
        <!-- 01 PROFILE MANIFEST -->
        <h3 style="font-size: 1.2rem; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; margin-bottom: 20px;">01 PROFILE MANIFEST</h3>
        
        <form onsubmit="handleSettingsUpdate(event)">
          <div class="form-group">
            <label class="form-label">FULL NAME</label>
            <input type="text" id="set-name" class="form-control" value="${u.fullName || ''}" required>
          </div>

          <div class="form-group">
            <label class="form-label">COMMUNICATIONS UPLINK (EMAIL)</label>
            <input type="email" class="form-control" value="${u.email || ''}" disabled style="background: var(--color-surface-dim);">
          </div>

          <div class="form-group">
            <label class="form-label">PERSONNEL BIO & SPECIALIZATION</label>
            <textarea id="set-bio" class="form-control" rows="3">${u.bio || ''}</textarea>
          </div>

          <!-- 02 SECURITY PROTOCOL -->
          <h3 style="font-size: 1.2rem; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; margin: 32px 0 20px;">02 SECURITY PROTOCOL</h3>

          <div style="background: var(--color-surface-dim); border: 1px solid var(--color-border); padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
            <div>
              <strong>TWO-FACTOR AUTHENTICATION (2FA)</strong>
              <p style="font-size: 0.8rem; color: var(--color-slate-light); margin-top: 4px;">Add an extra layer of defense to your Gear Locker credentials.</p>
            </div>
            <label style="cursor: pointer;">
              <input type="checkbox" id="set-2fa" ${u.twoFactorEnabled ? 'checked' : ''} style="width: 20px; height: 20px;">
            </label>
          </div>

          <!-- 03 LOGISTICS -->
          <h3 style="font-size: 1.2rem; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; margin: 32px 0 20px;">03 LOGISTICS</h3>

          <div class="form-group">
            <label class="form-label">PRIMARY DEPLOYMENT ADDRESS (SHIPPING)</label>
            <input type="text" id="set-shipping" class="form-control" value="${u.shippingAddress || ''}">
          </div>

          <!-- 04 ACCOUNT SESSION -->
          <h3 style="font-size: 1.2rem; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; margin: 32px 0 20px;">04 ACCOUNT SESSION</h3>

          <div style="background: var(--color-surface-dim); border: 1px solid var(--color-border); padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
            <div>
              <strong>BASECAMP SESSION DISCONNECT</strong>
              <p style="font-size: 0.8rem; color: var(--color-slate-light); margin-top: 4px;">Log out of your active session on this device.</p>
            </div>
            <button type="button" class="btn btn-secondary" onclick="handleLogout()" style="border-color: var(--color-accent); color: var(--color-accent);">LOGOUT FROM BASECAMP</button>
          </div>

          <div style="display: flex; gap: 16px; margin-top: 32px;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">SAVE MANIFEST EDITS</button>
            <button type="button" class="btn btn-secondary" onclick="navigateTo('dashboard')">CANCEL</button>
          </div>
        </form>

        <!-- RETIRE ACCOUNT -->
        <div style="margin-top: 48px; border-top: 2px solid var(--color-error); padding-top: 24px;">
          <h4 style="color: var(--color-error);">RETIRE FROM SERVICE</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 8px 0 16px;">
            Permanently purge your account, expedition history, and member rewards from the Summit Forge database.
          </p>
          <button class="btn btn-dark" style="background-color: var(--color-error); border-color: var(--color-error);" onclick="retireAccount()">DELETE ACCOUNT</button>
        </div>
      </div>
    </div>
  `;
}
