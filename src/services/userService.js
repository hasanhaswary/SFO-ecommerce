import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

/**
 * User Service Layer
 * Handles fetching profile stats, updating user manifest fields, changing passwords/2FA, and deleting user accounts
 */

/**
 * Retrieves user profile manifest details and statistics
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Profile object
 */
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

/**
 * Updates editable profile fields for a user.
 * @param {number} userId - User ID
 * @param {Object} updateFields - { fullName, bio, phone, shippingAddress, billingAddress }
 * @returns {Promise<Object>} Updated profile object
 */
export const updateUserProfile = async (userId, updateFields) => {
  const { fullName, bio, phone, shippingAddress, billingAddress } = updateFields;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
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

/**
 * Updates password passkey or 2FA settings for a user
 * @param {number} userId - User ID
 * @param {Object} securityData - { currentPassword, newPassword, twoFactorEnabled }
 * @returns {Promise<Object>} Updated user security record
 */
export const updateUserSecurity = async (userId, { currentPassword, newPassword, twoFactorEnabled }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
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

    // Verify current password before allowing password change
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Verification failed. Current passkey is incorrect.');
      error.statusCode = 400;
      throw error;
    }

    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
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

/**
 * Permanently deletes user account from database
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const retireUserAccount = async (userId) => {
  await prisma.user.delete({ where: { id: userId } });
  return true;
};
