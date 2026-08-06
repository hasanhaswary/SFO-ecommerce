import { store } from '../state/store.js';

/**
 * User Profile & Security API Client Wrappers
 * Communicates with backend /api/user endpoints to fetch and update user settings
 */

/**
 * Fetches current authenticated user profile details and stats.
 * @returns {Promise<Object>} Profile object (email, fullName, bio, loyalty points, etc.)
 */
export const fetchProfileApi = async () => {
  const res = await fetch('/api/user/profile', {
    headers: { 'Authorization': `Bearer ${store.token}` }
  });
  return await res.json();
};

/**
 * Updates editable user profile manifest details (bio, phone, shipping/billing address)
 * @param {Object} profileData - Updated fields { fullName, bio, phone, shippingAddress }
 * @returns {Promise<Object>} Updated profile object from backend
 */
export const updateProfileApi = async (profileData) => {
  const res = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.token}`
    },
    body: JSON.stringify(profileData)
  });
  return await res.json();
};

/**
 * Updates user passkey/password credentials or 2FA security settings
 * @param {Object} securityData - Payload { currentPassword, newPassword, twoFactorEnabled }
 * @returns {Promise<Object>} Response confirmation object
 */
export const updateSecurityApi = async (securityData) => {
  const res = await fetch('/api/user/security', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.token}`
    },
    body: JSON.stringify(securityData)
  });
  return await res.json();
};
