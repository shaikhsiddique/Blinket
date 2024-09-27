const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Category Schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        unique: true // Enforce unique constraint on the 'name' field
    },
    products: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose Model
const categoryModel = mongoose.model("Category", categorySchema);

// Joi Validation Schema
const validateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
    });

    return schema.validate(category);
};

// Export the validation function and model
module.exports = {
    categoryModel,
    validateCategory
};
