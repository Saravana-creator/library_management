require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const issueRoutes = require('./routes/issues');
const approvalRoutes = require('./routes/approvals');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});