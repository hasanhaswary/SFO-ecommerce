import { AppState } from '../state/store.js';

export function renderLoginView(container) {
  container.innerHTML = `
    <div class="site-container" style="padding-top: 20px;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('home')">&larr; BACK TO CATALOG</button>
      </div>

      <div class="auth-container">
        <div class="auth-banner-side">
          <div>
            <span class="eyebrow-tag">EQUIPMENT & APPAREL</span>
            <h2>GEAR FOR THE UNRELENTING.</h2>
          </div>
          <p style="font-size: 0.85rem; color: #a0b8a8;">
            Sign into your Basecamp account to track missions, manage your gear locker, and redeem Expedition Club credits.
          </p>
        </div>

        <div class="auth-form-side">
          <h2>SUMMIT FORGE</h2>
          <p class="label-caps" style="margin-bottom: 24px;">LOGIN TO BASECAMP</p>

          <form onsubmit="handleLoginSubmit(event)">
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="login-email" class="form-control" placeholder="explorer@summitforge.com" value="alex.honnold@summitforge.com" required>
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between;">
                <label class="form-label">PASSWORD</label>
                <a href="#" onclick="navigateTo('forgot'); return false;" style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-accent);">FORGOT PASSWORD?</a>
              </div>
              <input type="password" id="login-password" class="form-control" value="Password123!" required>
            </div>

            <button type="submit" class="btn btn-primary btn-full" style="margin-top: 16px;">
              LOGIN TO BASECAMP &rarr;
            </button>
          </form>

          <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--color-border);">
            <span class="label-caps">NEW TO THE TRAIL?</span><br><br>
            <button class="btn btn-secondary btn-full" onclick="navigateTo('register')">CREATE ACCOUNT</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderRegisterView(container) {
  container.innerHTML = `
    <div class="site-container" style="padding-top: 20px;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('home')">&larr; BACK TO CATALOG</button>
      </div>

      <div class="auth-container">
        <div class="auth-banner-side">
          <div>
            <span class="eyebrow-tag">EXPEDITION CLUB</span>
            <h2>FORGE YOUR PATH.</h2>
            <ul class="perks-list" style="margin-top: 16px; list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px;">
              <li>✓ Priority Restock Alerts</li>
              <li>✓ Technical Field Guides</li>
              <li>✓ Lifetime Gear Registry</li>
            </ul>
          </div>
        </div>

        <div class="auth-form-side">
          <h2>CREATE ACCOUNT</h2>
          <p class="label-caps" style="margin-bottom: 24px;">EXPEDITION CLUB PROTOCOL</p>

          <form onsubmit="handleRegisterSubmit(event)">
            <div class="form-group">
              <label class="form-label">FULL NAME</label>
              <input type="text" id="reg-name" class="form-control" placeholder="Johnathan Doe" required>
            </div>

            <div class="form-group">
              <label class="form-label">COMMUNICATIONS UPLINK (EMAIL)</label>
              <input type="email" id="reg-email" class="form-control" placeholder="explorer@summitforge.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">SECURE PASSKEY</label>
              <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required>
            </div>

            <div style="margin: 16px 0; background: var(--color-surface-dim); border: 1px solid var(--color-border); padding: 12px; font-size: 0.8rem; border-radius: 4px;">
              <label style="display: flex; gap: 8px; align-items: flex-start; cursor: pointer;">
                <input type="checkbox" id="reg-club" checked style="margin-top: 3px;">
                <span><strong>ENROLL IN EXPEDITION CLUB</strong><br><span style="color: var(--color-slate-light);">Gain 500 initial climb points, early access to technical releases.</span></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-full">
              INITIALIZE PROTOCOL &rarr;
            </button>
          </form>

          <div style="text-align: center; margin-top: 20px;">
            <a href="#" onclick="navigateTo('login'); return false;" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-accent); font-weight: 700;">ALREADY PART OF THE FLEET? LOGIN HERE</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderForgotPasswordView(container) {
  container.innerHTML = `
    <div class="site-container" style="padding: 40px 0;">
      <div style="display: flex; justify-content: flex-end; max-width: 500px; margin: 0 auto 16px;">
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('home')">&larr; BACK TO CATALOG</button>
      </div>

      <div style="max-width: 500px; margin: 0 auto; background: var(--color-surface); border: 2px solid var(--color-primary); padding: 40px; box-shadow: var(--shadow-hard); border-radius: 4px;">
        <span class="label-caps" style="color: var(--color-accent);">SECURITY PROTOCOL</span>
        <h2 style="font-size: 2rem; margin: 8px 0 16px;">LOST YOUR BEARINGS?</h2>
        <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 24px;">
          Enter your verified expedition email below. We'll dispatch a secure recovery link to your inbox immediately.
        </p>

        <form onsubmit="handleForgotSubmit(event)">
          <div class="form-group">
            <label class="form-label">EMAIL ADDRESS</label>
            <input type="email" id="forgot-email" class="form-control" placeholder="name@summitforge.com" required>
          </div>

          <button type="submit" class="btn btn-primary btn-full">REQUEST RESET &rarr;</button>
        </form>

        <div style="text-align: center; margin-top: 24px;">
          <a href="#" onclick="navigateTo('login'); return false;" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); font-weight: 700;">&larr; BACK TO SECURE LOGIN</a>
        </div>
      </div>
    </div>
  `;
}
