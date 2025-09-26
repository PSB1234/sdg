const Role = require('../models/role');
const User = require('../models/user');
const { PERMISSIONS } = require('../config/roles');

const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ 
        message: 'Role name is required' 
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ 
      name: name.toUpperCase() 
    });
    
    if (existingRole) {
      return res.status(400).json({ 
        message: 'Role already exists' 
      });
    }

    // Validate permissions
    const validPermissions = Object.keys(PERMISSIONS);
    const invalidPerms = permissions?.filter(perm => 
      !validPermissions.includes(perm) && perm !== '*'
    ) || [];
    
    if (invalidPerms.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid permissions',
        invalidPermissions: invalidPerms
      });
    }

    const role = new Role({
      name: name.toUpperCase(),
      description,
      permissions: permissions || [],
      createdBy: req.user._id
    });

    await role.save();

    res.status(201).json({
      message: 'Role created successfully',
      role
    });
  } catch (error) {
    console.error('Create role error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: 'Server error creating role' 
    });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const query = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const roles = await Role.find(query)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Role.countDocuments(query);

    res.json({
      roles,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ 
      message: 'Server error fetching roles' 
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!role) {
      return res.status(404).json({ 
        message: 'Role not found' 
      });
    }

    res.json({ role });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ 
      message: 'Server error fetching role' 
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description, permissions, isActive } = req.body;
    
    // Validate permissions if provided
    if (permissions) {
      const validPermissions = Object.keys(PERMISSIONS);
      const invalidPerms = permissions.filter(perm => 
        !validPermissions.includes(perm) && perm !== '*'
      );
      
      if (invalidPerms.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid permissions',
          invalidPermissions: invalidPerms
        });
      }
    }

    const updates = { description, permissions, isActive };
    
    if (name) {
      updates.name = name.toUpperCase();
      
      // Check if new name already exists (excluding current role)
      const existingRole = await Role.findOne({ 
        name: name.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingRole) {
        return res.status(400).json({ 
          message: 'Role name already exists' 
        });
      }
    }

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!role) {
      return res.status(404).json({ 
        message: 'Role not found' 
      });
    }

    res.json({
      message: 'Role updated successfully',
      role
    });
  } catch (error) {
    console.error('Update role error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: 'Server error updating role' 
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    // Check if role is being used by any users
    const usersWithRole = await User.countDocuments({ roles: req.params.id });
    
    if (usersWithRole > 0) {
      return res.status(400).json({ 
        // FIX APPLIED: Changed to backticks for template literal
        message: `Cannot delete role. ${usersWithRole} users are assigned to this role.`,
      });
    }

    const role = await Role.findByIdAndDelete(req.params.id);
    
    if (!role) {
      return res.status(404).json({ 
        message: 'Role not found' 
      });
    }

    res.json({ 
      message: 'Role deleted successfully' 
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ 
      message: 'Server error deleting role' 
    });
  }
};

const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(400).json({ 
        message: 'User ID and Role ID are required' 
      });
    }

    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    if (!role) {
      return res.status(404).json({ 
        message: 'Role not found' 
      });
    }

    if (!role.isActive) {
      return res.status(400).json({ 
        message: 'Cannot assign inactive role' 
      });
    }

    // Check if user already has this role
    if (user.roles.includes(roleId)) {
      return res.status(400).json({ 
        message: 'User already has this role' 
      });
    }

    user.roles.push(roleId);
    await user.save();
    await user.populate('roles', 'name description');

    res.json({
      message: 'Role assigned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ 
      message: 'Server error assigning role' 
    });
  }
};

const removeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(400).json({ 
        message: 'User ID and Role ID are required' 
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Check if user has this role
    if (!user.roles.includes(roleId)) {
      return res.status(400).json({ 
        message: 'User does not have this role' 
      });
    }

    user.roles = user.roles.filter(role => role.toString() !== roleId);
    await user.save();
    await user.populate('roles', 'name description');

    res.json({
      message: 'Role removed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({ 
      message: 'Server error removing role' 
    });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser
};