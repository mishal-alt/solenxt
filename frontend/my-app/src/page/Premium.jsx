import React from 'react'
import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BASE_URL } from "../services/api"; 

function Premium() {
    const [premium, setPremium] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/products`) 
            .then((res) => res.json())
            .then((data) => {
                const premiumonly = data.filter((item) => item.premium === true);
                setPremium(premiumonly);
            });
    }, []);

    return (
        <div className="bg-black min-h-screen py-10 px-6" id="premium-collection ">
            <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight p-10 mt-10">
                <span className="bg-gradient-to-r from-white via-gray-400 to-gray-600 bg-clip-text text-transparent drop-shadow-lg">
                    Premium Shoe Collection
                </span>
            </h1>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 ">
                {premium.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-2xl p-4 shadow-lg hover:shadow-2xl transition duration-300 bg-white transform transition-all duration-300 hover:-translate-y-3 hover:shadow-2x"
                    >
                        <Link key={product.id} to={`/product/${product.id}`} className="block">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-60 object-cover rounded-xl"
                            />
                            <FiHeart className="ml-auto text-2xl text-gray-600 hover:text-black cursor-pointer transition mt-3.5" />

                            <h2 className="mt-3 text-lg font-bold text-black">{product.name}</h2>
                            <p className="text-gray-700 mt-1">₹{product.price}</p>
                            <p
                                className={
                                    product.stoke > 0
                                        ? "text-green-700 mt-1"
                                        : "text-red-500 font-bold mt-1"
                                }
                            >
                                {product.stoke > 0
                                    ? `Stock left : ${product.stoke}`
                                    : "Out Of Stock"}
                            </p>
                        </Link>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-3">
                            <button className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition">
                                Add To Cart
                            </button>

                            <button className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition">
                                BUY
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Premium;
