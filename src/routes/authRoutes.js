import express from 'express';
import { register, login, forgotPassword, getUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Authentication Endpoints Router
 * Maps HTTP URL paths to controller action handlers
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account & issue JWT authentication token
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user login credentials & issue JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/user
 * @desc    Retrieve profile details for currently authenticated user
 * @access  Private (Requires valid JWT token in Authorization header)
 */
router.get('/user', authenticateToken, getUser);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password recovery protocol reset link
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

export default router;
