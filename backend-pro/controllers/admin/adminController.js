import User from "../../models/user.js";
import Product from "../../models/products.js";
import asyncHandler from "../../middleware/asyncHandler.js";


const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Users
    const usersCount = await User.countDocuments();

    // 2. Total Products
    const productsCount = await Product.countDocuments();

    // 3. Total Sales & Total Orders
    // Aggregate all orders from all users
    const users = await User.find({}).select("orders");
    let totalSales = 0;
    let totalOrders = 0;

    users.forEach((user) => {
        if (user.orders) {
            totalOrders += user.orders.length;
            user.orders.forEach((order) => {
                totalSales += order.total || 0;
            });
        }
    });

    res.json({
        usersCount,
        productsCount,
        totalSales,
        totalOrders,
    });
});


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});

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


const toggleBlockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isBlock = !user.isBlock;
        const updatedUser = await user.save();
        res.json({
            message: `User ${updatedUser.isBlock ? "blocked" : "unblocked"}`,
            isBlock: updatedUser.isBlock,
            id: updatedUser._id // Send back ID and status
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});



const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user");
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    deleteUser,
};
