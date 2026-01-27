import { urlencoded } from "express";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    joinDate: { type: Date, default: Date.now },
    wishlist: { type: Array, default: [] },
    cart: { type: Array, default: [] },
    orders: { type: Array, default: [] },
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);


