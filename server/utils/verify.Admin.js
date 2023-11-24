import jwt from 'jsonwebtoken';

export const verifyTokenAdmin = (req, res, next) => {
    const token = req.cookies.access_token;
  
    if (!token) return next(errorHandler(401, 'Unauthorized'));
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, 'Forbidden'));
  
      const { userId, role } = user;
      
      // Assuming there's a route parameter like userId to identify the account to be deleted
      const requestedUserId = req.params.userId;
  
      // Check if the user is the owner of the account or an admin
      if (userId !== requestedUserId && role !== 'Admin') {
        return next(errorHandler(403, 'Forbidden: Insufficient privileges'));
      }
  
      req.user = user;
      next();
    });
  };
  