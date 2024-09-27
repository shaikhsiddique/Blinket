const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { userModel } = require('../models/user'); 
const generateToken = require('../utils/generate-token');

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  async function (request, accessToken, refreshToken, profile, done) {
    try {
      // Check if user already exists
      let user = await userModel.findOne({ email: profile.email });

      if (!user) {
        // Create a new user if one does not exist
        user = new userModel({
          name: profile.displayName,
          email: profile.email,
          password: '', // Not used with Google auth
          phone: '',
          addresses: []
        });
        await user.save();
      }
      
      // Generate JWT token
      const token = generateToken({ id: user.id, email: user.email });

      // Pass user and token to the frontend
      return done(null, { user, token });
    } catch (error) {
      console.error(error);
      return done(error, null);
    }
  }
));
