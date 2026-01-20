import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  LogIn,
  UserCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        setAdmin(parsed);
      } catch (error) {
        console.error("Invalid adminUser data:", error);
      }
    }
  }, []);

  const navLinks = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/products", name: "Manage Products", icon: <Package size={18} /> },
    { path: "/admin/users", name: "Manage Users", icon: <Users size={18} /> },
    { path: "/admin/orders", name: "Orders", icon: <ShoppingBag size={18} /> },
  ];

  const handleAuthClick = () => {
    if (admin) {
      localStorage.removeItem("adminUser");
      toast.success("Admin logged out successfully");
      setAdmin(null);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-black text-white flex flex-col shadow-xl border-r border-gray-800 z-50">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-extrabold tracking-wide text-center">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-1 text-center">Control Center</p>
      </div>

      <nav className="flex-1 flex flex-col p-4 space-y-2 mt-4 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-gray-800 hover:text-gray-200 text-gray-400"
                }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto ">
        {admin && (
          <div className="flex flex-col items-center mb-3">
            <UserCircle size={36} className="text-gray-300 mb-1" />
            <p className="text-sm font-semibold">{admin.fullName}</p>
            <p className="text-xs text-gray-400">{admin.email}</p>
          </div>
        )}

        <div className={admin ? "flex justify-center mt-4" : ""}>
          <button
            onClick={handleAuthClick}
            className="w-12 h-12 flex items-center justify-center  text-white font-semibold rounded-full hover:text-black hover:bg-white transition"
          >
            {admin ? <LogOut size={18} /> : <LogIn size={18} />}
            {!admin && "Login"}
          </button>
        </div>


        {/* <div className="mt-4 text-gray-500 text-xs text-center text-sm">
          <p>© 2025 Admin Panel</p>
          <p>All Rights Reserved</p>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;
