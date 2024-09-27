const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Address Schema
const addressSchema = mongoose.Schema({
    city: String,
    state: String,
    zip: Number,
    address: String,
});

// Mongoose User Schema
const userSchema = mongoose.Schema({
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
    },
    phone: {
        type: Number,
        // not required
    },
    addresses: [addressSchema],
}, {
    timestamps: true
});

// Mongoose Model
const userModel = mongoose.model('User', userSchema);

// Joi Validation Schema
const validateUser = (user) => {
    const addressSchema = Joi.object({
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.number(),
        address: Joi.string()
    });

    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string(),
        phone: Joi.number(),
        addresses: Joi.array().items(addressSchema)
    });

    return schema.validate(user);
};

// Export the validation function and model
module.exports = {
    userModel,
    validateUser
};
