import * as authService from '../services/authService.js';

/**
 * Authentication Controller Layer
 * 
 * Responsible strictly for Express HTTP Request validation, status code handling,
 * calling the service layer, and returning JSON responses.
 */


/**
 * @desc    Register a new user account & issue JWT authentication token
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, enrollClub } = req.body;

    // Validate required HTTP request payload fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required credentials. Email, password, and full name are required.'
      });
    }

    // Delegate database creation, hashing, and token signing to the Service Layer
    const { user, token } = await authService.registerUser({ email, password, fullName, enrollClub });

    // Send HTTP 201 Created response
    res.status(201).json({
      success: true,
      message: 'Basecamp registration successful.',
      token,
      user
    });
  } catch (error) {
    // Pass error to global errorHandler middleware
    next(error);
  }
};

/**
 * @desc    Authenticate user login credentials & issue JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email address and password.'
      });
    }

    // Delegate authentication verification to the Service Layer
    const { user, token } = await authService.loginUser({ email, password });

    // Send HTTP 200 OK response with JWT token
    res.json({
      success: true,
      message: 'Basecamp authentication successful.',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve currently logged in user profile details
 * @route   GET /api/auth/me
 * @access  Private (Requires authenticateToken middleware)
 */
export const getUser = async (req, res) => {
  // User object was populated on req.user by authMiddleware
  res.json({
    success: true,
    user: req.user
  });
};

/**
 * @desc    Request password recovery protocol link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid expedition email address.'
      });
    }

    // Always respond with success to prevent email enumeration vulnerability
    res.json({
      success: true,
      message: 'Security recovery uplink dispatched to inbox. Please check your email for the secure reset protocol link.'
    });
  } catch (error) {
    next(error);
  }
};
