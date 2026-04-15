const express = require('express');
const cors = require('cors');
const generateRouter = require('./routes/generate');

const app = express();

// CORS — allow all origins for serverless deployment
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Falcon Web-Builder API is running' });
});

// Routes
app.use('/api', generateRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
