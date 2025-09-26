// controllers/leadController.js
const Lead = require('../models/lead');
const User = require('../models/user');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Install via npm i @google/generative-ai
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Add GEMINI_API_KEY to .env

const getMyLeads = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    
    if (await user.hasRole(['MANAGER'])) {
      // Processing Centre: leads assigned to them
      query.assignedTo = user._id;
    } else if (await user.hasRole(['SUPERADMIN'])) {
      // Nodal Officer: leads under their zone (assuming user has zone field; add if needed)
      query.zone = user.zone; // Assume User model has zone field
    } else {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Apply filters
    const { priority, productType, status, startDate, endDate } = req.query;
    if (priority) query.priorityScore = { $gte: parseInt(priority) };
    if (productType) query.productType = productType;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.lastUpdated = {};
      if (startDate) query.lastUpdated.$gte = new Date(startDate);
      if (endDate) query.lastUpdated.$lte = new Date(endDate);
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name')
      .select('customerName productType status priorityScore assignedTo lastUpdated');

    res.json({ leads });
  } catch (error) {
    console.error('Get my leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllLeads = async (req, res) => {
  try {
    if (!await req.user.hasRole(['SUPERADMIN'])) {
      return res.status(403).json({ message: 'Superadmin only' });
    }

    // Similar filters as above
    const { priority, productType, status, startDate, endDate } = req.query;
    let query = {};
    if (priority) query.priorityScore = { $gte: parseInt(priority) };
    if (productType) query.productType = productType;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.lastUpdated = {};
      if (startDate) query.lastUpdated.$gte = new Date(startDate);
      if (endDate) query.lastUpdated.$lte = new Date(endDate);
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name')
      .select('customerName productType status priorityScore assignedTo lastUpdated');

    res.json({ leads });
  } catch (error) {
    console.error('Get all leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createLead = async (req, res) => {
  try {
    if (!await req.user.hasRole(['MANAGER', 'SUPERADMIN'])) {
      return res.status(403).json({ message: 'Managers and Superadmins only' });
    }

    const { customerName, productType, customerDetails } = req.body;
    if (!customerName || !productType || !customerDetails) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const lead = new Lead({
      ...req.body,
      createdBy: req.user._id
    });
    await lead.save();

    res.status(201).json({ message: 'Lead created', lead });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name')
      .populate('interactions.createdBy', 'name')
      .populate('comments.createdBy', 'name');

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Check access: assignedTo or superadmin
    if (!await req.user.hasRole(['SUPERADMIN']) && !lead.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (!await req.user.hasRole(['SUPERADMIN']) && !lead.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(lead, req.body);
    await lead.save();

    res.json({ message: 'Lead updated', lead });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteLead = async (req, res) => {
  try {
    if (!await req.user.hasRole(['SUPERADMIN'])) {
      return res.status(403).json({ message: 'Superadmin only' });
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignLead = async (req, res) => {
  try {
    if (!await req.user.hasRole(['SUPERADMIN'])) {
      return res.status(403).json({ message: 'Superadmin only' });
    }

    const { assignedTo } = req.body;
    if (!assignedTo) return res.status(400).json({ message: 'AssignedTo required' });

    const lead = await Lead.findByIdAndUpdate(req.params.id, { assignedTo }, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json({ message: 'Lead assigned', lead });
  } catch (error) {
    console.error('Assign lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    if (!await req.user.hasRole(['MANAGER'])) {
      return res.status(403).json({ message: 'Managers only' });
    }

    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status required' });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (!lead.assignedTo.equals(req.user._id)) return res.status(403).json({ message: 'Not assigned to you' });

    lead.status = status;
    await lead.save();

    res.json({ message: 'Status updated', lead });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    if (!await req.user.hasRole(['MANAGER', 'ADMIN'])) {
      return res.status(403).json({ message: 'Managers and Admins only' });
    }

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text required' });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.comments.push({ text, createdBy: req.user._id });
    await lead.save();

    res.json({ message: 'Comment added', lead });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addInteraction = async (req, res) => {
  try {
    const { type, details } = req.body;
    if (!type || !details) return res.status(400).json({ message: 'Type and details required' });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (!await req.user.hasRole(['SUPERADMIN']) && !lead.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    lead.interactions.push({ type, details, createdBy: req.user._id });
    await lead.save();

    res.json({ message: 'Interaction added', lead });
  } catch (error) {
    console.error('Add interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAIRecommendations = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (!await req.user.hasRole(['SUPERADMIN']) && !lead.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Use Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze this lead: Customer: ${lead.customerName}, Product: ${lead.productType}, Status: ${lead.status}, Priority: ${lead.priorityScore}, Interactions: ${JSON.stringify(lead.interactions)}. Suggest next best action and drop-off risk (0-100).`;
    const result = await model.generateContent(prompt);
    const response = result.response.text(); // Parse as needed, e.g., JSON

    // Assume response is JSON: { nextBestAction: '...', dropOffRisk: 50 }
    const aiRecs = JSON.parse(response);
    lead.aiRecommendations = aiRecs;
    await lead.save();

    res.json({ aiRecommendations: aiRecs });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};