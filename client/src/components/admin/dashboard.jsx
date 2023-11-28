import React, { useEffect, useState } from "react";
import Graphs from "./Graphs";

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order/orders");
        const data = await response.json();

        const deliveredOrders = data.orders.filter(
          (order) => order.status === "Delivered"
        );
        const totalSales = deliveredOrders.reduce(
          (total, order) => total + order.totalAmount,
          0
        );
        setDeliveredOrdersCount(deliveredOrders.length);
        setPendingOrdersCount(data.orders.length - deliveredOrders.length);


        setTotalSales(totalSales);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Dashboard
      </h2>

        <div className="mt-8 sm:mt-12">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col rounded-lg bg-slate-500 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-slate-300">
                Total Sales
              </dt>

              <dd className="text-4xl font-extrabold text-white md:text-5xl">
                ${totalSales}
              </dd>
            </div>

            <div className="flex flex-col rounded-lg bg-slate-500 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-slate-300">
                Delivered
              </dt>

              <dd className="text-4xl font-extrabold text-white md:text-5xl">
              {deliveredOrdersCount}
              </dd>
            </div>

            <div className="flex flex-col rounded-lg bg-slate-500 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-slate-300">
                Pending
              </dt>

              <dd className="text-4xl font-extrabold text-white md:text-5xl">
              {pendingOrdersCount}
              </dd>
            </div>
          </dl>
        </div>
      <Graphs />

      </div>
    </section>
  );
}
