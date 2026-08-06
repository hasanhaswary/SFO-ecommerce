import { store } from '../state/store.js';

/**
 * Authentication API Client Wrappers
 * These helper functions isolate network fetch calls from UI code
 */

/**
 * Sends a POST request to login a user with email and password credentials
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} JSON response containing token and user profile if successful
 */
export const loginApi = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
};

/**
 * Sends a POST request to register a new user account.
 * @param {Object} userData - Registration fields { email, password, fullName, enrollClub }
 * @returns {Promise<Object>} JSON response with issued JWT token and new user profile
 */
export const registerApi = async (userData) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await res.json();
};

/**
 * Fetches the currently authenticated user's profile using the stored JWT token.
 * If no token exists in local state, returns null immediately without making a network call.
 * @returns {Promise<Object|null>} User details object or null
 */
export const getMeApi = async () => {
  if (!store.token) return null;
  const res = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${store.token}`,
      'x-auth-token': store.token
    }
  });
  return await res.json();
};
