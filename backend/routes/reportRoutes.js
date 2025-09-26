// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const {
  getFunnelReport,
  getPerformanceReport,
  getAIInsights,
  exportReport
} = require('../controllers/reportController');
const { authenticateToken, requirePermission } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/funnel', requirePermission('report:read'), getFunnelReport);
router.get('/performance', requirePermission('report:read'), getPerformanceReport);
router.get('/ai-insights', requirePermission('report:read'), getAIInsights);
router.get('/export/:type', requirePermission('report:export'), exportReport);

module.exports = router;