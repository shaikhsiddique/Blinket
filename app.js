const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

const db = require('./config/mongoose');
const indexRouter = require('./routes/index');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

// Passport configuration
require('./config/google-auth'); 

const app = express();

// Set up session and flash
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin',adminRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
