// routes/auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

const {signUp , login,googleSignUp} = require('../controllers/user-Auth');

// Initialize Passport
require("../config/google-auth");

router.get("/", (req, res) => {
  res.render("user_signup", { messages: req.flash() });
});

router.post("/signup", async (req, res) => {
 signUp(req, res);
});

router.get("/login", (req, res) => {
  res.render("user_login", { messages: req.flash() });
});

router.post("/login", async (req, res) => {
  login(req,res);
});

// Route to start Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // Disable session
  (req, res) => {
    googleSignUp(req,res);
  }
);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/auth/login");
});

module.exports = router;
