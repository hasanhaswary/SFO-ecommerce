import prisma from '../config/prisma.js';

/**
 * Order Service Layer
 * Handles order total calculations (VAT, shipping tiers, promo codes), order transactions, and user loyalty point updates.
 */

/**
 * Processes checkout and creates an Order record with nested OrderItems
 * @param {number} userId - ID of purchasing user
 * @param {Object} orderData - Order payload (items, address, shippingMethod, promoCode)
 * @returns {Promise<{ newOrder: Object, earnedPoints: number }>}
 */
export const createOrder = async (userId, orderData) => {
  const {
    items,
    fullName,
    email,
    streetAddress,
    city,
    state,
    zipCode,
    shippingMethod,
    promoCode
  } = orderData;

  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Cart is empty. Select expedition gear before checkout.');
    error.statusCode = 400;
    throw error;
  }

  // Calculate subtotal from trusted database prices
  let subtotal = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(item.productId, 10) }
    });

    if (!product) {
      const error = new Error(`Product ID ${item.productId} not found.`);
      error.statusCode = 400;
      throw error;
    }

    const itemPrice = product.price;
    const quantity = parseInt(item.quantity, 10) || 1;
    subtotal += itemPrice * quantity;

    orderItemsData.push({
      productId: product.id,
      quantity,
      price: itemPrice,
      variant: item.variant || `${product.name} / Standard`
    });
  }

  // Calculate shipping cost based on method and cart value (in ZAR)
  let shippingCost = 0;
  if (!shippingMethod || shippingMethod === 'Standard Ground') {
    if (subtotal < 1500) shippingCost = 150.00; // Free ground shipping over R 1 500
  } else if (shippingMethod === 'Expedited Air') shippingCost = 250.00;
  else if (shippingMethod === 'Summit Priority') shippingCost = 450.00;
  else {
    const error = new Error('Invalid shipping method.');
    error.statusCode = 400;
    throw error;
  }

  // Apply promo code discount if valid
  let discountAmount = 0;
  if (promoCode && promoCode.trim().toUpperCase() === 'SUMMIT10') {
    discountAmount = Math.round(subtotal * 0.10 * 100) / 100;
  }

  // Calculate 15% VAT Tax
  const taxAmount = Math.round((subtotal - discountAmount) * 0.15 * 100) / 100;
  const totalAmount = Math.round((subtotal - discountAmount + shippingCost + taxAmount) * 100) / 100;

  // Generate unique order number (e.g. #SF-98412)
  const orderNumber = `#SF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const formattedAddress = `${streetAddress}, ${city}, ${state} ${zipCode}`;

  // Create Order and nested OrderItems in Prisma
  const newOrder = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      status: 'IN_TRANSIT',
      statusLabel: 'VERIFIED MISSION',
      subtotal,
      shippingCost,
      taxAmount,
      discountAmount,
      totalAmount,
      shippingMethod: shippingMethod || 'Standard Ground',
      shippingAddress: formattedAddress,
      items: { create: orderItemsData }
    },
    include: {
      items: { include: { product: true } }
    }
  });

  // Award user loyalty points (10 points per ZAR spent)
  const earnedPoints = Math.floor(totalAmount * 10);
  await prisma.user.update({
    where: { id: userId },
    data: {
      loyaltyPoints: { increment: earnedPoints },
      activeDeployments: { increment: 1 }
    }
  });

  return { newOrder, earnedPoints };
};

/**
 * Retrieves all order history records for a specific user.
 * @param {number} userId - User ID
 * @returns {Promise<Array>} List of orders with nested items
 */
export const getUserOrders = async (userId) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Retrieves single order by ID or order number string.
 * @param {number} userId - User ID
 * @param {string} param - Order ID or order number
 * @returns {Promise<Object>} Order object
 */
export const getOrderByIdOrNumber = async (userId, param) => {
  let whereClause = { userId };

  if (param.startsWith('#') || param.startsWith('SF-') || param.includes('-')) {
    const cleanNum = param.startsWith('#') ? param : `#${param}`;
    whereClause.orderNumber = cleanNum;
  } else {
    const idNum = Number.parseInt(param, 10);
    if (Number.isNaN(idNum)) {
      const error = new Error('Invalid order identifier.');
      error.statusCode = 400;
      throw error;
    }
    whereClause.id = idNum;
  }

  const order = await prisma.order.findFirst({
    where: whereClause,
    include: {
      items: { include: { product: true } }
    }
  });

  if (!order) {
    const error = new Error('Order mission not found in deployment history.');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

/**
 * Extracts items from a historical order to prepare a quick reorder
 * @param {number} userId - User ID
 * @param {number} orderId - Historical order ID
 * @returns {Promise<Array>} List of reorderable item objects
 */
export const reorderItems = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { product: true } } }
  });

  if (!order) {
    const error = new Error('Original mission order not found.');
    error.statusCode = 404;
    throw error;
  }

  return order.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    variant: item.variant,
    product: item.product
  }));
};

/**
 * Updates order status to RETURNED.
 * @param {number} userId - User ID
 * @param {number} orderId - Order ID to refund
 * @returns {Promise<Object>} Updated order object
 */
export const refundOrder = async (userId, orderId) => {
  const result = await prisma.order.updateMany({
    where: { id: orderId, userId },
    data: { status: 'RETURNED' }
  });

  if (result.count === 0) {
    const error = new Error('Order mission not found in deployment history.');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.order.findUnique({ where: { id: orderId } });
};
