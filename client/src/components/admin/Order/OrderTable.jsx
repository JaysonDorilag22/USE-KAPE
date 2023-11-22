import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../../Sidebar";
export default function OrderTable() {
  const [userOrders, setUserOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch(`/api/order/orders`);

        if (!response.ok) {
          throw new Error("Failed to fetch user orders");
        }

        const data = await response.json();
        setUserOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserOrders();
  }, []);

  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredOrders(userOrders);
    } else {
      const filtered = userOrders.filter(
        (order) => order.status === selectedStatus
      );
      setFilteredOrders(filtered);
    }
  }, [selectedStatus, userOrders]);

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div style={{ display: "flex" }}>
    <Sidebar/>

    <div className="flex flex-col items-center">
      <div className="flex space-x-4 mb-4 mt-5">
        <button onClick={() => handleStatusClick("All")} className="nav-button">
          All
        </button>
        <button
          onClick={() => handleStatusClick("Processing")}
          className="nav-button"
        >
          Processing
        </button>
        <button
          onClick={() => handleStatusClick("Delivered")}
          className="nav-button"
        >
          Delivered
        </button>
        <button
          onClick={() => handleStatusClick("Cancelled")}
          className="nav-button"
        >
          Cancelled
        </button>
      </div>
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
                Name
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
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {order._id}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {order.shippingAddress.city}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {order.shippingAddress.recievername}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  $ {order.totalAmount}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {order.status}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {order.paymentMethod}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  <Link to={`/orderdetails/${order._id}`}>
                    <button className="inline-block rounded bg-slate-600 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
