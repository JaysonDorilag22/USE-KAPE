// authentication.middleware.js
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const authenticateUser = (req, res, next) => {
  // Get the token from the request headers, cookies, or wherever you store it
  const token = req.headers.authorization || req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  try {
    // Verify the token and set user information in req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return next(errorHandler(401, 'Unauthorized'));
  }
};
