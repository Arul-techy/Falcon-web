const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const generateRouter = require('./routes/generate');

const app = express();

// CORS — allow all origins for the Cloud Function
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Falcon Web-Builder API is running on Firebase' });
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

// Export as Firebase Function with generous timeout & memory
exports.api = functions
  .runWith({ timeoutSeconds: 120, memory: '512MB' })
  .https.onRequest(app);
