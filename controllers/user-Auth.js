const { userModel, validateUser } = require("../models/user");
const generateToken = require("../utils/generate-token");
const bcrypt = require("bcrypt");
const hashPassword = require("../utils/hash-password");


// Initialize Passport
require("../config/google-auth");

const signUp =  async (req, res) => {
  const { email, name, phone, password } = req.body;

  const { error } = validateUser({ name, email, phone, password });

  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/auth/signup");
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already exists. Please use a different email.");
      return res.redirect("/auth/signup");
    }
    const hashedPassword = hashPassword(password);
    const user = new userModel({ name, email, phone, password : hashedPassword });
    await user.save();

    const token = generateToken({ id: user.id, email: user.email });
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect('/')
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again later.");
    res.redirect("/auth/");
  }
};



const login =  async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid Email or Password!");
     return  res.redirect("/auth/login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid Email or Password!");
      return res.redirect("/auth/login");
    }
    const token = generateToken({ id: user.id, email: user.email });
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect('/')
  } catch (error) {
    res.status(401).json("Something went wrong. Please try again");
  }
};


// Callback route
const googleSignUp =  (req, res) => {
    try {
      const { user, token } = req.user; // Extract user and token
      res.cookie("token", token, { httpOnly: true, secure: true });
      res.redirect('/')
    } catch (error) {
      res.status(404).json(error);
    }
  }


module.exports = {signUp , login,googleSignUp}