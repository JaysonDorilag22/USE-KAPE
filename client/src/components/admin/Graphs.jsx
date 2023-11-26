import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Graphs() {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [totalSalesPerDay, setTotalSalesPerDay] = useState({});
  const [mostPurchasedProduct, setMostPurchasedProduct] = useState(null);
  const chartRef = useRef(null);
  const productChartRef = useRef(null);
  const [mostPurchasedProductName, setMostPurchasedProductName] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    // Fetch data from the API
const fetchData = async () => {
  try {
    const response = await fetch('/api/order/orders');
    const data = await response.json();

    // Filter the orders with the status "Delivered"
    const deliveredOrders = data.orders.filter(order => order.status === 'Delivered');
    setDeliveredOrders(deliveredOrders);

    // Organize data by day using updatedAt
    const salesPerDay = deliveredOrders.reduce((acc, order) => {
      const orderDate = new Date(order.updatedAt).toLocaleDateString();
      acc[orderDate] = (acc[orderDate] || 0) + order.totalAmount;
      return acc;
    }, {});
    setTotalSalesPerDay(salesPerDay);

    // Find the most purchased product
    const productsCount = deliveredOrders.reduce((productCount, order) => {
      order.items.forEach(item => {
        const { product, quantity } = item;
        productCount[product] = (productCount[product] || 0) + quantity;
      });
      return productCount;
    }, {});
    const mostPurchasedProductId = Object.keys(productsCount).reduce((a, b) =>
      productsCount[a] > productsCount[b] ? a : b
    );
    setMostPurchasedProduct(mostPurchasedProductId);

    // Fetch product information for the most purchased product
    const productResponse = await fetch(`/api/product/get/${mostPurchasedProductId}`);
    const productData = await productResponse.json();
    setMostPurchasedProductName(productData.name); // Assuming 'name' is the property for the product name
    console.log('Most Purchased Product:', productData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


    // Call the fetchData function
    fetchData();
  }, []);

  useEffect(() => {
    // Create and update the chart for total sales per day
    const ctx = chartRef.current.getContext('2d');

    let myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(totalSalesPerDay),
        datasets: [
          {
            label: 'Total Sales for Delivered Orders',
            data: Object.values(totalSalesPerDay),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup chart on component unmount
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [totalSalesPerDay]);

  useEffect(() => {
    // Create and update the chart for the most purchased product
    if (mostPurchasedProduct) {
      const productChartCtx = productChartRef.current.getContext('2d');
      const productData = deliveredOrders
        .filter(order => order.status === 'Delivered')
        .flatMap(order => order.items)
        .filter(item => item.product === mostPurchasedProduct);

      let productChart = new Chart(productChartCtx, {
        type: 'bar',
        data: {
          labels: [mostPurchasedProduct],
          datasets: [
            {
              label: 'Quantity Sold',
              data: [productData.reduce((acc, item) => acc + item.quantity, 0)],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Cleanup chart on component unmount
      return () => {
        if (productChart) {
          productChart.destroy();
        }
      };
    }
  }, [mostPurchasedProduct, deliveredOrders]);

  return (
    <div>
      <h2>Total Sales for Delivered Orders per Day</h2>
      <canvas ref={chartRef}></canvas>

      {mostPurchasedProduct && (
  <div>
    <h2>Most Purchased Product: {mostPurchasedProductName}</h2>
    <canvas ref={productChartRef}></canvas>
  </div>
)}
    </div>
  );
}
