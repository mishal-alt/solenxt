import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productcontroller.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { productSchema, updateProductSchema } from "../validation/productValidation.js";

const router = express.Router();

// GET /products
router.get("/", getProducts);

// POST /products (Create)
router.post("/", protect, admin, validate(productSchema), createProduct);

// GET /products/:id
router.get("/:id", getProductById);

// PATCH /products/:id (Update)
router.patch("/:id", protect, admin, validate(updateProductSchema), updateProduct);

// DELETE /products/:id (Delete)
router.delete("/:id", protect, admin, deleteProduct);


export default router;
