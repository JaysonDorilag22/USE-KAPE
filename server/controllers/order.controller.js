// controllers/orderController.js
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export const createOrder = async (req, res, next) => {
    try {
      const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Validate items (assuming items is an array of objects with productId, quantity, and price)
      // Ensure that products exist and have sufficient quantity
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product || product.quantity < item.quantity) {
          return res.status(400).json({ error: 'Invalid product or insufficient quantity' });
        }
      }
  
      // Create the order
      const order = new Order({
        user: userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
      });
  
      // Save the order to the database
      await order.save();
  
      // Update the user's order history
      if (!user.orderHistory) {
        user.orderHistory = []; // Initialize orderHistory if it doesn't exist
      }
      user.orderHistory.push(order._id);
      await user.save();
  
      // Update product quantities
      for (const item of items) {
        const product = await Product.findById(item.product);
        product.quantity -= item.quantity;
        await product.save();
      }
  
      // Send a response
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  export const getOrder = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
  
      // Check if orderId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }
  
      // Fetch the order from the database
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Return the order details
      res.status(200).json({ order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Fetch all orders for the user from the database
    const orders = await Order.find({ user: userId });

    // Return the user's orders
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOrders = async (req, res, next) => {
    try {
      // Fetch all orders from the database
      const orders = await Order.find();
  
      // Log the fetched orders
      console.log('Fetched orders:', orders);
  
      // Return all orders
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.newStatus;

    // Fetch the order from the database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the order status
    order.status = newStatus;
    await order.save();

    // Return the updated order
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
