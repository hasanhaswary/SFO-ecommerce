import express from 'express';
import { getProducts, getProductBySlug, getProductById, createReview } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Product & Equipment Manifest Router
 * Handles product catalog queries, detail lookup, and review postings
 */

/**
 * @route   GET /api/products
 * @desc    Fetch product catalog with optional search, category, tag, or sorting filters
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Fetch detailed product specs and reviews by URL slug
 * @access  Public
 */
router.get('/slug/:slug', getProductBySlug);

/**
 * @route   GET /api/products/:id
 * @desc    Fetch single product by numerical ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Submit a user field review for a product
 * @access  Private (Requires valid JWT token)
 */
router.post('/:id/reviews', authenticateToken, createReview);

export default router;
