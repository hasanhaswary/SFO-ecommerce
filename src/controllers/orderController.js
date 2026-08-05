import * as orderService from '../services/orderService.js';

/**
 * Order Controller Layer
 * Manages HTTP endpoints for checkout, order history retrieval, reorders, and refunds
 */

/**
 * @desc    Create new order mission & dispatch checkout
 * @route   POST /api/orders
 * @access  Private (Requires authenticateToken)
 */
export const createOrder = async (req, res, next) => {
  try {
    // Delegate calculations, Prisma transaction, and loyalty point award to Service layer
    const { newOrder, earnedPoints } = await orderService.createOrder(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: 'Expedition mission order created successfully. Dispatch initiated.',
      order: newOrder,
      earnedPoints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's order expedition history
 * @route   GET /api/orders
 * @access  Private
 */
export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order details by ID or order number (#SF-XXXXX)
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByIdOrNumber(req.user.id, req.params.id);
    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick reorder endpoint preparing items from a past order
 * @route   POST /api/orders/:id/reorder
 * @access  Private
 */
export const reorder = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ success: false, error: 'Invalid order ID' });
    }
    const reorderItems = await orderService.reorderItems(req.user.id, orderId);

    res.json({
      success: true,
      message: 'Items prepared for reorder.',
      reorderItems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request order return or refund claim
 * @route   POST /api/orders/:id/refund
 * @access  Private
 */
export const refund = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const updatedOrder = await orderService.refundOrder(req.user.id, orderId);

    res.json({
      success: true,
      message: `Refund claim initiated for order ${updatedOrder.orderNumber}. Return shipping label dispatched.`,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
