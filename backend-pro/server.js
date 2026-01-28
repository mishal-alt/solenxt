import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import productRoutes from "./routes/productroutes.js";
import userRoutes from "./routes/userroutes.js";
import authRoutes from "./routes/authroutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Connect to Database (Awaiting to ensure it's connected before anything else)
try {
    await connectDB();

    const app = express();

    // Middleware
    app.use(cors({
        origin: ["https://solenxt.vercel.app", "http://localhost:5173", "http://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logger
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // Root / Health Check
    app.get('/', (req, res) => {
        res.send('Solenxt API running');
    });

    // API Routes
    const apiRouter = express.Router();

    apiRouter.use("/products", productRoutes);
    apiRouter.use("/users", userRoutes);
    apiRouter.use("/auth", authRoutes);
    apiRouter.use("/admin", adminRoutes);

    app.use("/api", apiRouter);

    // Static files
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

    // Specific 404 for API routes
    apiRouter.use((req, res) => {
        res.status(404).json({
            message: `API Route ${req.originalUrl} not found. Available endpoints are /products, /users, /auth, /admin under /api`
        });
    });

    // Error Handler Middleware
    app.use(errorHandler);

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });

} catch (err) {
    console.error(`❌ Critical Server Error: ${err.message}`);
    process.exit(1);
}
