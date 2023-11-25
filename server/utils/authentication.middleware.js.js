// authentication.middleware.js
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const authenticateUser = (req, res, next) => {

  const token = req.headers.authorization || req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Log in first'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return next(errorHandler(401, 'Unauthorized'));
  }
};


