// routes/orders.js
import express from 'express';
import { cancelOrder, createOrder,  getOrder,  getOrders, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';


const router = express.Router();

// User routes
router.post('/create', createOrder); // User: Create a new order
router.get('/get/:orderId', getOrder); // User: Get a specific order by ID
router.get('/user/:userId', getUserOrders); // User: Get all orders for a specific user
router.put('/cancel/:orderId', cancelOrder); // User: Cancel a specific order

// Admin routes
router.get('/orders', getOrders); // Admin: Get all orders for all users
router.put('/status/:orderId', updateOrderStatus); // Admin: Update the status of a specific order

export default router;