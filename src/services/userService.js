import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
    select: {
      id: true,
      email: true,
      fullName: true,
      bio: true,
      loyaltyTier: true,
      loyaltyPoints: true,
      milesLogged: true,
      totalSummits: true,
      activeDeployments: true,
      twoFactorEnabled: true,
      phone: true,
      shippingAddress: true,
      billingAddress: true,
      createdAt: true
    }
  });

  if (!user) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUserProfile = async (userId, updateFields) => {
  const { fullName, bio, phone, shippingAddress, billingAddress } = updateFields;

  const hasUpdates =
    fullName !== undefined ||
    bio !== undefined ||
    phone !== undefined ||
    shippingAddress !== undefined ||
    billingAddress !== undefined;

  if (!hasUpdates) {
    const error = new Error('No profile fields provided to update.');
    error.statusCode = 400;
    throw error;
  }

  if (fullName !== undefined && !fullName.trim()) {
    const error = new Error('Full name cannot be blank.');
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: {
      ...(fullName && { fullName: fullName.trim() }),
      ...(bio !== undefined && { bio }),
      ...(phone !== undefined && { phone }),
      ...(shippingAddress !== undefined && { shippingAddress }),
      ...(billingAddress !== undefined && { billingAddress })
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      bio: true,
      loyaltyTier: true,
      loyaltyPoints: true,
      milesLogged: true,
      totalSummits: true,
      activeDeployments: true,
      phone: true,
      shippingAddress: true,
      billingAddress: true,
      twoFactorEnabled: true
    }
  });

  return updatedUser;
};

export const updateUserSecurity = async (userId, { currentPassword, newPassword, twoFactorEnabled }) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (twoFactorEnabled !== undefined) {
    if (typeof twoFactorEnabled === 'boolean') {
      updateData.twoFactorEnabled = twoFactorEnabled;
    } else if (twoFactorEnabled === 'true' || twoFactorEnabled === 'false') {
      updateData.twoFactorEnabled = twoFactorEnabled === 'true';
    } else {
      const error = new Error('twoFactorEnabled must be a boolean.');
      error.statusCode = 400;
      throw error;
    }
  }

  if (newPassword) {
    if (!currentPassword) {
      const error = new Error('Current passkey is required to update security credentials.');
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Verification failed. Current passkey is incorrect.');
      error.statusCode = 400;
      throw error;
    }

    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullName: true,
      twoFactorEnabled: true
    }
  });

  return updatedUser;
};

export const retireUserAccount = async (userId) => {
  await prisma.$transaction([
    prisma.order.deleteMany({ where: { userId: parseInt(userId, 10) } }),
    prisma.user.delete({ where: { id: parseInt(userId, 10) } })
  ]);
  return true;
};
