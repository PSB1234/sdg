const Lead = require('../models/lead');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const submitLead = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, productType, address,
      existingRelationship, aadharCard, loanAmount,
      creditScore, annualIncome
    } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !productType || !loanAmount || !creditScore || !annualIncome) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Create lead for customer
    const lead = new Lead({
      customerName: name,
      email,
      phoneNumber,
      productType,
      address,
      existingRelationship,
      aadharCard,
      loanAmount,
      creditScore,
      annualIncome,
      status: 'New',
      priorityScore: 50, // default medium
      isCustomer: true,
      createdBy: null // customer leads do not have createdBy
    });

    // Save immediately to DB
    await lead.save();

    // Respond to customer immediately
    res.status(201).json({
      message: 'Lead submitted successfully',
      trackingToken: lead.trackingToken,
      leadId: lead._id
    });

    // Run AI priority in background
    (async () => {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
Analyze the following customer loan request and determine priority level: high, medium, or low.
Features:
- Product Type: ${productType}
- Loan Amount: ${loanAmount}
- Credit Score: ${creditScore}
- Annual Income: ${annualIncome}
- Existing Relationship: ${existingRelationship || 'None'}
- Aadhar Card: ${aadharCard ? 'Provided' : 'Not Provided'}
- Address: ${address}
- Phone: ${phoneNumber}

Return as JSON: { priority: "high|medium|low", score: number between 0-100 }
`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const aiPriority = JSON.parse(responseText);

        // Map priority to score
        let score = 50;
        if (aiPriority.priority === 'high') score = 80 + Math.floor(Math.random() * 20);
        else if (aiPriority.priority === 'medium') score = 40 + Math.floor(Math.random() * 39);
        else if (aiPriority.priority === 'low') score = Math.floor(Math.random() * 39);

        lead.priorityScore = score;
        await lead.save();
      } catch (err) {
        console.error('AI priority update error:', err);
      }
    })();

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

module.exports = { submitLead, getLeadStatus };
