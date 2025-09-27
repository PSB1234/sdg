// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { submitLead, getLeadStatus, getUserLeads } = require('../controllers/customerController');

// Submit a new lead
// POST /api/customer/lead-submit
router.post('/lead-submit', submitLead);

// Get lead status using ?token=... 
// GET /api/customer/lead-status?token=abc123
router.get('/lead-status', getLeadStatus);

// Get all leads for a user by email
// GET /api/customer/leads?email=example@gmail.com
router.get('/leads', getUserLeads);

module.exports = router;
