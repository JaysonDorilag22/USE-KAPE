// routes/orders.js
import express from 'express';
import { createPost, editPost, getFeedPosts, getUserPosts, likePost } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verify.User.js';

const router = express.Router();

// User routes
router.post('/create', createPost); // User: Create a new order
router.get('/get/:userId', getUserPosts); // User: Get a specific order by ID
router.get('/get', getFeedPosts); // User: Get all orders for a specific user
router.put('/like/:id', likePost); // User: Cancel a specific order
router.put('/update/:id',verifyToken, editPost)
router.delete('/delete/:id')

// Admin routes

export default router;