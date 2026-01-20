import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function Cart() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const [cart, setCart] = useState(currentUser?.cart || []);

  const updateUserCart = async (updatedCart) => {
    const id = currentUser?.id || currentUser?._id;
    if (!id) return;

    try {
      await axiosInstance.patch(`/users/${id}`, { cart: updatedCart });
    } catch (error) {
      console.error("Error updating cart in DB:", error);
    }
  };

  const syncCart = async (updatedCart) => {
    setCart(updatedCart);
    const updatedUser = { ...currentUser, cart: updatedCart };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    await updateUserCart(updatedCart);

    // Dispatch event to update navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    syncCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    syncCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    syncCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-black min-h-screen mt-10">
      <h2 className="text-5xl md:text-8xl font-thin text-center tracking-[0.3em] p-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase"> Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty!</p>
          <Link
            to="/product"
            className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-zinc-900  rounded-2xl shadow-lg p-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between border-b py-4 gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                  <p className="text-white">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="bg-gray-200 px-3 py-1 rounded-lg text-lg"
                >
                  -
                </button>
                <span className="text-white text-lg">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="bg-gray-200 px-3 py-1 rounded-lg text-lg "
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-red-900 "
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-right">
            <h3 className="text-xl font-semibold text-white">
              Total: ₹{total.toLocaleString()}
            </h3>
            <button
              onClick={() => {
                navigate("/payment");
                if (cart.length === 0) {
                  window.dispatchEvent(new Event("cartCleared"));
                }
              }}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
