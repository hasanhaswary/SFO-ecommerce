import { store } from '../state/store.js';

/**
 * Order API Client Wrappers
 * Manages checkout dispatch, order history, and reorder operations
 */

/**
 * Submits checkout order payload to the backend for processing
 * Automatically attaches stored JWT token for authentication
 * @param {Object} orderPayload - Order details { items, fullName, email, shippingAddress, etc }
 * @returns {Promise<Object>} Created order object and earned loyalty points
 */
export const createOrderApi = async (orderPayload) => {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.token}`
    },
    body: JSON.stringify(orderPayload)
  });
  return await res.json();
};

/**
 * Retrieves the logged-in user's complete expedition order history
 * @returns {Promise<Object>} Response containing list of historical orders and items
 */
export const fetchOrdersApi = async () => {
  const res = await fetch('/api/orders', {
    headers: { 'Authorization': `Bearer ${store.token}` }
  });
  return await res.json();
};
