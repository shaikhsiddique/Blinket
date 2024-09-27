const express = require('express');
const { productModel } = require('../models/product');
const { isUserLoggedIn } = require('../middleware/isLoggedIn');
const { cartModel } = require('../models/cart');
const { categoryModel } = require('../models/category');
const router = express.Router();


router.get("/", isUserLoggedIn, async (req, res) => {
    try {
        const products = await productModel.find();
        if (!products) {
            throw new Error('No products found');
        }

        const userid = req.user && req.user.id;
        if (!userid) {
            throw new Error('User ID not found');
        }

        const cart = await cartModel.findOne({ user: userid });
        const somethingInCart = cart && Array.isArray(cart.products) && cart.products.length > 0
            ? cart.products
            : false;

        const cartCount = cart && Array.isArray(cart.products)
            ? cart.products.length
            : 0;

        const rnproducts = await productModel.aggregate([{ $sample: { size: 3 } }]);
        if (!rnproducts) {
            throw new Error('Error fetching random products');
        }

        const groupedProducts = products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        res.render("index.ejs", {
            rnproducts,
            products: groupedProducts,
            somethingInCart,
            cartCount
        });
    } catch (error) {
        console.error('Error in GET / route:', error.message || error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/all-products',isUserLoggedIn, async (req,res)=>{
    try {
        const products = await productModel.find();
        const cart = await cartModel.findOne({user:userid});
        let somethingInCart = !cart.products.length ? false :  cart.products
        let cartCount = !cart ? 0 : cart.products.length
        res.render('products.ejs',{products,somethingInCart,cartCount});
    } catch (error) {
        res.redirect('/');
    }
});

router.get('/category/:category',isUserLoggedIn,async (req,res)=>{
 try {
    const category = await categoryModel.find({name: req.params.category}).populate("products");

    let somethingInCart = !cart.products.length ? false :  cart.products
    let cartCount = !cart ? 0 : cart.products.length
    res.render('products.ejs',{products: category[0].products,somethingInCart,cartCount});
 } catch (error) {
    res.redirect('/');
 }
});

module.exports= router