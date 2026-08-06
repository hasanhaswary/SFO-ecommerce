import { apiRequest } from './apiClient.js';

export async function loginApi(email, password) {
  return await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerApi({ email, password, fullName, enrollClub }) {
  return await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, enrollClub })
  });
}

export async function getMeApi() {
  return await apiRequest('/api/auth/user', { silent: true });
}

export async function forgotPasswordApi(email) {
  return await apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}
