import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

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

export const registerUser = async ({ email, password, fullName, enrollClub }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (existingUser) {
    const error = new Error('An account with this email address is already registered.');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials. Email or passkey does not match our records.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user: formatUserPayload(user), token };
};
