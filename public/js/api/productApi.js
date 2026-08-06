/**
 * Product API Client Wrappers
 * Handles querying equipment catalog, searching, filtering, and submitting reviews
 */

/**
 * Fetches the equipment catalog from the backend with optional search filters
 * @param {Object} options - Search options { category, search, tag, sort }
 * @returns {Promise<Object>} Response containing list of products and count metadata
 */
export const fetchProductsApi = async ({ category, search, tag, sort } = {}) => {
  // Construct URL query string parameters dynamically
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);
  if (tag) params.append('tag', tag);
  if (sort) params.append('sort', sort);

  const res = await fetch(`/api/products?${params.toString()}`);
  return await res.json();
};

/**
 * Fetches detailed specifications and reviews for a single product using its URL slug
 * @param {string} slug - Unique product URL identifier
 * @returns {Promise<Object>} Response containing detailed product object and reviews array
 */
export const fetchProductBySlugApi = async (slug) => {
  const res = await fetch(`/api/products/slug/${slug}`);
  return await res.json();
};

/**
 * Submits a new user review and rating score for a specific product
 * Requires a valid user authentication token.
 * @param {number} productId - Unique product ID
 * @param {Object} reviewData - Review payload { rating, title, comment }
 * @param {string} token - User's JWT authentication token
 * @returns {Promise<Object>} Created review object and updated product rating
 */
export const postReviewApi = async (productId, reviewData, token) => {
  const res = await fetch(`/api/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  });
  return await res.json();
};
