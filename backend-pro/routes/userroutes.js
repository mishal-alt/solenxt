import express from "express";
import { getUsers, getUserById, createUser, updateUser, addOrder, getOrders } from "../controllers/usercontroller.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { registerSchema, updateUserSchema, orderSchema } from "../validation/userValidation.js";

const router = express.Router();

// GET /users
router.get("/", protect, admin, getUsers);

// GET /users/:id
router.get("/:id", protect, getUserById);

// POST /users
router.post("/", validate(registerSchema), createUser);

// PATCH /users/:id
router.patch("/:id", protect, validate(updateUserSchema), updateUser);

// GET /users/:id/orders
router.get("/:id/orders", protect, getOrders);

// POST /users/:id/orders
router.post("/:id/orders", protect, validate(orderSchema), addOrder);


export default router;
