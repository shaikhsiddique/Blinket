const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Product Schema
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    price: {
        type: String, // Consider changing this to Number for better handling of prices
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
        required: true 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose Model
const productModel = mongoose.model("Product", productSchema);

// Joi Validation Schema
const validateProduct = (product) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        price: Joi.string().required(), // You can change this to Joi.number().positive().required() if you switch to numeric prices
        category: Joi.string().required(),
        stock: Joi.number().min(0).required(),
        description: Joi.string().required(),
        image: Joi.any().required() 
    });

    return schema.validate(product);
};

// Export the validation function and model
module.exports = {
    productModel,
    validateProduct
};
