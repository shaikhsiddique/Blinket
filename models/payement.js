const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Payment Schema
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    method: {
        type: String,
        required: true,
        
    },
    status: {
        type: String,
        required: true,
        
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose Model
const paymentModel = mongoose.model("Payment", paymentSchema);

// Joi Validation Schema
const validatePayment = (payment) => {
    const schema = Joi.object({
        order: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        method: Joi.string().required(),
        status: Joi.string().required(),
        transactionId: Joi.string().required()
    });

    return schema.validate(payment);
};

// Export the validation function and model
module.exports = {
    paymentModel,
    validatePayment
};
