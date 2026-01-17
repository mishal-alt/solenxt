const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productcontroller");
const { protect, admin } = require("../middleware/authMiddleware");

// GET /products
router.get("/", getProducts);

// POST /products (Create)
router.post("/", protect, admin, createProduct);

// GET /products/:id
router.get("/:id", getProductById);

// PATCH /products/:id (Update)
router.patch("/:id", protect, admin, updateProduct);

// DELETE /products/:id (Delete)
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;

