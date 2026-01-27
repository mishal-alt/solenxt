import Product from "../models/products.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { cat: { $regex: req.query.keyword, $options: "i" } },
            ],
        }
        : {};

    const category = req.query.category && req.query.category !== 'all'
        ? req.query.category === 'premium'
            ? { premium: true }
            : { cat: req.query.category }
        : {};

    const sort = {};
    if (req.query.sort === "lowToHigh") {
        sort.price = 1;
    } else if (req.query.sort === "highToLow") {
        sort.price = -1;
    }

    const count = await Product.countDocuments({ ...keyword, ...category });
    const products = await Product.find({ ...keyword, ...category })
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    const formattedProducts = products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        image: p.image,
        cat: p.cat,
        premium: p.premium,
        stoke: p.stoke,
    }));

    res.json({ products: formattedProducts, page, pages: Math.ceil(count / pageSize), total: count });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        cat: product.cat,
        premium: product.premium,
        stoke: product.stoke,
    });
});

const updateProduct = asyncHandler(async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    if (!updatedProduct) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json(updatedProduct);
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, price, image, cat, stoke, premium } = req.body;
    const product = new Product({
        name,
        price,
        image,
        cat,
        stoke,
        premium: premium || false,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

const getProductStats = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.stoke === 0).length;
    const categories = [...new Set(products.map((p) => p.cat))].length;
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stoke || 0), 0);

    res.json({
        totalProducts,
        outOfStock,
        categories,
        totalValue,
    });
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductStats };
