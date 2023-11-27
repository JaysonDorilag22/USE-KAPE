import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOrderConfirmationEmail = async (user, order, pdfBuffer) => {
  const mailOptions = {
    from: "useKape@gmail.com",
    to: user.email,
    subject: "Order Confirmation",
    html: generateOrderConfirmationHTML(order),
    attachments: [
      {
        filename: "order_details.pdf",
        content: pdfBuffer,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
   
  }
};

export const sendOrderStatusUpdateEmail = async (user, order, newStatus) => {
  const mailOptions = {
    from: "useKape@gmail.com",
    to: user.email,
    subject: "Order Status Update",
    html: generateOrderStatusUpdateHTML(order, newStatus),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order status update email sent successfully");
  } catch (error) {
    console.error("Error sending order status update email:", error);
    // Handle error
  }
};


export const sendOrderCancellationEmail = async (user, order) => {
  const mailOptions = {
    from: "useKape@gmail.com",
    to: user.email,
    subject: "Order Cancellation",
    html: generateOrderCancellationHTML(order),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order cancellation email sent successfully");
  } catch (error) {
    console.error("Error sending order cancellation email:", error);
    // Handle error
  }
};


function generateOrderConfirmationHTML(order) {
  return `
    <body>
      <h1>Order Confirmation</h1>
      <p>Your order (ID: ${order._id}) has been confirmed. Thank you for shopping with us!</p>
      ${generateOrderTable(order)}
    </body>
  `;
}


function generateOrderStatusUpdateHTML(order, newStatus) {
  return `
    <body>
      <h1>Order Status Update</h1>
      <p>Hello ${order.user.username},</p>
      <p>Your order (ID: ${order._id}) status has been updated to ${newStatus}.</p>
      ${generateOrderTable(order)}
    </body>
  `;
}


function generateOrderCancellationHTML(order) {
  return `
    <body>
      <h1>Order Cancellation</h1>
      <p>Hello ${order.user.username},</p>
      <p>Your order (ID: ${order._id}) has been cancelled.</p>
      <p>We apologize for any inconvenience. If you have any concerns, please contact our customer support.</p>
      ${generateOrderTable(order)}
    </body>
  `;
}

function generateOrderTable(order) {
  const productsTableHtml = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.product}</td>
        <td>${item.quantity}</td>
        <td>$${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  return `
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Product</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${productsTableHtml}
      </tbody>
    </table>
  `;
}
