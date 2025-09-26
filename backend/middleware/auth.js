const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  console.log('Entering authenticateToken middleware'); // Debug log
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader); // Debug log
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ 
      message: 'Access token required',
      error: 'MISSING_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('Decoded JWT:', decoded); // Debug log
    const user = await User.findById(decoded.userId)
      .select('-password -refreshTokens');
    
    if (!user) {
      console.log('User not found for userId:', decoded.userId);
      return res.status(401).json({ 
        message: 'Invalid token: user not found',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      console.log('User is inactive:', user.email);
      return res.status(401).json({ 
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    if (user.isLocked) {
      console.log('User is locked:', user.email);
      return res.status(401).json({ 
        message: 'Account is locked due to multiple failed login attempts',
        error: 'ACCOUNT_LOCKED'
      });
    }

    req.user = user;
    console.log('req.user set:', user); // Debug log
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Debug log
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired');
      return res.status(401).json({ 
        message: 'Access token expired',
        error: 'TOKEN_EXPIRED'
      });
    }
    console.log('Invalid token');
    return res.status(403).json({ 
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    });
  }
};

const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        console.log('No user in req for role check');
        return res.status(401).json({ 
          message: 'Authentication required',
          error: 'NOT_AUTHENTICATED'
        });
      }

      const hasRole = await req.user.hasRole(roles);
      
      if (!hasRole) {
        console.log('User lacks required roles:', roles);
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${roles.join(', ')}`,
          error: 'INSUFFICIENT_ROLE'
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ 
        message: 'Error checking user roles',
        error: 'ROLE_CHECK_ERROR'
      });
    }
  };
};

const requirePermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        console.log('No user in req for permission check');
        return res.status(401).json({ 
          message: 'Authentication required',
          error: 'NOT_AUTHENTICATED'
        });
      }

      const hasSuperAdminRole = await req.user.hasRole(['SUPERADMIN']);
      if (hasSuperAdminRole) {
        return next();
      }

      const userPermissions = await req.user.getAllPermissions();
      const hasPermission = permissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        console.log('User lacks required permissions:', permissions);
        return res.status(403).json({ 
          message: `Access denied. Required permissions: ${permissions.join(', ')}`,
          error: 'INSUFFICIENT_PERMISSION'
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ 
        message: 'Error checking user permissions',
        error: 'PERMISSION_CHECK_ERROR'
      });
    }
  };
};

const requireOwnershipOrRole = (resourceIdField = 'id', allowedRoles = ['ADMIN', 'SUPERADMIN']) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        console.log('No user in req for ownership check');
        return res.status(401).json({ 
          message: 'Authentication required',
          error: 'NOT_AUTHENTICATED'
        });
      }

      const resourceId = req.params[resourceIdField];
      const userId = req.user._id.toString();

      if (resourceId === userId) {
        return next();
      }

      const hasRole = await req.user.hasRole(allowedRoles);
      if (hasRole) {
        return next();
      }

      console.log('User lacks ownership or required roles:', allowedRoles);
      return res.status(403).json({ 
        message: 'Access denied. You can only access your own resources or need admin privileges',
        error: 'OWNERSHIP_OR_ROLE_REQUIRED'
      });
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        message: 'Error checking resource ownership',
        error: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};

module.exports = { 
  authenticateToken, 
  requireRole, 
  requirePermission, 
  requireOwnershipOrRole 
};