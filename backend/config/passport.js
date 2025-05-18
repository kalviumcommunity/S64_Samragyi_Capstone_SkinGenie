const User = require('../models/user'); // Adjust path if needed
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by Google ID or email
        let user = await User.findOne({ $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]});

        if (!user) {
          // Create new user if not found
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: undefined, // No password for Google users
          });
        } else if (!user.googleId) {
          // If user exists but doesn't have googleId, update it
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user for session support
passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

// In passport.js
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Only check by _id, not googleId
    done(null, user || null);
  } catch (error) {
    done(error, null);
  }
});



module.exports = passport;
