// controllers/reportController.js
const Lead = require('../models/lead');
const Task = require('../models/task');
const exceljs = require('exceljs'); // Install via npm i exceljs for exports

const getFunnelReport = async (req, res) => {
  try {
    if (!await req.user.hasRole(['SUPERADMIN', 'ADMIN', 'MANAGER'])) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const stages = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({ funnel: stages });
  } catch (error) {
    console.error('Funnel report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPerformanceReport = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if (await user.hasRole(['MANAGER'])) {
      query.assignedTo = user._id;
    } // Superadmin gets all, with zone-wise if needed

    const leads = await Lead.find(query);
    const total = leads.length;
    const converted = leads.filter(l => l.status === 'Converted').length;
    const conversionRate = (converted / total) * 100 || 0;

    // Add more KPIs as needed

    res.json({ performance: { total, converted, conversionRate } });
  } catch (error) {
    console.error('Performance report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAIInsights = async (req, res) => {
  try {
    if (!await req.user.hasRole(['SUPERADMIN', 'ADMIN'])) {
      return res.status(403).json({ message: 'Admins and Superadmins only' });
    }

    const leads = await Lead.find({ 'aiRecommendations.nextBestAction': { $exists: true } });
    const aiPrioritized = leads.length;
    const convertedHighPriority = leads.filter(l => l.priorityScore > 70 && l.status === 'Converted').length;
    const accuracy = (convertedHighPriority / aiPrioritized) * 100 || 0;

    res.json({ aiInsights: { aiPrioritized, accuracy } });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const exportReport = async (req, res) => {
  try {
    const { type } = req.params; // e.g., 'daily', 'weekly', 'monthly'
    // Implement logic based on type, e.g., filter by date range

    const leads = await Lead.find({ /* filters based on type */ });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    worksheet.columns = [
      { header: 'Lead ID', key: '_id' },
      { header: 'Customer Name', key: 'customerName' },
      // Add more columns
    ];

    worksheet.addRows(leads);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_report.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFunnelReport,
  getPerformanceReport,
  getAIInsights,
  exportReport
};