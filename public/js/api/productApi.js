import { apiRequest } from './apiClient.js';

export async function fetchProductsApi({ category, search, tag, sort } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);
  if (tag) params.append('tag', tag);
  if (sort) params.append('sort', sort);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return await apiRequest(`/api/products${queryString}`);
}

export async function fetchProductBySlugApi(slug) {
  return await apiRequest(`/api/products/slug/${slug}`);
}

export async function postReviewApi(productId, reviewData) {
  return await apiRequest(`/api/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}
