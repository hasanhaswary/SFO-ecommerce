import { AppState } from '../state/store.js';

/**
 * Universal REST API Request Wrapper
 * Automatically attaches Authorization Bearer token headers and handles errors.
 */
export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (AppState.token) {
    headers['Authorization'] = `Bearer ${AppState.token}`;
  }

  try {
    const response = await fetch(endpoint, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        AppState.logout();
      }
      throw new Error(data.error || 'Server error occurred.');
    }

    return data;
  } catch (err) {
    if (!options.silent) {
      console.error(`API Error [${endpoint}]:`, err.message || err);
    }
    throw err;
  }
}
