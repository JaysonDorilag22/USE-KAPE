import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Graphs() {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [totalSalesPerDay, setTotalSalesPerDay] = useState({});
  const [mostPurchasedProducts, setMostPurchasedProducts] = useState([]);
  const chartRef = useRef(null);
  const productChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/order/orders');
        const data = await response.json();

        const deliveredOrders = data.orders.filter(order => order.status === 'Delivered');
        setDeliveredOrders(deliveredOrders);

        const salesPerDay = deliveredOrders.reduce((acc, order) => {
          const orderDate = new Date(order.updatedAt).toLocaleDateString();
          acc[orderDate] = (acc[orderDate] || 0) + order.totalAmount;
          return acc;
        }, {});
        setTotalSalesPerDay(salesPerDay);

        const productsCount = deliveredOrders.reduce((productCount, order) => {
          order.items.forEach(item => {
            const { product, quantity } = item;
            productCount[product] = (productCount[product] || 0) + quantity;
          });
          return productCount;
        }, {});

        const mostPurchasedProducts = Object.keys(productsCount).sort((a, b) =>
          productsCount[b] - productsCount[a]
        );

        // Take the top 5 most purchased products (you can adjust this number)
        const topNMostPurchasedProducts = mostPurchasedProducts.slice(0, 5);

        // Fetch product information for the most purchased products
        const productDataPromises = topNMostPurchasedProducts.map(productId =>
          fetch(`/api/product/get/${productId}`).then(response => response.json())
        );

        const mostPurchasedProductsData = await Promise.all(productDataPromises);
        setMostPurchasedProducts(mostPurchasedProductsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
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

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [totalSalesPerDay]);

  useEffect(() => {
    if (mostPurchasedProducts.length > 0) {
      const productChartCtx = productChartRef.current.getContext('2d');
      
      let productChart = new Chart(productChartCtx, {
        type: 'bar',
        data: {
          labels: mostPurchasedProducts.map(product => product.name),
          datasets: [
            {
              label: 'Quantity Sold',
              data: mostPurchasedProducts.map(product => {
                const productId = product._id;
                const productData = deliveredOrders
                  .filter(order => order.status === 'Delivered')
                  .flatMap(order => order.items)
                  .filter(item => item.product === productId);

                return productData.reduce((acc, item) => acc + item.quantity, 0);
              }),
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

      return () => {
        if (productChart) {
          productChart.destroy();
        }
      };
    }
  }, [mostPurchasedProducts, deliveredOrders]);

  useEffect(() => {
    if (mostPurchasedProducts.length > 0) {
      const pieChartCtx = pieChartRef.current.getContext('2d');
      
      let pieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: {
          labels: mostPurchasedProducts.map(product => product.name),
          datasets: [
            {
              data: mostPurchasedProducts.map(product => {
                const productId = product._id;
                const productData = deliveredOrders
                  .filter(order => order.status === 'Delivered')
                  .flatMap(order => order.items)
                  .filter(item => item.product === productId);

                return productData.reduce((acc, item) => acc + item.quantity, 0);
              }),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
      });

      return () => {
        if (pieChart) {
          pieChart.destroy();
        }
      };
    }
  }, [mostPurchasedProducts, deliveredOrders]);

  return (
    <section className="bg-white">
    <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mt-8 sm:mt-12">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
            Total Sales for Delivered Orders per Day
            </dt>
  
            <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
            <canvas ref={chartRef}></canvas>
            </dd>
          </div>
  
          <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
            Most Purchased Products
            </dt>
  
            <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
            <canvas ref={productChartRef}></canvas>
            </dd>
          </div>
  
          <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
            Distribution of Sales Among Most Purchased Products
            </dt>
  
            <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
            <canvas ref={pieChartRef}></canvas>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
  
  );
}

