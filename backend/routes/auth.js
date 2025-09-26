const express = require('express');
const passport = require('passport');
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  generateTokens, 
  changePassword,
} = require('../controllers/authController.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/change-password', authenticateToken, changePassword);


// Protected routes
router.post('/logout', authenticateToken, logoutUser);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    const user = req.user;
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.json({
      message: 'Logged in with Google!',
      user: { id: user._id, name: user.name, email: user.email, age: user.age },
      accessToken,
      refreshToken,
    });
  }
);

module.exports = router;
