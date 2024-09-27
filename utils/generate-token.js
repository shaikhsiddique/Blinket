const jwt = require('jsonwebtoken');

const generateToken = (data) => {
    try {
        // Define token options
        const options = {
            expiresIn: '1h' // Token expiration time, e.g., 1 hour
        };

        // Generate JWT
        const token = jwt.sign(data, process.env.JWT_SECRET, options);
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
};

module.exports = generateToken;
