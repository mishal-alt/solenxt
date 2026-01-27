import express from "express";
import {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    deleteUser,
    getUserStats,
    getAllOrders,
    getOrderStats,
} from "../controllers/admin/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected and require admin privileges
router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardStats);
router.get("/users/stats", getUserStats);
router.get("/users", getAllUsers);
router.get("/orders/stats", getOrderStats);
router.get("/orders", getAllOrders);
router.patch("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

export default router;