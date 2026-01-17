const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    deleteUser,
} = require("../controllers/admin/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All routes here are protected and require admin privileges
router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
