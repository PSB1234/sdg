const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
console.log('✅ Exported connectDB:', connectDB);
module.exports = connectDB;
