const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user');
const { adminModel } = require('../models/admin');

const isUserLoggedIn = async  (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if(!user){
        req.flash("error", "Token Expried Login Again");
        return res.redirect('/auth/login');
      }
      req.user = decoded;
      next();
    } catch (error) {
      req.flash("error", "Token Expried Login Again");
      return res.redirect('/auth/login');
    }
  } else {
    return res.redirect('/auth/login');
  }
};

const isAdminLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await adminModel.findById(decoded.id);
      if(! admin){
        req.flash("error", "Token Expried Login Again");
        return res.redirect('/admin/login');
      }
      req.user = decoded;
      next();
    } catch (error) {
      req.flash("error", "Token Expried Login Again");
      return res.redirect('/admin/login');
    }
  } else {
    return res.redirect('/admin/login');
  }
};

module.exports = {isUserLoggedIn,isAdminLoggedIn};