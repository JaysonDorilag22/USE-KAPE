import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();

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
        setCancellationLoading(false);
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

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(`/api/order/cancel/${orderId}`, {
        newStatus: "Cancelled",
      });

      if (response.data.message === "Order cancelled successfully") {
        // Optionally, you can update the state or take other actions
        navigate("/orders");
        console.log("Order cancelled successfully");
      } else {
        console.error("Failed to cancel the order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  if (loadingOrder || loadingProducts) {
    return <p>Loading...</p>;
  }

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <form className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Order Details for Order ID: {orderId}
          </h2>
          <h2 className="text-2xl font-bold mb-4">
            Reciever: {order.shippingAddress.recievername}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                Total Amount:
                <span className="text-red-500">*</span>
              </label>
              <p className="text-lg">${order.totalAmount}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                Status:
                <span className="text-red-500">*</span>
              </label>
              <p>{order.status}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                Payment Method:
                <span className="text-red-500">*</span>
              </label>
              <p>{order.paymentMethod}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                Payment Status:
                <span className="text-red-500">*</span>
              </label>
              <p>{order.paymentStatus}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mt-4 mb-2">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                City:
              </label>
              <p>{order.shippingAddress.city}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                State:
              </label>
              <p>{order.shippingAddress.state}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">ZIP:</label>
              <p>{order.shippingAddress.zip}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2">Order Items</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-center">Quantity</th>
                <th className="text-center">Price</th>
                <th className="text-center">Image</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(order.items) &&
                order.items.map((item) => {
                  const product = products.find(
                    (p) => p._id === item.product._id
                  );

                  return (
                    <tr key={item.product.id}>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">${item.price}</td>
                      <td className="text-center">
                        <img
                          src={item.imageUrls}
                          alt={item.name}
                          className="max-w-16 max-h-16 mx-auto"
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </form>
      </div>
      {order.status === "Processing" || order.status === "Shipped" ? (
        <a
          className={`mt-3 inline-block rounded border border-current px-8 py-3 text-sm font-medium ${
            cancellationLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600"
          } transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-red-500`}
          onClick={handleCancelOrder}
          disabled={cancellationLoading}
        >
          {order.status === "Processing" ? "Cancel order" : "Order shipped"}
        </a>
      ) : (
        <button
          className={`mt-3 inline-block rounded border border-current px-8 py-3 text-sm font-medium ${
            cancellationLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-400 cursor-pointer"
          }`}
          onClick={handleCancelOrder}
          disabled={cancellationLoading}
        >
          Cancel order
        </button>
      )}
    </div>
  );
}
