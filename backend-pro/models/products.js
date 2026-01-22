import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    cat: { type: String, required: true },
    stoke: { type: Number, required: true, default: 0 },
    premium: { type: Boolean, default: false },
}, {
    timestamps: true,
});

export default mongoose.model("Product", productSchema);
