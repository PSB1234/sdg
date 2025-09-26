const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  const { name, email, age, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({ name, email, age, password });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token in DB
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Clean expired refresh tokens (optional)

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });

    res.json({ accessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (user && refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
};

const getUserProfile = async (req, res) => {
  res.json({ user: req.user });
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const { name, email, age } = req.body;

    // Validate inputs (simple example)
    if (name && name.length > 50) {
      return res.status(400).json({ message: "Name cannot exceed 50 characters" });
    }
    if (age && (age < 1 || age > 120)) {
      return res.status(400).json({ message: "Age must be between 1 and 120" });
    }
    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    // Check if new email is already in use by someone else
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already in use by another user" });
      }
    }

    // Find user and update fields
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();  // The pre-save hook will hash it

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  generateTokens,
  changePassword,
};
