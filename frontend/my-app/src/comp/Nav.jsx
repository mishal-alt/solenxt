import React, { useEffect, useState } from "react";
import { FiHeart, FiShoppingBag, FiTruck } from "react-icons/fi";
import logo from "../assets/logo.png";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

const checkLoginStatus = () => {
    return localStorage.getItem("currentUser") || localStorage.getItem("adminUser");
};

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!checkLoginStatus());
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false); // Admin flag
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

        if (currentUser) {
            setUsername(currentUser.fullName);
            setWishlistCount(currentUser.wishlist?.length || 0);
            setCartCount(currentUser.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0);
            setIsAdmin(false);
        }

        if (adminUser) {
            setUsername(adminUser.fullName);
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        const updateWishlistCount = () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            setWishlistCount(currentUser?.wishlist?.length || 0);
        };
        const updateCartCount = () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            setCartCount(currentUser?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0);
        };
        window.addEventListener("wishlistUpdated", updateWishlistCount);
        window.addEventListener("cartUpdated", updateCartCount);
        return () => {
            window.removeEventListener("wishlistUpdated", updateWishlistCount);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setIsAdmin(false);
        toast.success("Logged out successfully!");
        navigate("/login");
        window.location.reload();
    };

    return (
        <header className="w-full bg-black/80 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50 transition-all duration-300">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <Link to="/" className="group relative py-2">
                    <div className="flex items-center">
                        <span className="text-xl md:text-2xl font-extralight tracking-[0.4em] text-white group-hover:tracking-[0.6em] transition-all duration-700 uppercase">
                            SOLE
                        </span>
                        <span className="text-xl md:text-2xl font-black italic ml-2 bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-500 uppercase">
                            NXT
                        </span>
                    </div>
                    {/* Cinematic Reveal Underline */}
                    <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 via-cyan-300 to-transparent group-hover:w-full transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                </Link>

                <nav className="hidden md:flex space-x-12 items-center">
                    {[
                        { name: "Home", path: "/" },
                        { name: "Shop", path: "/product" },
                        { name: "About", path: "/about" },
                        { name: "Contact", path: "/contact" }
                    ].map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="group relative py-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all duration-500"
                        >
                            <span className="group-hover:tracking-[0.5em] transition-all duration-500">
                                {link.name}
                            </span>
                            {/* Cinematic Nav Underline */}
                            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 text-cyan-500 group-hover:w-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-6">
                    <Link to="/wishlist" className="relative group">
                        <FiHeart className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300" />
                        {wishlistCount > 0 && <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">{wishlistCount}</span>}
                    </Link>
                    <Link to="/cart" className="relative group">
                        <FiShoppingBag className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300" />
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>}
                    </Link>
                    {isLoggedIn && !isAdmin && (
                        <Link to="/order" className="relative group">
                            <FiTruck className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </Link>
                    )}

                    {isLoggedIn && (
                        <span className="text-sm font-medium text-white tracking-wide hidden sm:block">HI, {username.toUpperCase()}</span>
                    )}

                    {/* Admin button for admins */}
                    {isAdmin && (
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
                        >
                            DASHBOARD
                        </button>
                    )}

                    {/* Logout button for both normal users and admins */}
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="text-xs font-bold bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all border border-white/20"
                        >
                            LOGOUT
                        </button>
                    )}

                    {!isLoggedIn && (
                        <Link to="/login" className="text-xs font-bold bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-all">
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
