const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Order Schema
const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            min: 1,
            required: true
        }
    }],
    totalprice: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered"],
        default: "pending"
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose Model
const orderModel = mongoose.model("Order", orderSchema);

// Joi Validation Schema
const validateOrder = (order) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).required(),
        totalprice: Joi.number().min(0).required(),
        address: Joi.string().required(),
        status: Joi.string().valid("pending", "processing", "shipped", "delivered"),
        payment: Joi.string().required(),
        delivery: Joi.string().required()
    });

    return schema.validate(order);
};

// Export the validation function and model
module.exports = {
    orderModel,
    validateOrder
};
