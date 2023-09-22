const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Import your authentication routes

// Create an Express.js app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes); // Mount the authentication routes under /auth

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
