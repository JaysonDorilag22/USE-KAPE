// middleware/authorizationMiddleware.js

import User from '../models/user.model.js';
import Post from '../models/post.model.js';

export const isAuthorized = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : undefined; 
    const postId = req.params.postId;

    console.log('req.user:', req.user);
    console.log('userId:', userId);

    if (!userId) {
      return res.status(403).json({ error: 'Forbidden: User ID not found' });
    }

    console.log('req.user.role:', req.user.role);
    const isAdmin = req.user && req.user.role === 'Admin'; 
    console.log('isAdmin:', isAdmin);

    const post = await Post.findById(postId);
    console.log('Post details:', post);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log('post.user:', post.user); 

    const isPostCreatedByUser = post.user.toString() === userId.toString();
    console.log('isPostCreatedByUser:', isPostCreatedByUser);

    if (isAdmin || isPostCreatedByUser) {
      next(); // User is authorized, proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error('Authorization middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
