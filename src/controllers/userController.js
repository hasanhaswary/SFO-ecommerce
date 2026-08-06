import * as userService from '../services/userService.js';

/**
 * User Controller Layer
 * Handles user profile queries, profile updates, security credential changes, and account deletion
 */

/**
 * @desc    Get user profile manifest & statistics
 * @route   GET /api/user/profile
 * @access  Private (Requires authenticateToken)
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile manifest fields (bio, phone, shipping/billing address)
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowedKeys = ['fullName', 'bio', 'phone', 'shippingAddress', 'billingAddress'];
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const hasAnyUpdate = allowedKeys.some((k) => body[k] !== undefined);

    if (!hasAnyUpdate) {
      return res.status(400).json({
        success: false,
        error: 'No profile fields provided to update.'
      });
    }

    const updatedUser = await userService.updateUserProfile(req.user.id, body);
    res.json({
      success: true,
      message: 'Command Center profile manifest updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password passkey
 * @route   PUT /api/user/security
 * @access  Private
 */
export const updateSecurity = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserSecurity(req.user.id, req.body);
    res.json({
      success: true,
      message: 'Security protocol configuration updated.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Permanently purge user account from database
 * @route   DELETE /api/user/retire
 * @access  Private
 */
export const retireAccount = async (req, res, next) => {
  try {
    await userService.retireUserAccount(req.user.id);
    res.json({
      success: true,
      message: 'Account permanently retired from service and purged from database.'
    });
  } catch (error) {
    next(error);
  }
};
