const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Admin Schema
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/, // Simple email validation regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15,
        match: /^[0-9]+$/ // Validates that the phone number contains only digits
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'], // Example roles
        default: 'admin',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }],
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose Model
const adminModel = mongoose.model("Admin", adminSchema);

// Joi Validation Schema
const validateAdmin = (admin) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        address: Joi.string().required(),
        phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
        role: Joi.string().valid('admin', 'superadmin').required(),
        products: Joi.array(),
    });

    return schema.validate(admin);
};

// Export the validation function and model
module.exports = {
    adminModel,
    validateAdmin
};
