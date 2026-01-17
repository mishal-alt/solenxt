const mongoose = require("mongoose");

/* =========================
   CART ITEM SCHEMA
========================= */
const cartItemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    price: Number,
    image: String,
    quantity: Number,
  },
  { _id: false }
);

/* =========================
   ORDER ITEM SCHEMA
========================= */
const orderItemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    price: Number,
    image: String,
    quantity: Number,
  },
  { _id: false }
);

/* =========================
   ORDER SCHEMA
========================= */
const orderSchema = new mongoose.Schema(
  {
    id: Number, // frontend order id (Date.now())
    items: [orderItemSchema],
    total: Number,
    paymentMethod: String,
    date: Date,
    billingInfo: {
      name: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    status: {
      type: String,
      default: "placed",
    },
  },
  { _id: false }
);

/* =========================
   USER SCHEMA
========================= */
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isBlock: {
      type: Boolean,
      default: false,
    },

    joinDate: {
      type: Date,
      default: Date.now,
    },

    wishlist: {
      type: [String], // product IDs
      default: [],
    },

    cart: {
      type: [cartItemSchema],
      default: [],
    },

    orders: {
      type: [orderSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
