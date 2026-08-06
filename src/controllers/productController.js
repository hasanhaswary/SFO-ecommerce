import * as productService from '../services/productService.js';

/**
 * Product Controller Layer
 * Handles HTTP requests for catalog queries, search filters, detail lookup, and review creation
 */

/**
 * @desc    Fetch products with optional category, search keyword, tag, or sorting parameters
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, tag, sort, limit, page } = req.query;

    // Call Service layer to execute Prisma database queries
    const { products, total } = await productService.getProducts({ category, search, tag, sort, limit, page });

    res.json({
      success: true,
      count: products.length,
      total,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed product specs and reviews by URL slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product specifications by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await productService.getProductById(id);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a user review for a product and trigger average rating recalculation
 * @route   POST /api/products/:id/reviews
 * @access  Private (Requires authenticateToken)
 */
export const createReview = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const { rating, title, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Rating score and review field notes are required.'
      });
    }

    const review = await productService.createProductReview(productId, req.user.id, { rating, title, comment });

    res.status(201).json({
      success: true,
      message: 'Field review logged successfully to equipment manifest.',
      review
    });
  } catch (error) {
    next(error);
  }
};
