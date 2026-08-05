import express from 'express';
import { createOrder, getOrders, getOrderById, reorder, refund } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Order & Checkout Router
 * All order endpoints require authentication
 */

/**
 * @route   POST /api/orders
 * @desc    Submit checkout order and dispatch mission
 * @access  Private
 */
router.post('/', authenticateToken, createOrder);

/**
 * @route   GET /api/orders
 * @desc    Retrieve list of orders placed by authenticated user
 * @access  Private
 */
router.get('/', authenticateToken, getOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order details by ID or order number (#SF-XXXXX)
 * @access  Private
 */
router.get('/:id', authenticateToken, getOrderById);

/**
 * @route   POST /api/orders/:id/reorder
 * @desc    Prepare items from a past order for quick reorder
 * @access  Private
 */
router.post('/:id/reorder', authenticateToken, reorder);

/**
 * @route   POST /api/orders/:id/refund
 * @desc    Submit refund claim or return for an order
 * @access  Private
 */
router.post('/:id/refund', authenticateToken, refund);

export default router;
