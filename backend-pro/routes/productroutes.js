import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStats
} from "../controllers/productcontroller.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { productSchema, updateProductSchema } from "../validation/productValidation.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET /products/stats
router.get("/stats", protect, admin, getProductStats);

// GET /products
router.get("/", getProducts);

// POST /products (Create)
router.post("/", protect, admin, upload.single("image"), (req, res, next) => {
    // If a file was uploaded, we set the image field in req.body so validation passes
    if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
    }
    next();
}, validate(productSchema), createProduct);

// GET /products/:id
router.get("/:id", getProductById);

// PATCH /products/:id (Update)
router.patch("/:id", protect, admin, upload.single("image"), (req, res, next) => {
    if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
    }
    next();
}, validate(updateProductSchema), updateProduct);

// DELETE /products/:id (Delete)
router.delete("/:id", protect, admin, deleteProduct);


export default router;
