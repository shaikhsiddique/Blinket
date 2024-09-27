const bcrypt = require('bcrypt');
const { adminModel, validateAdmin } = require("../models/admin");
const generateToken = require("../utils/generate-token");
const hashPassword = require("../utils/hash-password");





   const signUp = async (req, res) => {
      try {
        const { name, email, password, address, phone, role } = req.body;
        
        // Validate the admin input data
        const { error } = validateAdmin({ name, email, password, address, phone, role });
        if (error) {
          return res.status(400).send(error.details[0].message);
        }
        
        // Check if a user with the same email already exists
        let user = await adminModel.findOne({ email });
        if (user) return res.status(400).send("Email already exists");
        
        // Hash the password
        const hashedPassword = await hashPassword(password);
        
        // Create the new admin
        let admin = await adminModel.create({
          name,
          email,
          password: hashedPassword,
          address,
          phone,
          role,
        });
        
        // Generate a token and set it in the cookie
        const token = generateToken({ id: admin._id, email: admin.email });
        res.cookie("token", token, { httpOnly: true, secure: true });
        
        // Send a success response
        res.redirect('/admin');
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
   }


 const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await adminModel.findOne({ email });
      if (!user) {
        req.flash("error", "Invalid Email or Password!");
       return  res.redirect("/admin/login");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash("error", "Invalid Email or Password!");
        return res.redirect("/admin/login");
      }
      const token = generateToken({ id: user.id, email: user.email });
      res.cookie("token", token, { httpOnly: true, secure: true });
      res.redirect('/admin');
    } catch (error) {
      req.flash("error","Something went wrong. Please try again"+error );
      res.redirect('/admin/login');
    }
 } 
  

 module.exports = {signUp,login};
  