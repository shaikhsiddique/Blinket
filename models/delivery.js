const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Delivery Schema
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    deliverBoy: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-transit", "delivered"],
        default: "pending",
        required: true
    },
    trackingUrl: {
        type: String,
        required: true
    },
    totalPrice: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose Model
const deliveryModel = mongoose.model("Delivery", deliverySchema);

// Joi Validation Schema
const validateDelivery = (delivery) => {
    const schema = Joi.object({
        order: Joi.string().required(),
        deliverBoy: Joi.string().required(),
        deliveryTime: Joi.string().required(),
        status: Joi.string().valid("pending", "in-transit", "delivered").required(),
        trackingUrl: Joi.string().uri(),
        totalPrice: Joi.string().required()
    });

    return schema.validate(delivery);
};

// Export the validation function and model
module.exports = {
    deliveryModel,
    validateDelivery
};
