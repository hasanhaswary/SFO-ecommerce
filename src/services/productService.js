import prisma from '../config/prisma.js';

/**
 * Product Service Layer
 * Handles database operations for product catalog filtering, pagination, sorting, detail lookup, and review updates
 */

export const getProducts = async ({ category, search, tag, sort, limit, page }) => {
  const where = {};

  if (category && category !== 'All' && category !== 'All Equipment' && category !== 'Wishlist') {
    where.category = { equals: category };
  }

  if (tag) {
    where.tags = { contains: tag };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } }
    ];
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };
  if (sort === 'name') orderBy = { name: 'asc' };

  const take = limit ? parseInt(limit, 10) : 50;
  const skip = page ? (parseInt(page, 10) - 1) * take : 0;

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

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id, 10) },
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

export const createProductReview = async (productId, userId, { rating, title, comment }) => {
  const review = await prisma.review.create({
    data: {
      productId: parseInt(productId, 10),
      userId: parseInt(userId, 10),
      rating: parseInt(rating, 10),
      title,
      comment
    },
    include: {
      user: { select: { fullName: true, loyaltyTier: true } }
    }
  });

  const allReviews = await prisma.review.findMany({ where: { productId: parseInt(productId, 10) } });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await prisma.product.update({
    where: { id: parseInt(productId, 10) },
    data: {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    }
  });

  return review;
};
