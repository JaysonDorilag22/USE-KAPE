import puppeteer from "puppeteer";

export const generateOrderDetailsPDF = async (order) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const pdfContent = generateOrderPDFContent(order);

  await page.setContent(pdfContent);

  const pdfBuffer = await page.pdf();

  await browser.close();

  return pdfBuffer;
};


export const generateUpdatedOrderDetailsPDF = async (order) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const pdfContent = generateUpdatedOrderPDFContent(order);

  await page.setContent(pdfContent);

  const pdfBuffer = await page.pdf();

  await browser.close();

  return pdfBuffer;
};


function generateOrderPDFContent(order) {
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
    <html>
      <head>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }

          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }

          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Order Details</h1>
        <p>Total Amount: $${order.totalAmount}</p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsTableHtml}
          </tbody>
        </table>
        <p>Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
        <p>Payment Method: ${order.paymentMethod}</p>
      </body>
    </html>
  `;
}


function generateUpdatedOrderPDFContent(order) {
  const itemsListHtml = order.items
    .map(
      (item) => `
      <li>
        <table style="border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #ddd;">
              ${item.quantity} x ${item.name}
            </td>
            <td style="border: 1px solid #ddd;">$${item.price * item.quantity}</td>
          </tr>
        </table>
      </li>
    `
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          table {
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <h1>Order Details</h1>
        <table style="border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd;">Total Amount</th>
            <td style="border: 1px solid #ddd;">$${order.totalAmount}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd;">Items</th>
            <td style="border: 1px solid #ddd;">
              <ul>
                ${itemsListHtml}
              </ul>
            </td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd;">Shipping Address</th>
            <td style="border: 1px solid #ddd;">
              ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
            </td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd;">Payment Method</th>
            <td style="border: 1px solid #ddd;">${order.paymentMethod}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
