
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendOrderCancellationEmail } from "../utils/sendEmail.js";
import { generateOrderDetailsPDF, generateUpdatedOrderDetailsPDF } from "../utils/generatePDF.js";

export const createOrder = async (req, res, next) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      deliveryOption,
      paymentMethod,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ error: "Invalid product or insufficient quantity" });
      }
    }

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      deliveryOption,
      paymentMethod,
    });

    await order.save();

    if (!user.orderHistory) {
      user.orderHistory = [];
    }
    user.orderHistory.push(order._id);
    await user.save();
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      product.quantity -= item.quantity;
      await product.save();
    }

    const pdfBuffer = await generateOrderDetailsPDF(order);
    await sendOrderConfirmationEmail(user, order, pdfBuffer);

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.newStatus;

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const oldStatus = order.status;

    order.status = newStatus;
    await order.save();

    if (newStatus === "Delivered" && order.paymentStatus !== "Paid") {
      // If the new status is "Delivered" and payment status is not "Paid," update payment status
      order.paymentStatus = "Paid";
      await order.save();
    }

    const subject = "Order Status Update";
    const content = `
      <p>Hello ${order.user.username},</p>
      <p>Your order (ID: ${order._id}) status has been updated from ${oldStatus} to ${newStatus}.</p>
      <p>Thank you for shopping with us!</p>
    `;

    const updatedPdfBuffer = await generateUpdatedOrderDetailsPDF(order);

    await sendOrderStatusUpdateEmail(order.user, order, newStatus, updatedPdfBuffer);

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ error: "Cannot cancel a delivered order" });
    }

    order.status = "Cancelled";
    await order.save();

    const subject = "Order Cancellation";
    const content = `
      <p>Hello ${order.user.username},</p>
      <p>Your order (ID: ${order._id}) has been cancelled.</p>
      <p>We apologize for any inconvenience. If you have any concerns, please contact our customer support.</p>
    `;

    await sendOrderCancellationEmail(order.user, order);

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    console.log("Fetched orders:", orders);
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
