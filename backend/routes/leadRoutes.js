// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyLeads,
  getAllLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  assignLead,
  updateLeadStatus,
  addComment,
  addInteraction,
  getAIRecommendations
} = require('../controllers/leadController');
const { authenticateToken, requirePermission } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/my', requirePermission('lead:read'), getMyLeads);
router.get('/all', requirePermission('lead:read'), getAllLeads); // But internally checks superadmin
router.post('/', requirePermission('lead:write'), createLead);
router.get('/:id', requirePermission('lead:read'), getLeadById);
router.put('/:id', requirePermission('lead:write'), updateLead);
router.delete('/:id', requirePermission('lead:delete'), deleteLead);
router.post('/:id/assign', requirePermission('lead:assign'), assignLead);
router.patch('/:id/status', requirePermission('lead:update_status'), updateLeadStatus);
router.post('/:id/comments', requirePermission('lead:add_comment'), addComment);
router.post('/:id/interactions', requirePermission('lead:write'), addInteraction);
router.get('/:id/ai-recommendations', requirePermission('lead:read'), getAIRecommendations);

module.exports = router;