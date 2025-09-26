const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Use correct casing

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // Create user if not exists
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
                googleId: profile.id, 
            age: 18, // Default (or change as needed)
            // No password since using OAuth
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  ));

  passport.serializeUser((user, done) => { done(null, user.id); });
  passport.deserializeUser((id, done) => {
User.findById(id)
  .then(user => done(null, user))
  .catch(err => done(err));
  });
};
