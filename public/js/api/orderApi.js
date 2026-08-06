import { apiRequest } from './apiClient.js';

export async function createOrderApi(orderData) {
  return await apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

export async function fetchOrdersApi() {
  return await apiRequest('/api/orders');
}

export async function fetchOrderByIdApi(orderId) {
  return await apiRequest(`/api/orders/${orderId}`);
}
