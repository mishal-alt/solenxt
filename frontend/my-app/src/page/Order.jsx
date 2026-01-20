// src/user/Order.jsx - REVISED
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // ✅ Fetch latest user data
  const fetchLatestUserData = async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/${userId}`);
      const latestUser = res.data;
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const updatedCurrentUser = {
        ...currentUser,
        orders: latestUser.orders || [],
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
      setOrders(latestUser.orders || []);
    } catch (err) {
      console.error("Error fetching latest user data:", err);
      toast.error("Could not load your latest orders.");
    }
  };

  // ✅ Update user orders in DB
  const updateUserData = async (updatedData) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    try {
      await axiosInstance.patch(`/users/${currentUser.id}`, updatedData);
      await fetchLatestUserData(currentUser.id);
    } catch (err) {
      console.error("Error updating user data:", err);
    }
  };

  // ✅ Restore product stock when order cancelled
  const restoreProductStock = async (orderItems) => {
    try {
      for (const item of orderItems) {
        const res = await axiosInstance.get(`/products/${item.id}`);
        const product = res.data;

        const updatedStock = (parseInt(product.stoke) || 0) + item.quantity;

        await axiosInstance.patch(`/products/${item.id}`, { stoke: updatedStock.toString() });
      }
    } catch (err) {
      console.error("Error restoring product stock:", err);
    }
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchLatestUserData(currentUser.id);
  }, [navigate]);

  // ✅ Order status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "shipped":
        return "bg-blue-200 text-blue-800";
      case "delivered":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // ✅ Cancel order
  const handleCancelOrder = async (orderId, currentStatus) => {
    if (currentStatus.toLowerCase() === "cancelled") {
      toast.info("This order is already cancelled.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    )
      return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const orderToCancel = orders.find((o) => o.id === orderId);
    if (!orderToCancel) return;

    if (
      orderToCancel.status.toLowerCase() === "shipped" ||
      orderToCancel.status.toLowerCase() === "delivered"
    ) {
      toast.error("Cannot cancel an order that is already shipped or delivered.");
      return;
    }

    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    );

    setOrders(updatedOrders);
    await restoreProductStock(orderToCancel.items);
    await updateUserData({ orders: updatedOrders });

    toast.success("Order cancelled and product stock restored!");
  };

  return (
  <div className="min-h-screen bg-black py-24 px-6 ">
      <h1 className="text-5xl md:text-8xl font-thin text-center tracking-[0.3em] p-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase"> Order</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <h2 className="text-gray-500 text-xl font-semibold mb-2">
                Order #{order.id}
              </h2>
              <p className="text-white mb-2">
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
              <p className="text-white mb-2">
                Total: ₹{order.total.toLocaleString()}
              </p>

              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </div>

              <div className="mt-4">
                <h3 className=" text-gray-500 font-semibold mb-1">Items:</h3>
                <ul className="list-disc list-inside text-white">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity} (₹{item.price})
                    </li>
                  ))}
                </ul>
              </div>

              {order.status.toLowerCase() !== "shipped" &&
                order.status.toLowerCase() !== "delivered" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() =>
                        handleCancelOrder(order.id, order.status)
                      }
                      className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                      disabled={order.status.toLowerCase() === "cancelled"}
                    >
                      {order.status.toLowerCase() === "cancelled"
                        ? "Already Cancelled"
                        : "Cancel Order"}
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
