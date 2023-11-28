// routes/orders.js
import express from 'express';
import { cancelOrder, createOrder,  getOrder,  getOrders, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { createReview, getAllReviewsForProduct } from '../controllers/review.controller.js';
import { verifyToken } from '../utils/verify.User.js';
import { authenticateUser } from '../utils/authentication.middleware.js.js';
import { isAdmin } from '../utils/isAdmin.js';



const router = express.Router();

// User routes
router.post('/create', verifyToken, createOrder); 
router.get('/get/:orderId',verifyToken,  getOrder); 
router.get('/user/:userId',verifyToken,  getUserOrders); 
router.put('/cancel/:orderId',verifyToken,  cancelOrder); 
// Admin routes
router.get('/orders',verifyToken,isAdmin,  getOrders); 
router.put('/status/:orderId',authenticateUser,isAdmin, updateOrderStatus); 
router.post('/reviews', authenticateUser, createReview);
router.get('/reviews/:productId', getAllReviewsForProduct)
export default router;