const express = require('express');
const { cartModel } = require('../models/cart');
const { isUserLoggedIn } = require('../middleware/isLoggedIn');
const { productModel } = require('../models/product');
const router = express.Router();

// Get the cart for the logged-in user
router.get('/', isUserLoggedIn, async (req, res) => {
    const user = req.user.id;
    try {
        const cart = await cartModel.findOne({ user }).populate('products.product');
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        res.render('cart.ejs', { cart, messages: req.flash() });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Add a product to the cart
router.get('/add/:id', isUserLoggedIn, async (req, res) => {
    try {
        const user = req.user.id;
    const product = await productModel.findById(req.params.id);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    let cart = await cartModel.findOne({ user });

    if (cart) {
        // Check if the product is already in the cart
        const existingProduct = cart.products.find(p => p.product.toString() === product._id.toString());
        if (existingProduct) {
            // If the product exists, increase the count
            existingProduct.count += 1;
        } else {
            // Otherwise, add the product with count 1
            cart.products.push({ product: product._id, count: 1 });
        }
        cart.totalprice += parseInt(product.price);
        await cart.save();
    } else {
        // Create a new cart with the product
        cart = await cartModel.create({
            user,
            products: [{ product: product._id, count: 1 }],
            totalprice: product.price
        });
    }
    const referer = req.get('referer') || '/cart'
    res.redirect(referer);
    } catch (error) {
        const referer = req.get('referer') || '/cart'
        res.redirect(referer);
    }
});

// Remove a product from the cart
router.get('/remove/:id', isUserLoggedIn, async (req, res) => {
    try {
        const user = req.user.id;
        const productId = req.params.id;

        // Find the product to ensure it exists and get the price
        const product = await productModel.findById(productId);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect('/cart');
        }

        // Find the cart for the user
        const cart = await cartModel.findOne({ user });

        if (cart) {
            const productInCart = cart.products.find(p => p.product.toString() === productId);
            if (!productInCart) {
                req.flash("error", "Product not found in cart");
                return res.redirect('/cart');
            }

            // Decrease the count or remove the product entirely if count is 1
            if (productInCart.count > 1) {
                productInCart.count -= 1;
                cart.totalprice -= product.price;
            } else {
                cart.products = cart.products.filter(p => p.product.toString() !== productId);
                cart.totalprice -= product.price;
            }

            await cart.save();
        } else {
            req.flash("error", "Cart not found");
        }

        res.redirect('/cart');
    } catch (error) {
        req.flash("error", error.message || "An unexpected error occurred");
        res.redirect('/cart');
    }
});

module.exports = router;
