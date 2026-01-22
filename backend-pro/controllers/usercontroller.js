import User from "../models/user.js";
import Product from "../models/products.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  const formattedUsers = users.map((u) => ({
    id: u._id.toString(),
    fullName: u.fullName,
    email: u.email,
    isAdmin: u.isAdmin,
    isBlock: u.isBlock,
    joinDate: u.joinDate,
    wishlist: u.wishlist || [],
    cart: u.cart || [],
    orders: u.orders || [],
  }));

  res.json(formattedUsers);
});

const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, isAdmin, isBlock } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    isAdmin: isAdmin || false,
    isBlock: isBlock || false,
    joinDate: new Date(),
    wishlist: [],
    cart: [],
    orders: [],
  });

  await newUser.save();

  const accessToken = jwt.sign(
    { id: newUser._id, isAdmin: newUser.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: newUser._id, isAdmin: newUser.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      isBlock: newUser.isBlock,
      joinDate: newUser.joinDate,
      wishlist: newUser.wishlist,
      cart: newUser.cart,
      orders: newUser.orders,
    }
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  console.log("Updating user:", userId);
  console.log("Update data:", req.body);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true }
  );

  console.log("Updated user result:", updatedUser ? "Success" : "Not Found");

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    id: updatedUser._id.toString(),
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    isBlock: updatedUser.isBlock,
    joinDate: updatedUser.joinDate,
    wishlist: updatedUser.wishlist || [],
    cart: updatedUser.cart || [],
    orders: updatedUser.orders || [],
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  console.log("Fetching user by ID:", userId);
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    isAdmin: user.isAdmin,
    isBlock: user.isBlock,
    joinDate: user.joinDate,
    wishlist: user.wishlist || [],
    cart: user.cart || [],
    orders: user.orders || [],
  });
});

const addOrder = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { items, total, paymentMethod, billingInfo } = req.body;
  console.log("Placing order for user:", userId);

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const newOrder = {
    id: Date.now(),
    items,
    total,
    paymentMethod,
    billingInfo,
    date: new Date(),
    status: "Pending",
  };

  // Reduce product stock
  for (const item of items) {
    const productId = item.id || item._id; if (!productId) continue;

    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stoke: -item.quantity } }
    );
  }

  user.orders.push(newOrder);

  // Clear cart after placing order
  user.cart = [];

  await user.save();

  res.json(newOrder);
});

const getOrders = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.orders || []);
});

const inbock = async (req, res) => {
  const userid = req.params.id

  if (userid) {
    userid.isblock = !userid.isblock
  }
  res
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  addOrder,
  getOrders,
};
