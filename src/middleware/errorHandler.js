export const errorHandler = (err, req, res, next) => {
  console.error('[Summit Forge Engine Error]:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal engine error occurred.';

  res.status(statusCode).json({
    success: false,
    error: message
  });
};
