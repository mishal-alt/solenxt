import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiSearch } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import { BASE_URL } from "../services/api";

function Product() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
    const [sortOrder, setSortOrder] = useState("");
    const [currentUser, setCurrentUser] = useState(
        () => JSON.parse(localStorage.getItem("currentUser"))
    );
    const [wishlist, setWishlist] = useState(currentUser?.wishlist || []);
    const [cart, setCart] = useState(currentUser?.cart || []);
    const [currentPage, setCurrentPage] = useState(1);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const category = searchParams.get("category");
        if (category) {
            setCategoryFilter(category);
        } else {
            setCategoryFilter("all");
        }
    }, [searchParams]);

    useEffect(() => {
        axiosInstance.get("/products", {
            params: {
                keyword: debouncedSearchTerm,
                category: categoryFilter,
                sort: sortOrder,
                pageNumber: currentPage,
            },
        })
            .then((res) => {
                setProducts(res.data.products);
                setTotalPages(res.data.pages);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, [debouncedSearchTerm, categoryFilter, sortOrder, currentPage]);

    const updateUserData = async (updatedData) => {
        const id = currentUser?.id || currentUser?._id;
        if (!id) return;

        try {
            await axiosInstance.patch(`/users/${id}`, updatedData);
        } catch (error) {
            console.error("Error updating user in DB:", error);
        }
    };

    const toggleWishlist = async (id) => {
        if (!currentUser) {
            toast.error("Please login first to manage your wishlist!");
            navigate("/login");
            return;
        }

        const updatedWishlist = wishlist.includes(id)
            ? wishlist.filter((item) => item !== id)
            : [...wishlist, id];

        setWishlist(updatedWishlist);

        const updatedUser = { ...currentUser, wishlist: updatedWishlist };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        await updateUserData({ wishlist: updatedWishlist });

        window.dispatchEvent(new Event("wishlistUpdated"));

        if (updatedWishlist.includes(id)) toast.success("Added to wishlist!");
        else toast.info("Removed from wishlist!");
    };

    const addToCart = async (product) => {
        if (!currentUser) {
            toast.error("Please login first to add products to cart!");
            navigate("/login");
            return;
        }

        const isAlreadyInCart = cart.some((item) => item.id === product.id);
        if (isAlreadyInCart) return;

        const updatedCart = [...cart, { ...product, quantity: 1 }];
        setCart(updatedCart);

        const updatedUser = { ...currentUser, cart: updatedCart };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        await updateUserData({ cart: updatedCart });

        window.dispatchEvent(new Event("cartUpdated"));

        toast.success("Added to cart!");
    };

    const currentProducts = products;

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, categoryFilter, sortOrder]);

    return (

        <div className="bg-neutral-950 pt-20 min-h-screen pb-20 px-6 relative overflow-hidden selection:bg-cyan-500/30">


            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <h1 className="text-4xl md:text-8xl font-thin text-center tracking-[0.1em] md:tracking-[0.3em] py-8 md:p-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase">
                Products
            </h1>


            <div className="max-w-7xl mx-auto mb-12 md:mb-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-xl p-2 md:p-2 rounded-3xl md:rounded-full border border-white/10 shadow-2xl">


                    <div className="relative flex-grow w-full md:w-auto px-4">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search collection..."
                            className="w-full pl-12 pr-6 py-4 rounded-full bg-transparent text-white focus:outline-none placeholder-gray-500 tracking-wide text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto px-2 pb-2 md:pb-0">
                        <select
                            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-medium text-gray-300 bg-white/5 border border-white/5 focus:bg-black focus:border-cyan-500/50 outline-none transition-all cursor-pointer hover:bg-white/10 appearance-none"
                            value={categoryFilter}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCategoryFilter(val);
                                if (val === "all") {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete("category");
                                    setSearchParams(newParams);
                                } else {
                                    setSearchParams({ ...Object.fromEntries(searchParams), category: val });
                                }
                            }}
                        >
                            <option value="all">All Categories</option>
                            <option value="men">Men's Collection</option>
                            <option value="women">Women's Collection</option>
                            <option value="premium">Premium Edition</option>
                        </select>

                        <select
                            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-medium text-gray-300 bg-white/5 border border-white/5 focus:bg-black focus:border-cyan-500/50 outline-none transition-all cursor-pointer hover:bg-white/10 appearance-none"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="">Sort Order</option>
                            <option value="lowToHigh">Price: Low to High</option>
                            <option value="highToLow">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-[1920px] mx-auto overflow-hidden">
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => {
                        const isInCart = cart.some((item) => String(item.id) === String(product.id) || String(item._id) === String(product.id));
                        const isInWishlist = wishlist.some(wishId => String(wishId) === String(product.id));

                        return (
                            <div
                                key={product.id}
                                className="group relative bg-[#0a0a0a] rounded-3xl overflow-hidden transition-all duration-500 border border-white/5 hover:border-white/10"
                            >

                                <div className="relative aspect-[3/4] overflow-hidden bg-[#111] p-6 md:p-8">
                                    <Link to={`/product/${product.id}`} className="block h-full w-full relative z-10">
                                        <img
                                            src={product.image.startsWith("/") ? `${BASE_URL}${product.image}` : product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </Link>

                                    <button
                                        onClick={() => toggleWishlist(product.id)}
                                        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/40 text-white hover:bg-white hover:text-red-600 transition-all duration-300"
                                    >
                                        {isInWishlist ? <FaHeart className="text-sm" /> : <FiHeart className="text-sm" />}
                                    </button>
                                </div>

                                {/* Minimalist Info */}
                                <div className="p-5 md:p-6">
                                    <Link to={`/product/${product.id}`} className="block group-hover:text-cyan-400 transition-colors duration-300">
                                        <h2 className="text-base md:text-lg font-medium text-white tracking-wide truncate">
                                            {product.name}
                                        </h2>
                                    </Link>

                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-lg md:text-xl text-gray-400 font-light">₹{product.price}</p>

                                        {/* Dot Status */}
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.stoke > 0 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                                {product.stoke > 0 ? `In Stock` : 'Sold Out'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Add Button */}
                                    <button
                                        onClick={() => {
                                            if (isInCart) navigate("/cart");
                                            else if (product.stoke > 0) addToCart(product);
                                        }}
                                        disabled={product.stoke <= 0}
                                        className={`mt-5 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isInCart
                                            ? "bg-white text-black hover:bg-gray-200"
                                            : product.stoke <= 0
                                                ? "bg-white/5 text-gray-600 cursor-not-allowed"
                                                : "bg-white/5 text-white hover:bg-cyan-500 hover:text-black border border-white/5 hover:border-cyan-500/50"
                                            }`}
                                    >
                                        {isInCart ? "View Cart" : product.stoke <= 0 ? "Unavailable" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-center col-span-full text-xl font-light tracking-wide py-20">
                        No products found matching your search.
                    </p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-20">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentPage === 1
                            ? "bg-white/5 text-gray-600 cursor-not-allowed"
                            : "bg-white/10 text-white hover:bg-white hover:text-black"
                            }`}
                    >
                        ←
                    </button>

                    <span className="text-gray-400 font-mono text-sm tracking-widest">
                        {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentPage === totalPages
                            ? "bg-white/5 text-gray-600 cursor-not-allowed"
                            : "bg-white/10 text-white hover:bg-white hover:text-black"
                            }`}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

export default Product;
