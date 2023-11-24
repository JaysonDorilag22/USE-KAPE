// controllers/orderController.js
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import { errorHandler } from '../utils/error.js';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';



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

    // Send email to the user with order details and PDF attachment
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jayson.dorilag@tup.edu.ph',
        pass: 'oxhq azxv uboe hhfz',
      },
    });

    const mailOptions = {
      from: 'useKape@gmail.com',
      to: user.email,
      subject: 'Order Confirmation',
      html: `
        <p>Hello ${user.username},</p>
        <p>Your order has been successfully placed. Here are the details:</p>
        <p>Total Amount: $${totalAmount}</p>
        <p>Items:</p>
        <ul>
          ${items.map(item => `<li>${item.quantity} x ${item.product} - $${item.price * item.quantity}</li>`).join('')}
        </ul>
        <p>Shipping Address: ${shippingAddress}</p>
        <p>Payment Method: ${paymentMethod}</p>
        <p>Thank you for your purchase!</p>
      `,
      attachments: [
        {
          filename: 'order_details.pdf',
          content: await generatePDF(order),
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Send a response
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function generatePDF(order) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const pdfContent = `
    <h1>Order Details</h1>
    <p>Total Amount: $${order.totalAmount}</p>
    <p>Items:</p>
    <ul>
      ${order.items.map(item => `
        <li>
          <img src="${item.imageUrls[0]}" alt="${item.name}" style="max-width: 100px; max-height: 100px;" />
          ${item.quantity} x ${item.name} - $${item.price * item.quantity}
        </li>
      `).join('')}
    </ul>
    <p>Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
    <p>Payment Method: ${order.paymentMethod}</p>
  `;

  await page.setContent(pdfContent);

  const pdfBuffer = await page.pdf();

  await browser.close();

  return pdfBuffer;
}


// export const createOrder = async (req, res, next) => {
//     try {
//       const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
  
//       // Check if the user exists
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       // Validate items (assuming items is an array of objects with productId, quantity, and price)
//       // Ensure that products exist and have sufficient quantity
//       for (const item of items) {
//         const product = await Product.findById(item.product);
//         if (!product || product.quantity < item.quantity) {
//           return res.status(400).json({ error: 'Invalid product or insufficient quantity' });
//         }
//       }
  
//       // Create the order
//       const order = new Order({
//         user: userId,
//         items,
//         totalAmount,
//         shippingAddress,
//         paymentMethod,
//       });
  
//       // Save the order to the database
//       await order.save();
  
//       // Update the user's order history
//       if (!user.orderHistory) {
//         user.orderHistory = []; // Initialize orderHistory if it doesn't exist
//       }
//       user.orderHistory.push(order._id);
//       await user.save();
  
//       // Update product quantities
//       for (const item of items) {
//         const product = await Product.findById(item.product);
//         product.quantity -= item.quantity;
//         await product.save();
//       }
  
//       // Send a response
//       res.status(201).json({ message: 'Order created successfully', order });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

  export const getOrder = async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(order);
    } catch (error) {
      next(error);
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


  async function sendEmailAndGeneratePDF(order, subject, content) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jayson.dorilag@tup.edu.ph',
        pass: 'oxhq azxv uboe hhfz',
      },
    });
  
    const mailOptions = {
      from: 'useKape@gmail.com',
      to: order.user.email,
      subject: subject,
      html: content,
      attachments: [
        {
          filename: 'order_details.pdf',
          content: await updategeneratePDF(order),
        },
      ],
    };
  
    await transporter.sendMail(mailOptions);
  }
  
  // Function to generate PDF
  async function updategeneratePDF(order) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    const pdfContent = `
      <h1>Order Details</h1>
      <p>Total Amount: $${order.totalAmount}</p>
      <p>Items:</p>
      <ul>
        ${order.items.map(item => `
          <li>
            <img src="${item.imageUrls[0]}" alt="${item.name}" style="max-width: 100px; max-height: 100px;" />
            ${item.quantity} x ${item.name} - $${item.price * item.quantity}
          </li>
        `).join('')}
      </ul>
      <p>Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
      <p>Payment Method: ${order.paymentMethod}</p>
    `;
  
    await page.setContent(pdfContent);
  
    const pdfBuffer = await page.pdf();
  
    await browser.close();
  
    return pdfBuffer;
  }
  
  // Update order status
  export const updateOrderStatus = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const newStatus = req.body.newStatus;
  
      const order = await Order.findById(orderId).populate('user');
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Update the order status
      order.status = newStatus;
      await order.save();
  
      // Send email with order status update
      const subject = 'Order Status Update';
      const content = `
        <p>Hello ${order.user.username},</p>
        <p>Your order (ID: ${order._id}) status has been updated to ${newStatus}.</p>
        <p>Thank you for shopping with us!</p>
      `;
  
      await sendEmailAndGeneratePDF(order, subject, content);
  
      // Return the updated order
      res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Cancel order
  export const cancelOrder = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
  
      const order = await Order.findById(orderId).populate('user');
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      if (order.status === 'Delivered') {
        return res.status(400).json({ error: 'Cannot cancel a delivered order' });
      }
  
      // Update order status to 'Cancelled'
      order.status = 'Cancelled';
      await order.save();
  
      // Send email and generate PDF for order cancellation
      const subject = 'Order Cancellation';
      const content = `
        <p>Hello ${order.user.username},</p>
        <p>Your order (ID: ${order._id}) has been cancelled.</p>
        <p>We apologize for any inconvenience. If you have any concerns, please contact our customer support.</p>
      `;
  
      await sendEmailAndGeneratePDF(order, subject, content);
  
      res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// export const updateOrderStatus = async (req, res, next) => {
//   try {
//     const orderId = req.params.orderId;
//     const newStatus = req.body.newStatus;

//     // Fetch the order from the database
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Update the order status
//     order.status = newStatus;
//     await order.save();

//     // Return the updated order
//     res.status(200).json({ message: 'Order status updated successfully', order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// export const cancelOrder = async (req, res, next) => {
//   try {
//     const orderId = req.params.orderId;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     if (order.status === 'Delivered') {
//       return res.status(400).json({ error: 'Cannot cancel a delivered order' });
//     }
//     order.status = 'Cancelled';
//     await order.save();

//     res.status(200).json({ message: 'Order cancelled successfully', order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
