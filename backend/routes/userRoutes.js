const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser
} = require('../controllers/userController');
const { 
  authenticateToken, 
  requirePermission,
  requireOwnershipOrRole 
} = require('../middleware/auth');

// Apply authentication to all user routes
router.use(authenticateToken);

router.get('/', requirePermission('user:read'), getAllUsers);

// Use the middleware and provide the resource ID field
router.get('/:id', requireOwnershipOrRole('id'), getUserById);
router.put('/:id', requireOwnershipOrRole('id'), updateUser);
router.delete('/:id', requirePermission('user:delete'), deleteUser);
router.patch('/:id/activate', requirePermission('user:write'), activateUser);
router.patch('/:id/deactivate', requirePermission('user:write'), deactivateUser);

module.exports = router;