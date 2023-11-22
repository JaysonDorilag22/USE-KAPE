import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderDetails() {
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/order/get/${orderId}`);
        if (!response.data) {
          throw new Error("Failed to fetch order details");
        }

        setOrder(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  if (loadingOrder || loadingProducts) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Order Details for Order ID: {orderId}</h2>
      <p>
        <strong>Total Amount:</strong> {order.totalAmount}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Payment Method:</strong> {order.paymentMethod}
      </p>
      <p>
        <strong>Payment Status:</strong> {order.paymentStatus}
      </p>

      <h3>Shipping Address</h3>
      <p>
        <strong>City:</strong> {order.shippingAddress.city}
      </p>
      <p>
        <strong>State:</strong> {order.shippingAddress.state}
      </p>
      <p>
        <strong>ZIP:</strong> {order.shippingAddress.zip}
      </p>

      <h3>Order Items</h3>
      <ul>
        {Array.isArray(order.items) &&
          order.items.map((item) => {
            const product = products.find((p) => p._id === item.product._id);

            return (
              <li key={item.product._id}>
                <p>
                  <strong>Product Name:</strong> {item.name}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Price:</strong> {item.price}
                </p>
                <p>Images</p>
                <p>this is name: {item.name}</p>
                  <img
                    src={item.imageUrls}
                    alt={item.name}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
              </li>
            );
          })}
      </ul>
    </div>
  );
}
