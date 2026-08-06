import prisma from '../config/prisma.js';

export const createOrder = async (userId, orderData) => {
  const {
    items,
    fullName,
    email,
    streetAddress,
    city,
    state,
    zipCode,
    shippingAddress,
    shippingMethod,
    promoCode
  } = orderData;

  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Cart is empty. Select expedition gear before checkout.');
    error.statusCode = 400;
    throw error;
  }

  let subtotal = 0;
  const orderItemsData = [];

  for (const item of items) {
    const pId = parseInt(item.productId || item.id, 10);
    let product = null;

    if (!isNaN(pId)) {
      product = await prisma.product.findUnique({ where: { id: pId } });
    }

    if (!product && item.name) {
      product = await prisma.product.findFirst({
        where: { name: { equals: item.name, mode: 'insensitive' } }
      });
    }

    if (!product) {
      product = await prisma.product.findFirst();
    }

    if (!product) {
      const error = new Error('Product equipment not found in inventory manifest.');
      error.statusCode = 400;
      throw error;
    }

    const itemPrice = product.price;
    const quantity = Number.parseInt(item.quantity, 10);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      const error = new Error(`Invalid quantity for product ${product.name}.`);
      error.statusCode = 400;
      throw error;
    }
    subtotal += itemPrice * quantity;

    orderItemsData.push({
      productId: product.id,
      quantity,
      price: itemPrice,
      variant: item.variant || `${product.name} / Standard`
    });
  }

  let shippingCost = 0;
  if (!shippingMethod || shippingMethod === 'Standard Ground') {
    if (subtotal < 1500) shippingCost = 150.00;
  } else if (shippingMethod === 'Expedited Air') shippingCost = 250.00;
  else if (shippingMethod === 'Summit Priority') shippingCost = 450.00;
  else {
    const error = new Error('Invalid shipping method.');
    error.statusCode = 400;
    throw error;
  }

  let discountAmount = 0;
  if (promoCode && promoCode.trim().toUpperCase() === 'SUMMIT10') {
    discountAmount = Math.round(subtotal * 0.10 * 100) / 100;
  }

  const taxAmount = Math.round((subtotal - discountAmount) * 0.15 * 100) / 100;
  const totalAmount = Math.round((subtotal - discountAmount + shippingCost + taxAmount) * 100) / 100;
  const orderNumber = `#SF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const formattedAddress = shippingAddress || `${streetAddress || ''}, ${city || ''}, ${state || ''} ${zipCode || ''}`;

  const newOrder = await prisma.order.create({
    data: {
      orderNumber,
      userId: parseInt(userId, 10),
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

  const earnedPoints = Math.floor(totalAmount * 10);
  await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: {
      loyaltyPoints: { increment: earnedPoints },
      activeDeployments: { increment: 1 }
    }
  });

  return { newOrder, earnedPoints };
};

export const getUserOrders = async (userId) => {
  return await prisma.order.findMany({
    where: { userId: parseInt(userId, 10) },
    include: {
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getOrderByIdOrNumber = async (userId, param) => {
  let whereClause = { userId: parseInt(userId, 10) };

  if (param.startsWith('#') || param.startsWith('SF-') || param.includes('-')) {
    const cleanNum = param.startsWith('#') ? param : `#${param}`;
    whereClause.orderNumber = cleanNum;
  } else {
    whereClause.id = parseInt(param, 10);
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

export const reorderItems = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(orderId, 10), userId: parseInt(userId, 10) },
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

export const refundOrder = async (userId, orderId) => {
  const result = await prisma.order.updateMany({
    where: { id: parseInt(orderId, 10), userId: parseInt(userId, 10) },
    data: { status: 'RETURNED' }
  });

  if (result.count === 0) {
    const error = new Error('Order mission not found in deployment history.');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.order.findUnique({ where: { id: parseInt(orderId, 10) } });
};
