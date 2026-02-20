const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const pool = require('./config/db');
const { logger, requestLogger } = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Diagnostic endpoint
app.get('/api/diagnose', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 as test');
    const [users] = await pool.query('SHOW COLUMNS FROM users');
    const [grievances] = await pool.query('SHOW COLUMNS FROM grievances');
    
    res.json({
      database: 'connected',
      users_columns: users.map(c => ({ field: c.Field, type: c.Type })),
      grievances_columns: grievances.map(c => ({ field: c.Field, type: c.Type }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  logger.error('Global error handler', { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Test database connection
(async () => {
  try {
    await pool.query('SELECT 1');
    logger.info('Database connected successfully');
    console.log('✓ Database connected successfully');
  } catch (err) {
    logger.error('Database connection failed', { error: err.message });
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, { 
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
  console.log(`✓ Backend running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
