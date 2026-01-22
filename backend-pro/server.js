import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

app.use(cors())
app.use(express.json())

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use("/products", productRoutes);
console.log("Product Routes Registered");
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
console.log("Admin Routes Registered at /admin");

// Error Handler Middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('backend + mongoDB is Running')
})

const port = process.env.PORT || process.env.port || 5000;

app.listen(port, () => {
    console.log(`server is runnig on ${port}`)
})
