const express = require('express');
const router = express();
const { upload, processImage } = require('../utils/upload-multer');
const {productModel,validateProduct}= require('../models/product');
const {categoryModel,validateCategory} = require('../models/category');
const { isAdminLoggedIn } = require('../middleware/isLoggedIn');


router.get('/search',(req,res)=>{

})

router.post('/',isAdminLoggedIn, upload.single('image'), processImage, async (req, res) => {
    try {
    const { name, price, category, description, stock } = req.body;
    const imageBuffer = req.file.buffer;
  
    const { error } = validateProduct({ name, price, category, description, stock, image: imageBuffer });
    if (error) {
      req.flash("error", error.details[0].message);
      return res.redirect("/admin/dashboard");
    }
  
    const product = await productModel.create({
      name,
      price,
      category,
      description,
      stock,
      image: imageBuffer,
    });
  
    let Category = await categoryModel.findOne({ name: category });
    if (Category) {
      Category.products.push(product._id);
      await Category.save();
    } else {
      Category = await categoryModel.create({
        name: category,
        products: [product._id],
      });
      await Category.save();
    }
  
    res.redirect('/admin/');
    } catch (error) {
      req.flash("error", error.message);  
      return res.redirect("/admin/dashboard");
    }
  });


 router.get('/update/:id',isAdminLoggedIn, async (req,res)=>{
   try {
    const product = await productModel.findById(req.params.id);
    res.render("update_products.ejs",{messages:req.flash(),product});
   } catch (error) {
    res.status(404).json(error.message);
   }
 });

 router.post('/update/:id',isAdminLoggedIn, upload.single('image'), processImage, async (req, res) => {
  try {
    const id = req.params.id;  
    const { name, price, category, description, stock } = req.body;
    
    const imageBuffer = req.file ? req.file.buffer : await productModel.findById(id).image;
   
    const { error } = validateProduct({ name, price, category, description, stock, image: imageBuffer });
    
    if (error) {
      req.flash("error", error.details[0].message);
      return res.redirect(`/product/update/${id}`);
    }

    // Update the product in the database

    
    const product = await productModel.findByIdAndUpdate(
      id,  
      {
        name,
        price,
        category,
        description,
        stock,
        image: imageBuffer,
      },
      { new: true } 
    );

    // Redirect to the products page
    res.redirect('/admin/');
  } catch (error) {
    req.flash("error", error.message);  
    return res.redirect(`/product/update/${req.params.id}`);  
  }
 });

 router.get('/delete/:id',async (req,res)=>{
  try {
    const id = req.params.id;
    const product = await productModel.findByIdAndDelete(id);
    req.flash("success", "Product deleted successfully");
    res.redirect('/admin/');
  } catch (error) {
    req.flash("error", error.message);
    res.redirect('/admin/');
  }
 })

 router.post('/delete',async (req,res)=>{
  try {
    let {id} = req.body;
    const product = await productModel.findByIdAndDelete(id);
    if(!product){
      req.flash("error", "Product not found");
      return res.redirect('/admin/dashboard');
    }
    res.redirect('/admin/');
  } catch (error) {
    req.flash("success", "Product deleted successfully");
    res.redirect('/admin/dashboard');
  }

 })




module.exports = router;