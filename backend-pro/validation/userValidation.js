import Joi from "joi";

const registerSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name cannot exceed 50 characters",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
    }),
    isAdmin: Joi.boolean(),
    isBlock: Joi.boolean(),
});

const updateUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    isAdmin: Joi.boolean(),
    isBlock: Joi.boolean(),
}).min(1);

const orderSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            id: Joi.any(),
            _id: Joi.any(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().integer().min(1).required(),
        }).unknown(true)
    ).min(1).required(),
    total: Joi.number().required(),
    paymentMethod: Joi.string().required(),
    billingInfo: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().allow("", null),
        country: Joi.string().allow("", null),
    }).required(),
});



export { registerSchema, updateUserSchema, orderSchema };
