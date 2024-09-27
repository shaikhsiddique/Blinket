
const {productModel} = require('../models/product');
const {categoryModel} = require('../models/category');

const adminProduct = async (req, res) => {
    try {
        const products = await productModel.find();

        // Group products by category (or any other key)
        const groupedProducts = products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized'; // Adjust the key if needed
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        res.render("admin_products.ejs", { products: groupedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};
  
const dashboard = async (req, res) => {
  try {
   
    const prodcount = await productModel.countDocuments();
    const categcount = await categoryModel.countDocuments();

    const messages = req.flash();
    res.render("admin_dashboard", { prodcount, categcount,messages});
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { adminProduct,dashboard};