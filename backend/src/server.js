require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const executionRoutes = require('./routes/execution.routes');
const evaluationRoutes = require('./routes/evaluation.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for Vite frontend
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientOrigin, 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'CodeLab API',
    status: 'running',
  });
});

// API Routes
app.use('/api/execution', executionRoutes);
app.use('/api/evaluation', evaluationRoutes);

// Catch-all 404 handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// Start server if not imported
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[CodeLab API] Server is running on port ${PORT}`);
    console.log(`[CodeLab API] Health check available at: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
