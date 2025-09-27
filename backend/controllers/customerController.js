// controllers/customerController.js
const Lead = require('../models/lead');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const crypto = require('crypto');

const submitLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      productType,
      address,
      existingRelationship,
      aadharCard,
      loanAmount,
      creditScore,
      annualIncome
    } = req.body;

    if (!name || !email || !phoneNumber || !productType) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const lead = new Lead({
      customerName: name,
      email,
      phoneNumber,
      productType,
      address: address || '',
      existingRelationship: existingRelationship || '',
      aadharCard: aadharCard || '',
      loanAmount: loanAmount || 0,
      creditScore: creditScore || 0,
      annualIncome: annualIncome || 0,
      status: 'New',
      priorityScore: 50
    });

    await lead.save();

    // Gemini AI call to assign priority
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ priority: 'medium', score: 50 }), 5000);
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
Analyze this loan request and assign a priority level (high, medium, low) with a score (0-100):
- Product Type: ${productType}
- Loan Amount: ${loanAmount}
- Credit Score: ${creditScore}
- Annual Income: ${annualIncome}
- Existing Relationship: ${existingRelationship || 'None'}
- Aadhar Card: ${aadharCard ? 'Provided' : 'Not Provided'}
- Address: ${address}
- Phone: ${phoneNumber}

Rules:
- High priority (80-100): Credit score >700, income >2x loan amount, existing relationship.
- Medium priority (40-79): Credit score 600-700, income ~1-2x loan amount.
- Low priority (0-39): Credit score <600 or income <loan amount.
Return JSON only: { "priority": "high|medium|low", "score": number }
`;

    const apiPromise = model.generateContent(prompt).then(result => {
      const responseText = result.response.text();
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Gemini response parse error:', parseError);
        return { priority: 'medium', score: 50 };
      }
    });

    // Race between Gemini API and 5s timeout
    const aiPriority = await Promise.race([apiPromise, timeoutPromise]);

    // Convert AI priority to score
    let score;
    if (aiPriority.priority === 'high') score = 80 + Math.floor(Math.random() * 20);
    else if (aiPriority.priority === 'medium') score = 40 + Math.floor(Math.random() * 40);
    else score = Math.floor(Math.random() * 40);

    lead.priorityScore = score;
    await lead.save();

    res.status(201).json({
      message: 'Lead submitted successfully',
      trackingToken: lead.trackingToken,
      leadId: lead._id,
      priorityScore: score
    });

  } catch (error) {
    console.error('Submit lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeadStatus = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Tracking token required' });

    const lead = await Lead.findOne({ trackingToken: token })
      .select('status priorityScore lastUpdated notifications');

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json({
      status: lead.status,
      priorityScore: lead.priorityScore,
      lastUpdated: lead.lastUpdated,
      notifications: lead.notifications
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserLeads = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const leads = await Lead.find({ email })
      .select('customerName productType status priorityScore lastUpdated trackingToken _id');

    if (!leads || leads.length === 0) {
      return res.status(404).json({ message: 'No leads found for this email' });
    }

    res.json({
      message: 'Leads retrieved successfully',
      leads: leads.map(lead => ({
        leadId: lead._id,
        customerName: lead.customerName,
        productType: lead.productType,
        status: lead.status,
        priorityScore: lead.priorityScore,
        lastUpdated: lead.lastUpdated,
        trackingToken: lead.trackingToken
      }))
    });
  } catch (error) {
    console.error('Get user leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitLead, getLeadStatus, getUserLeads };
