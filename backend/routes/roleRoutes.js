const express = require('express');
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser
} = require('../controllers/roleController');
const { 
  authenticateToken, 
  requirePermission,
  requireRole 
} = require('../middleware/auth');

// Apply authentication to all role routes
router.use(authenticateToken);

// Role CRUD operations
router.post('/', requirePermission('role:write'), createRole);
router.get('/', requirePermission('role:read'), getAllRoles);
router.get('/:id', requirePermission('role:read'), getRoleById);
router.put('/:id', requirePermission('role:write'), updateRole);
router.delete('/:id', requirePermission('role:delete'), deleteRole);

// Role assignment operations
router.post('/assign', requirePermission('user:write'), assignRoleToUser);
router.post('/remove', requirePermission('user:write'), removeRoleFromUser);

module.exports = router;
