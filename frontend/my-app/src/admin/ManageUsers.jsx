// src/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import Sidebar from "./components/Sidebar";
import { toast } from "react-toastify";
import CountUp from "react-countup";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "blocked", "admin"

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    admins: 0,
    blocked: 0,
    activeUsers: 0,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearchTerm, filter, currentPage]);

  const fetchStats = () => {
    axiosInstance
      .get("/admin/users/stats")
      .then((res) => setUserStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  };

  const fetchUsers = () => {
    axiosInstance
      .get("/admin/users", {
        params: {
          keyword: debouncedSearchTerm,
          filter: filter,
          pageNumber: currentPage,
          pageSize: usersPerPage,
        },
      })
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.pages);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  // ✅ Toggle Admin Status
  const handleMakeAdmin = async (id, isAdmin) => {
    // Current backend allows updating any field via PATCH /users/:id 
    // This assumes the logged in user is admin, which they must be to see this page.
    await axiosInstance.patch(`/users/${id}`, { isAdmin: !isAdmin });
    fetchUsers();
    fetchStats();
  };

  // ✅ Toggle Block Status
  const handleBlockUser = async (id, isBlock) => {
    // Use the specific admin route for blocking
    await axiosInstance.patch(`/admin/users/${id}/block`);
    fetchUsers();
    fetchStats();
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/admin/users/${id}`);
        fetchUsers();
        fetchStats();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || "Error deleting user");
      }
    }
  };

  const { totalUsers, admins, blocked, activeUsers } = userStats;

  // ✅ Search, filtering, and pagination are now handled by the backend
  const filteredUsers = users;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filter]);

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="flex min-h-screen bg-white text-black">
        <Sidebar />
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

          {/* ✅ Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Total Users</h2>
              <p className="text-3xl mt-2">
                <CountUp end={totalUsers} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Admins</h2>
              <p className="text-3xl mt-2">
                <CountUp end={admins} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Blocked</h2>
              <p className="text-3xl mt-2">
                <CountUp end={blocked} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Active Users</h2>
              <p className="text-3xl mt-2">
                <CountUp end={activeUsers} duration={1.5} />
              </p>
            </div>
          </div>

          {/* ✅ Search & Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="flex-1 p-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="all">All Users</option>
              <option value="blocked">Blocked Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* ✅ Users Table - Wrapped for horizontal scroll */}
          <div className="overflow-x-auto rounded-lg border border-black shadow-sm">
            <table className="w-full min-w-max">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 text-left">No.</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-left">Orders</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredUsers.map((u, index) => {
                  const userId = u.id || u._id;
                  return (
                    <tr key={userId} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      {/* ✅ Serial Number */}
                      <td className="p-3 font-medium text-gray-600">{(currentPage - 1) * usersPerPage + index + 1}</td>
                      {/* ✅ User Name and ID */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{u.fullName}</p>
                            <p className="text-xs text-gray-500 w-20 truncate" title={userId}>ID: {userId}</p>
                          </div>
                        </div>
                      </td>

                      {/* ✅ Email */}
                      <td className="p-3 text-sm">{u.email}</td>

                      {/* ✅ Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isBlock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            }`}
                        >
                          {u.isBlock ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* ✅ Join Date */}
                      <td className="p-3 text-sm">
                        {new Date(u.joinDate).toLocaleDateString("en-US")}
                      </td>

                      {/* ✅ Orders Count */}
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                          {u.orders?.length || 0}
                        </span>
                      </td>

                      {/* ✅ Role */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isAdmin ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {u.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>

                      {/* ✅ Action Buttons */}
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleMakeAdmin(userId, u.isAdmin)}
                            className={`px-3 py-1 rounded text-xs font-medium transition whitespace-nowrap ${u.isAdmin
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                          >
                            {u.isAdmin ? "Remove Admin" : "Make Admin"}
                          </button>

                          <button
                            onClick={() => handleBlockUser(userId, u.isBlock)}
                            className={`px-3 py-1 rounded text-xs font-medium transition w-20 ${u.isBlock
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-amber-500 text-white hover:bg-amber-600"
                              }`}
                          >
                            {u.isBlock ? "Unblock" : "Block"}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(userId)}
                            className="px-3 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded font-medium transition ${currentPage === i + 1
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
