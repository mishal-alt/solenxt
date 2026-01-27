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

dotenv.config();
const app = express();

console.error = console.log;

connectDB();

// CORS configuration
app.use(cors({
    origin: ["https://project-solenxt.vercel.app", "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// API Routes
const apiRouter = express.Router();

apiRouter.use("/products", productRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/admin", adminRoutes);

app.use("/api", apiRouter);

// Specific 404 for API routes
app.use("/api/*", (req, res) => {
    res.status(404).json({
        message: `API Route ${req.originalUrl} not found. Available endpoints are /products, /users, /auth, /admin under /api`
    });
});

console.log("API Routes Consolidated at /api");

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Handler Middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('backend + mongoDB is Running')
})

const port = process.env.PORT || process.env.port || 5000;

app.listen(port, () => {
    console.log(`server is runnig on ${port}`)
})
