// routes/customerRoutes.js (New file)
const express = require('express');
const router = express.Router();
const { submitLead, getLeadStatus } = require('../controllers/customerController');

// No auth needed for customer routes
router.post('/lead-submit', submitLead);
router.get('/lead/:id/status', getLeadStatus); // But uses token in query

module.exports = router;