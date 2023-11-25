import express from 'express';
import { addComment, createPost, deletePost, editPost, getFeedPosts, getPostById, getUserPosts, likePost } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verify.User.js';
import { verifyTokenAdmin } from '../utils/verify.Admin.js';

const router = express.Router();

// User routes
router.post('/create', verifyToken, createPost); // User: Create a new post
router.get('/get/:userId', getUserPosts); // User: Get a specific post by ID
router.get('/get/post/:postId', getPostById);
router.get('/get', verifyToken, getFeedPosts); // User: Get all posts for a specific user
router.put('/like/:postId',verifyToken, likePost); // User: Like or Unlike a specific post
router.post('/comment/:postId', verifyToken, addComment);

// this is Admin/owner
router.put('/edit/:postId', verifyTokenAdmin, editPost); // User: Edit a specific post
router.delete('/delete/:postId', verifyTokenAdmin, deletePost); // User: Delete a specific post

// Admin routes

export default router;