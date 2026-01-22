import Joi from "joi";

const productSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least 3 characters",
    }),
    price: Joi.number().positive().required().messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be positive",
        "any.required": "Price is required",
    }),
    image: Joi.string().required().messages({
        "string.empty": "Image URL is required",
    }),
    cat: Joi.string().required().messages({
        "string.empty": "Category is required",
    }),
    stoke: Joi.number().integer().min(0).required().messages({
        "number.base": "Stock must be a number",
        "number.min": "Stock cannot be negative",
    }),
    premium: Joi.boolean(),
});

const updateProductSchema = Joi.object({
    name: Joi.string().min(3),
    price: Joi.number().positive(),
    image: Joi.string(),
    cat: Joi.string(),
    stoke: Joi.number().integer().min(0),
    premium: Joi.boolean(),
}).min(1);

export { productSchema, updateProductSchema };
