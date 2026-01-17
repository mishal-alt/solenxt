const Product = require("../models/products");
const asyncHandler = require("../middleware/asyncHandler");


const getProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: "i",
            },
        }
        : {};

    const products = await Product.find({ ...keyword });


    const formattedProducts = products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        image: p.image,
        cat: p.cat,
        premium: p.premium,
        stoke: p.stoke,
    }));

    res.json(formattedProducts);
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

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
