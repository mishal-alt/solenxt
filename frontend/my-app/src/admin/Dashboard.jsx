// src/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import Sidebar from "./components/Sidebar";
import CountUp from "react-countup";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    totalSales: 0,
    totalOrders: 0
  });

  useEffect(() => {
    // Fetches stats from the server
    axiosInstance.get("/admin/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching admin stats:", err));
  }, []);

  const pieData = [
    { name: "Users", value: stats.usersCount },
    { name: "Products", value: stats.productsCount },
    { name: "Sales", value: stats.totalOrders },
  ];

  const COLORS = ["#9CA3AF", "#4B5563", "#1F2937"];

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">

      <div className="flex min-h-screen bg-white text-black">
        <Sidebar />

        <div className="flex-1 p-10">
          <h1 className="text-4xl font-bold mb-10">Dashboard Overview</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-3xl mt-2">
                <CountUp end={stats.usersCount} duration={0.6} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Products</h2>
              <p className="text-3xl mt-2">
                <CountUp end={stats.productsCount} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Orders</h2>
              <p className="text-3xl mt-2">
                <CountUp end={stats.totalOrders} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Revenue</h2>
              <p className="text-3xl mt-2">
                <CountUp end={stats.totalSales} duration={1.5} prefix="₹" separator="," />
              </p>
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="bg-gray-100 rounded-xl p-10 shadow-lg flex justify-center mb-10">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    borderRadius: "8px",
                    border: "1px solid #000",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;