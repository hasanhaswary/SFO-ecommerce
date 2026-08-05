import express from 'express';
import { getProfile, updateProfile, updateSecurity, retireAccount } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * User Profile & Command Center Router
 * Handles updating profile details, security passkeys, and account retirement
 */

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile details and stats
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update editable profile fields (bio, phone, shipping/billing address)
 * @access  Private
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * @route   PUT /api/user/security
 * @desc    Update password passkey or 2FA security settings
 * @access  Private
 */
router.put('/security', authenticateToken, updateSecurity);

/**
 * @route   DELETE /api/user/retire
 * @desc    Permanently purge user account from database
 * @access  Private
 */
router.delete('/retire', authenticateToken, retireAccount);

export default router;
