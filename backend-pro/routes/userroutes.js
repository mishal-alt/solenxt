const express = require("express");
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, addOrder, getOrders } = require("../controllers/usercontroller");
const { protect, admin } = require("../middleware/authMiddleware");

// GET /users
router.get("/", protect, admin, getUsers);

// GET /users/:id
router.get("/:id", protect, getUserById);

// POST /users
router.post("/", createUser); 
// PATCH /users/:id
router.patch("/:id", protect, updateUser);

// GET /users/:id/orders
router.get("/:id/orders", protect, getOrders);

// POST /users/:id/orders
router.post("/:id/orders", protect, addOrder);

module.exports = router;

