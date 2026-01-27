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
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const filter = req.query.filter; // "all", "blocked", "admin"

    const query = {};

    if (req.query.keyword) {
        query.$or = [
            { fullName: { $regex: req.query.keyword, $options: "i" } },
            { email: { $regex: req.query.keyword, $options: "i" } },
        ];
    }

    if (filter === "blocked") {
        query.isBlock = true;
    } else if (filter === "admin") {
        query.isAdmin = true;
    }

    const count = await User.countDocuments(query);
    const users = await User.find(query)
        .sort({ joinDate: -1 }) // Default sort by join date
        .limit(pageSize)
        .skip(pageSize * (page - 1));

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

    res.json({ users: formattedUsers, page, pages: Math.ceil(count / pageSize), total: count });
});

const getUserStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ isAdmin: true });
    const blocked = await User.countDocuments({ isBlock: true });
    const activeUsers = totalUsers - blocked;

    res.json({
        totalUsers,
        admins,
        blocked,
        activeUsers,
    });
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

const getAllOrders = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const statusFilter = req.query.status;
    const keyword = req.query.keyword;

    let aggregateQuery = [
        { $unwind: "$orders" },
        {
            $project: {
                orderId: "$orders.id",
                customer: "$fullName",
                userId: "$_id",
                total: "$orders.total",
                status: "$orders.status",
                date: "$orders.date",
                items: "$orders.items",
            }
        }
    ];

    if (statusFilter && statusFilter !== "all") {
        const statusRegex = new RegExp(`^${statusFilter}$`, 'i');
        aggregateQuery.push({ $match: { status: statusRegex } });
    }

    if (keyword) {
        aggregateQuery.push({
            $match: {
                $or: [
                    { customer: { $regex: keyword, $options: "i" } },
                    { orderId: { $regex: keyword, $options: "i" } }
                ]
            }
        });
    }

    aggregateQuery.push({ $sort: { date: -1 } });

    const totalCountResults = await User.aggregate([...aggregateQuery, { $count: "total" }]);
    const totalCount = totalCountResults.length > 0 ? totalCountResults[0].total : 0;

    aggregateQuery.push({ $skip: pageSize * (page - 1) });
    aggregateQuery.push({ $limit: pageSize });

    const orders = await User.aggregate(aggregateQuery);

    res.json({
        orders,
        page,
        pages: Math.ceil(totalCount / pageSize),
        total: totalCount
    });
});

const getOrderStats = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("orders");
    let totalOrders = 0;
    let totalRevenue = 0;
    let shippedOrders = 0;

    users.forEach((user) => {
        if (user.orders) {
            totalOrders += user.orders.length;
            user.orders.forEach((order) => {
                totalRevenue += (order.total || 0);
                if (order.status?.toLowerCase() === "shipped") {
                    shippedOrders++;
                }
            });
        }
    });

    res.json({
        totalOrders,
        totalRevenue,
        shippedOrders,
    });
});

export {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    deleteUser,
    getUserStats,
    getAllOrders,
    getOrderStats,
};
