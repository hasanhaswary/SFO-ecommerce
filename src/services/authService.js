import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

/**
 * Authentication Service Layer
 *
 * business logic, database queries, password hashing, and JWT token generation
 */

/**
 * Private Helper: Signs a JSON Web Token for an authenticated user
 * @param {Object} user - User record from database
 * @returns {string} Signed JWT token string (valid for 7 days, may change later)
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Private Helper: Formats user object for public API response, stripping sensitive fields like password hashes
 * @param {Object} user - Raw database user record
 * @returns {Object} Clean user object payload
 */
const formatUserPayload = (user) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  loyaltyTier: user.loyaltyTier,
  loyaltyPoints: user.loyaltyPoints,
  milesLogged: user.milesLogged,
  totalSummits: user.totalSummits,
  activeDeployments: user.activeDeployments,
  bio: user.bio,
  phone: user.phone,
  shippingAddress: user.shippingAddress,
  billingAddress: user.billingAddress,
  twoFactorEnabled: user.twoFactorEnabled
});

/**
 * Registers a new user in the database
 * 1. Checks if email is already taken
 * 2. Hashes password using Bcrypt
 * 3. Creates User row in Prisma.
 * 4. Signs and returns JWT token + sanitized user payload.
 * 
 * @param {Object} data - { email, password, fullName, enrollClub }
 * @returns {Promise<{ user: Object, token: string }>}
 */
export const registerUser = async ({ email, password, fullName, enrollClub }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (existingUser) {
    const error = new Error('An account with this email address is already registered.');
    error.statusCode = 400;
    throw error;
  }

  // Hash raw password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user in database
  const newUser = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      fullName: fullName.trim(),
      loyaltyTier: 'Lead Explorer',
      loyaltyPoints: enrollClub ? 500 : 100,
    }
  });

  const token = generateToken(newUser);
  return { user: formatUserPayload(newUser), token };
};

/**
 * Authenticates user credentials during login
 * 1. Finds user by email in database
 * 2. Verifies password hash using Bcrypt
 * 3. Returns JWT token + user profile
 * 
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ user: Object, token: string }>}
 */
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (!user) {
    const error = new Error('Invalid credentials. Email or passkey does not match our records.');
    error.statusCode = 401;
    throw error;
  }

  // Compare raw password against hashed password in database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials. Email or passkey does not match our records.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user: formatUserPayload(user), token };
};
