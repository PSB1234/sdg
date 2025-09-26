const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
  return { accessToken, refreshToken };
};

const getDeviceInfo = (req) => ({
  userAgent: req.get('User-Agent'),
  ip: req.ip || req.connection.remoteAddress
});

const registerUser = async (req, res) => {
  const { name, email, age, password, roleNames } = req.body;
  
  try {
    // Validate required fields
    if (!name || !email || !age || !password) {
      return res.status(400).json({ 
        message: 'Name, email, age, and password are required' 
      });
    }
    if (!roleNames || !Array.isArray(roleNames) || roleNames.length === 0) {
      return res.status(400).json({ 
        message: 'roleNames is required and must be a non-empty array' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Create user with roles directly from roleNames
    const user = new User({ 
      name, 
      email, 
      age, 
      password,
      roles: roleNames.map(r => r.toUpperCase()) // Convert to uppercase
    });
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    const deviceInfo = getDeviceInfo(req);

    // Save refresh token
    user.refreshTokens.push({ 
      token: refreshToken,
      deviceInfo
    });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        roles: user.roles,
        isEmailVerified: user.isEmailVerified
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account is locked due to multiple failed login attempts. Try again later.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated' 
      });
    }

    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      await user.incLoginAttempts();
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    const deviceInfo = getDeviceInfo(req);

    // Clean up old refresh tokens (keep only last 5)
    if (user.refreshTokens.length >= 5) {
      user.refreshTokens = user.refreshTokens.slice(-4);
    }

    user.refreshTokens.push({ 
      token: refreshToken,
      deviceInfo
    });
    await user.save();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        roles: user.roles,
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      message: 'Refresh token required' 
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: 'Invalid refresh token' 
      });
    }
    
    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(tokenObj => 
      tokenObj.token === refreshToken
    );
    
    if (!tokenExists) {
      return res.status(401).json({ 
        message: 'Refresh token not found' 
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_ACCESS_SECRET, 
      { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Refresh token expired' 
      });
    }
    res.status(403).json({ 
      message: 'Invalid refresh token' 
    });
  }
};

const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (user && refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(
        tokenObj => tokenObj.token !== refreshToken
      );
      await user.save();
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Server error during logout' 
    });
  }
};

const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshTokens = [];
      await user.save();
    }
    
    res.json({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ 
      message: 'Server error during logout' 
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    console.log('req.user in getUserProfile:', req.user); // Debug log
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required: No user found in request',
        error: 'NOT_AUTHENTICATED'
      });
    }
    const user = await User.findById(req.user._id)
      .select('-password -refreshTokens');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const permissions = await user.getAllPermissions();
    
    res.json({ 
      user: {
        ...user.toObject(),
        permissions
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    
    // Remove sensitive fields
    delete updates.password;
    delete updates.roles;
    delete updates.refreshTokens;
    delete updates.googleId;
    delete updates.isActive;
    delete updates.loginAttempts;
    delete updates.lockUntil;

    // Validate email if provided
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: "Email already in use by another user" 
        });
      }
      
      // Reset email verification if email is changed
      updates.isEmailVerified = false;
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      updates, 
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: "Server error updating profile" 
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Both current and new passwords are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters long" 
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        message: "Current password is incorrect" 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Invalidate all refresh tokens
    user.refreshTokens = [];
    await user.save();

    res.json({ 
      message: "Password changed successfully. Please login again." 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: "Server error while changing password" 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  getUserProfile,
  updateUserProfile,
  changePassword,
  generateTokens
};