// Authentication middleware
export function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required. Please log in.' });
}

// Role-based authorization
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({ error: 'You do not have permission to access this resource.' });
    }
    return next();
  };
}

// Attach user info from session
export function attachUser(req, res, next) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.userRole = req.session.userRole;
  }
  next();
}
