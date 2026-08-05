import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hasan_summit_forge_jwt_super_secret_key_2026';

/**
 * Authentication Middleware
 * Validates JSON Web Token sent in Authorization header or x-auth-token header.
 * Attaches user record to req.user if valid, otherwise returns HTTP 401 Unauthorized. Booyah
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      token = req.headers['x-auth-token'];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Security token missing. Please log in to Basecamp.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch fresh user details from database boi
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        loyaltyTier: true,
        loyaltyPoints: true,
        bio: true,
        phone: true,
        shippingAddress: true,
        billingAddress: true,
        twoFactorEnabled: true,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired authentication token. Re-authenticating required.'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Populates req.user if token is present and valid
 * Probably will use this for guest access
 */
export const optionalToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if (!token) token = req.headers['x-auth-token'];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, fullName: true }
      });
      if (user) req.user = user;
    }
  } catch (e) {
    // Ignore invalid token in optional mode
  }
  next();
};

export { JWT_SECRET };
