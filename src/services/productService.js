import prisma from '../config/prisma.js';

/**
 * Product Service Layer
 * Handles database operations for product catalog filtering, pagination, sorting, detail lookup, and review updates
 */

/**
 * Queries products from database with dynamic filters (category, search string, tag, and sort order)
 * @param {Object} filters - { category, search, tag, sort, limit, page }
 * @returns {Promise<{ products: Array, total: number }>} List of matching products and total count
 */
export const getProducts = async ({ category, search, tag, sort, limit, page }) => {
  const where = {};

  // Category filter
  if (category && category !== 'All' && category !== 'All Equipment') {
    where.category = { equals: category };
  }

  // Tag filter
  if (tag) {
    where.tags = { contains: tag };
  }

  // Search keyword search across name, description, tags, and category
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
      { category: { contains: search } }
    ];
  }

  // Sorting logic
  let orderBy = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };
  if (sort === 'name') orderBy = { name: 'asc' };

  const take = limit ? parseInt(limit, 10) : 50;
  const skip = page ? (parseInt(page, 10) - 1) * take : 0;

  // Run product query and count query in parallel
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
    }),
    prisma.product.count({ where })
  ]);

  return { products, total };
};

/**
 * Retrieves single product by URL slug, including user reviews
 * @param {string} slug - Unique product slug
 * @returns {Promise<Object>} Product details object
 */
export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: {
          user: { select: { fullName: true, loyaltyTier: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    const error = new Error('Product equipment not found in manifest database.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

/**
 * Retrieves single product by numerical ID
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Product details object
 */
export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: { select: { fullName: true, loyaltyTier: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    const error = new Error('Gear item not found.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

/**
 * Creates a new user review and updates the product's calculated average rating
 * @param {number} productId - Product ID
 * @param {number} userId - ID of reviewing user
 * @param {Object} reviewData - { rating, title, comment }
 * @returns {Promise<Object>} Created review object
 */
export const createProductReview = async (productId, userId, { rating, title, comment }) => {
  const review = await prisma.review.create({
    data: {
      productId,
      userId,
      rating: parseInt(rating, 10),
      title,
      comment
    },
    include: {
      user: { select: { fullName: true, loyaltyTier: true } }
    }
  });

  // Recalculate product average rating across all reviews
  const allReviews = await prisma.review.findMany({ where: { productId } });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  // Update product row with new average rating score and review count
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    }
  });

  return review;
};
