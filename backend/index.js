const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const connectDB = require('./config/database.js');
const authRoutes = require('./routes/auth.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
connectDB();

// Security middleware to set HTTP headers appropriately
app.use(helmet());

// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());

// Logging HTTP requests details in combined format
app.use(morgan('combined'));

// Parse incoming JSON requests with a size limit
app.use(express.json({ limit: '10mb' }));

// Setup session middleware — this must be BEFORE passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret key for signing session ID cookies
  resave: false,                      // Prevent session resave if unmodified
  saveUninitialized: false            // Only save sessions when modified
}));

// Initialize Passport and use session support
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies, passing passport instance
require('./config/passport')(passport);

// Mount authentication routes at /api/auth
app.use('/api/auth', authRoutes);

// Health check endpoint for server status
app.get('/health', (req, res) => {
  res.json({
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Catch-all 404 handler for unmatched routes using regex pattern
app.use(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log stack trace on server
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server and listen on configured port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
