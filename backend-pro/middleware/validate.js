const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        res.status(400);
        throw new Error(errorMessages.join(", "));
    }
    next();
};

export default validate;
