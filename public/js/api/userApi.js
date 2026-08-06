import { apiRequest } from './apiClient.js';

export async function fetchProfileApi() {
  return await apiRequest('/api/user/profile');
}

export async function updateProfileApi(profileData) {
  return await apiRequest('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}

export async function updateSecurityApi(securityData) {
  return await apiRequest('/api/user/security', {
    method: 'PUT',
    body: JSON.stringify(securityData)
  });
}
