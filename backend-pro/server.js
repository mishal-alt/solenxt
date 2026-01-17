const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db');
const productRoutes = require("./routes/productroutes");
const userRoutes = require("./routes/userroutes");
const authRoutes = require("./routes/authroutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");
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
