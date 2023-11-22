import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function UserOrder() {
  const [userOrders, setUserOrders] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        // Use the user ID from Redux store
        const signedInUserId = currentUser._id; // Replace with your actual user ID logic

        const response = await fetch(`/api/order/user/${signedInUserId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user orders");
        }

        const data = await response.json();
        setUserOrders(data.orders);
      } catch (error) {
        console.error(error);
        // Handle error, e.g., show an error message to the user
      }
    };

    fetchUserOrders();
  }, [currentUser._id]); // Include currentUser._id in the dependency array to re-run the effect when it changes

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Order ID
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Address
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Total Amount
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Status
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Payment Method
            </th>
            <th className="whitespace-nowrap px-4 py-2">View</th>
          </tr>
        </thead>

        <tbody className="min-w-full divide-y-2 divide-gray-200 text-sm text-center">
          {userOrders.map((order) => (
            <tr key={order._id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {order._id}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {order.shippingAddress.city}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {order.totalAmount}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {order.status}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {order.paymentMethod}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                
                <Link to={`/order-details/${order._id}`}>
                <button
                  className="inline-block rounded bg-slate-600 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700"
                >
                  View
                </button>
                  </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
