// src/admin/Orders.jsx - REVIEWED and finalized with Shipped/Cancelled logic
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import axiosInstance from "../services/axiosInstance";
import CountUp from "react-countup";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const statusOptions = ["all", "Pending", "Shipped", "Delivered", "Cancelled"];
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ordersPerPage = 10;
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        shippedOrders: 0,
    });

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // --- Data Fetching ---
    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get("/admin/orders/stats");
            setOrderStats(res.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get("/admin/orders", {
                params: {
                    keyword: debouncedSearchTerm,
                    status: statusFilter,
                    pageNumber: currentPage,
                    pageSize: ordersPerPage,
                }
            });
            setOrders(res.data.orders);
            setTotalPages(res.data.pages);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const fetchSupportingData = async () => {
        try {
            const [usersRes, productsRes] = await Promise.all([
                axiosInstance.get("/admin/users", { params: { pageSize: 1000 } }),
                axiosInstance.get("/products", { params: { pageSize: 1000 } }),
            ]);
            setUsers(usersRes.data.users);
            setProducts(productsRes.data.products);
        } catch (err) {
            console.error("Error fetching supporting data:", err);
        }
    };

    useEffect(() => {
        fetchSupportingData();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [debouncedSearchTerm, statusFilter, currentPage]);

    // --- Stock Update Logic (Deduct/Restore) ---

    // Deduct stock for Shipped orders (executed only when changing TO Shipped)
    const deductProductStock = async (orderItems) => {
        const productUpdates = [];
        for (const item of orderItems) {
            const product = products.find(p => p.id === item.id);
            if (!product) continue;

            const currentStock = parseInt(product.stoke) || 0;
            const newStock = currentStock - item.quantity;

            if (newStock < 0) {
                console.error(`Not enough stock for ${product.name}`);
                alert(`Error: Not enough stock for ${product.name}. Stock is ${currentStock}.`);
                return false; // Indicate failure
            }

            productUpdates.push(
                axiosInstance.patch(`/products/${item.id}`, { stoke: newStock })
            );
        }
        await Promise.all(productUpdates);
        return true; // Indicate success
    };

    // Restore stock for Cancelled orders (executed only when changing TO Cancelled)
    const restoreProductStock = async (orderItems) => {
        const productUpdates = [];
        for (const item of orderItems) {
            const product = products.find(p => p.id === item.id);
            if (!product) continue;

            const currentStock = parseInt(product.stoke) || 0;
            const newStock = currentStock + item.quantity;

            productUpdates.push(
                axiosInstance.patch(`/products/${item.id}`, { stoke: newStock })
            );
        }
        await Promise.all(productUpdates);
    };


    // --- Status Update Logic (Unified) ---
    const handleUpdateStatus = async (orderId, userId, newStatus) => {
        const orderToUpdate = orders.find(o => o.orderId === orderId);
        if (!orderToUpdate) return;

        const oldStatus = orderToUpdate.status;

        if (newStatus === oldStatus) return;

        if (!window.confirm(`Are you sure you want to change order ID ${orderId} status from '${oldStatus}' to '${newStatus}'?`)) {
            return;
        }

        try {
            let isStockUpdateSuccessful = true;

            // 1. Handle Stock Logic based on status change
            if (newStatus === 'Shipped' && oldStatus === 'Pending') {
                // Change from PENDING to SHIPPED: DEDUCT STOCK
                isStockUpdateSuccessful = await deductProductStock(orderToUpdate.items);
            } else if (newStatus === 'Cancelled' && (oldStatus === 'Pending' || oldStatus === 'Shipped')) {
                // Change from PENDING/SHIPPED to CANCELLED: RESTORE STOCK
                await restoreProductStock(orderToUpdate.items);
            }

            if (!isStockUpdateSuccessful) {
                // If stock deduction failed, don't proceed with status change
                return;
            }

            // 2. Update the order status in the specific user's orders array
            const userToUpdate = users.find(u => u.id === userId);
            const updatedUserOrders = (userToUpdate.orders || []).map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            const updatedUser = { ...userToUpdate, orders: updatedUserOrders };
            // 3. Update the user on the server - only send the orders array
            await axiosInstance.patch(`/users/${userId}`, { orders: updatedUserOrders });

            // 4. Update local state
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            ));

            // 5. Re-fetch data
            await fetchSupportingData();
            await fetchOrders();
            await fetchStats();

            alert(`Order ${orderId} status successfully updated to ${newStatus}.`);

        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Failed to update order status and product stock.");
        }
    };

    // --- Calculated Stats ---
    const { totalOrders, totalRevenue, shippedOrders } = orderStats;

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, statusFilter]);

    // Helper for status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Shipped': return 'bg-blue-100 text-blue-800'; // Changed to blue for consistency
            case 'Delivered': return 'bg-green-100 text-green-800'; // Green for final delivery
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };


    return (
        <div className="flex min-h-screen bg-white text-black">
            <Sidebar />
            <div className="flex-1 p-10 ml-64 bg-gray-50">
                <h1 className="text-3xl font-bold mb-6">Orders</h1>

                {/* Stats Cards - Unchanged */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-black text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-sm font-semibold mb-2">Total Orders</h2>
                        <p className="text-3xl font-bold">
                            <CountUp end={totalOrders} duration={1} />
                        </p>
                    </div>
                    <div className="bg-black text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-sm font-semibold mb-2">Total Revenue</h2>
                        <p className="text-3xl font-bold">
                            ₹<CountUp end={totalRevenue} duration={2.5} separator="," />
                        </p>
                    </div>
                    <div className="bg-black text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-sm font-semibold mb-2">Shipped</h2>
                        <p className="text-3xl font-bold">
                            <CountUp end={shippedOrders} duration={1.5} />
                        </p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by customer name or order ID..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none min-w-[150px]"
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Orders Table */}
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order, index) => (
                                <React.Fragment key={order.orderId}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.date).toLocaleString('en-IN', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order.orderId, order.userId, e.target.value)}
                                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    {/* Order Items Row - unchanged from original code */}
                                    <tr>
                                        <td colSpan="7" className="p-0">
                                            <div className="bg-gray-100 p-4 border-l-4 border-indigo-500">
                                                <h4 className="text-xs font-semibold uppercase mb-2 text-gray-700">Products in Order:</h4>
                                                <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-600 mb-1">
                                                    <div>Product Name</div>
                                                    <div>Price</div>
                                                    <div>Quantity</div>
                                                    <div>Category</div>
                                                </div>
                                                {order.items.map((item, index) => {
                                                    const product = products.find(p => p.id === item.id);
                                                    const category = product ? product.cat : (item.cat || "N/A");
                                                    return (
                                                        <div key={index} className="grid grid-cols-4 gap-4 text-sm text-gray-800 border-t border-gray-200 pt-1 mt-1">
                                                            <div>{item.name}</div>
                                                            <div>₹{item.price.toLocaleString('en-IN')}</div>
                                                            <div>{item.quantity}</div>
                                                            <div className="capitalize">{category}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded font-medium transition ${currentPage === i + 1
                                ? "bg-black text-white shadow-lg"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;