const DEFAULT_ROLES = {
  SUPERADMIN: {
    name: 'SUPERADMIN',
    description: 'Super Administrator with all permissions',
    permissions: ['*'] // Wildcard for all permissions
  },
  ADMIN: {
    name: 'ADMIN',
    description: 'Administrator with management permissions',
    permissions: [
      'user:read', 'user:write', 'user:delete',
      'role:read', 'role:write', 'role:delete',
      'system:read', 'system:write'
    ]
  },
  MANAGER: {
    name: 'MANAGER',
    description: 'Manager with limited administrative permissions',
    permissions: [
      'user:read', 'user:write',
      'role:read',
      'system:read',
      'report:read', 'report:write'
    ]
  },
  USER: {
    name: 'USER',
    description: 'Regular user with basic permissions',
    permissions: [
      'profile:read', 'profile:write',
      'content:read'
    ]
  },
  GUEST: {
    name: 'GUEST',
    description: 'Guest user with minimal permissions',
    permissions: [
      'content:read'
    ]
  }
};

// All available permissions in the system
const PERMISSIONS = {
  // User permissions
  'user:read': 'View user information',
  'user:write': 'Create and update users',
  'user:delete': 'Delete users',
  
  // Role permissions
  'role:read': 'View roles',
  'role:write': 'Create and update roles',
  'role:delete': 'Delete roles',
  
  // System permissions
  'system:read': 'View system information',
  'system:write': 'Modify system settings',
  
  // Profile permissions
  'profile:read': 'View own profile',
  'profile:write': 'Update own profile',
  
  // Content permissions
  'content:read': 'View content',
  'content:write': 'Create and update content',
  'content:delete': 'Delete content',
  
  // Report permissions
  'report:read': 'View reports',
  'report:write': 'Create reports'
};

module.exports = {
  DEFAULT_ROLES,
  PERMISSIONS
};
