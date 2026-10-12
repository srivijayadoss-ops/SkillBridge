// Centralized error handler
export function errorHandler(err, req, res, _next) {
  if (res.headersSent) {
    return _next(err);
  }

  // Handle stale / expired session from connect-mongo
  if (err.message && err.message.includes('Unable to find the session to touch')) {
    if (req.session) {
      try { req.session.destroy(() => {}); } catch {}
    }
    res.clearCookie('skillswap.sid');
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation error', details: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ error: `A record with this ${field} already exists.` });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({ error: message });
}

// Custom API error
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
