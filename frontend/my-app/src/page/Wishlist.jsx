import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";
import { BASE_URL } from "../services/api";

function Wishlist() {

  const [wishlist, setWishlist] = useState([]); // store user wishlist product IDs
  const [products, setProducts] = useState([]); // store all available products from DB
  const [cart, setCart] = useState([]); // store user's cart items
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  useEffect(() => {
    if (currentUser) {
      setWishlist(currentUser.wishlist || []);
      setCart(currentUser.cart || []);
    }

    axiosInstance.get("/products", { params: { pageSize: 1000 } })
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log(err));
  }, []);

  const updateUserData = async (updatedData) => {
    const id = currentUser?.id || currentUser?._id;
    if (!id) return;

    try {
      await axiosInstance.patch(`/users/${id}`, updatedData);
    } catch (error) {
      console.error("Error updating wishlist in DB:", error);
    }
  };

  const removeFromWishlist = async (id) => {
    if (!currentUser) return;

    const updatedWishlist = (currentUser.wishlist || []).filter(
      (item) => item !== id
    );

    const updatedUser = { ...currentUser, wishlist: updatedWishlist };

    setWishlist(updatedWishlist);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    await updateUserData({ wishlist: updatedWishlist });

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = async (product) => {
    if (!currentUser) return;

    const currentCart = currentUser.cart || [];

    const isInCart = currentCart.find((item) => item.id === product.id);

    const updatedCart = isInCart
      ? currentCart
      : [...currentCart, { ...product, quantity: 1 }];

    const updatedWishlist = (currentUser.wishlist || []).filter(
      (id) => id !== product.id
    );

    const updatedUser = {
      ...currentUser,
      cart: updatedCart,
      wishlist: updatedWishlist,
    };

    setCart(updatedCart);
    setWishlist(updatedWishlist);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    // Update in database
    await updateUserData({
      cart: updatedCart,
      wishlist: updatedWishlist,
    });

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  //  Get full product objects from wishlist IDs
  const wishlistItems = products.filter((item) =>
    wishlist.some(wishId => String(wishId) === String(item.id) || String(wishId) === String(item._id))
  );

  return (
    <div className="bg-black min-h-screen py-20 px-6 text-white mt-5">
      <h1 className="text-5xl md:text-8xl font-thin text-center tracking-[0.3em] p-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase">
        Wishlist
      </h1>

      {wishlistItems.length > 0 ? (
        <div className="max-w-5xl mx-auto space-y-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:flex-row items-center justify-between bg-zinc-900 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <img
                  src={product.image.startsWith("/") ? `${BASE_URL}${product.image}` : product.image}
                  alt={product.name}
                  className="w-28 h-28 object-cover rounded-xl border border-zinc-700"
                />
                <div>
                  <Link
                    to={`/product/${product.id}`} // navigate to product details page
                    className="text-xl font-semibold hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-400 mt-1">₹{product.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  <FaHeart className="text-red-500" />
                  <span>Remove</span>
                </button>

                <button
                  onClick={() => addToCart(product)}
                  className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  {cart.find((item) => item.id === product.id)
                    ? "Added to Cart"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-300 text-lg">Your wishlist is empty</p>
          <Link
            to="/product"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
