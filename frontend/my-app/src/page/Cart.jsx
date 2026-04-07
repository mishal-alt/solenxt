import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { BASE_URL } from "../services/api";

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
    <div className="bg-black min-h-screen pt-24 md:pt-40 pb-20 px-6 relative overflow-hidden selection:bg-cyan-500/30">
      {/* Ambient Background Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <h2 className="text-4xl md:text-8xl font-thin text-center tracking-[0.15em] md:tracking-[0.3em] py-8 md:p-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase">
        ARCHIVE <span className="font-black">CART</span>
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-20 animate-fade-in relative z-10">
          <p className="text-gray-500 text-lg font-light italic mb-8 tracking-widest uppercase">"The archive is currently empty."</p>
          <Link
            to="/product"
          >
            <button className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-2xl">
              Explore Drops
            </button>
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden p-6 md:p-10">
            <div className="space-y-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-8 last:border-0 last:pb-0 gap-6"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={item.image.startsWith("/") ? `${BASE_URL}${item.image}` : item.image}
                        alt={item.name}
                        className="w-32 h-32 md:w-24 md:h-24 object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="font-black text-sm md:text-lg text-white uppercase tracking-wider">{item.name}</h3>
                      <p className="text-cyan-500 text-xs md:text-sm font-black tracking-widest">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12">
                    <div className="flex items-center bg-white/5 rounded-xl border border-white/10 px-2 h-12">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xl font-light"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-white font-black text-sm">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xl font-light"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50 hover:text-red-500 transition-colors p-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Total Archive Value</p>
              <h3 className="text-3xl font-black text-white">
                ₹{total.toLocaleString()}
              </h3>
            </div>
            <button
              onClick={() => {
                navigate("/payment");
                if (cart.length === 0) {
                  window.dispatchEvent(new Event("cartCleared"));
                }
              }}
              className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
            >
              Secure Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
