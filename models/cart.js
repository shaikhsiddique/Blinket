const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Cart Schema
const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        count: {
            type: Number,
            required: true, 
            min: 1 
        }
    }],
    totalprice: {
        type: Number,
        required: true,
        min: 0 
    }
}, {
    timestamps: true 
});

// Mongoose Model
const cartModel = mongoose.model("Cart", cartSchema);

// Joi Validation Schema
const validateCart = (cart) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string()).required(),
        totalprice: Joi.number().min(0).required()
    });

    return schema.validate(cart);
};

// Export the validation function and model
module.exports = {
    cartModel,
    validateCart
};
