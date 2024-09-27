const router = require("express").Router();
require("dotenv").config();

const {isAdminLoggedIn} = require("../middleware/isLoggedIn");
const {signUp,login}= require('../controllers/admin-Auth');
const { adminProduct,dashboard} = require('../controllers/admin-pages');

if (process.env.NODE_ENV == "development") {
    router.post("/create", async (req, res) => {
    signUp(req,res);
    })
  }

  router.get('/login',(req,res)=>{
    res.render('admin_login.ejs',{ messages: req.flash() });
  })

  router.post("/login", async (req, res) => {
    login(req,res);
  });  
  

  router.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect('/admin/login');
  })
  
  router.get('/',isAdminLoggedIn, async (req, res) => {
    adminProduct(req,res);
  });
  
router.get("/dashboard",isAdminLoggedIn , async (req, res) => {
  dashboard(req,res);
});

module.exports = router;
