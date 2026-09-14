const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { initDB } = require('./db/db');
const { requestLogger, logError } = require('./middleware/logger');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const productRoutes = require('./routes/productRoutes');
const petRoutes = require('./routes/petRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false })); // Allow Swagger UI scripts
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Rate Limiting (Skip rate limiting during tests)
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // max 200 requests per IP per window
    message: { message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút!' }
  });
  app.use('/api/', limiter);
}

// Initialize Database & Seed
initDB();

// Interactive Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PetCare Store API Service is running healthy!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logError(err, req);
  res.status(500).json({ message: 'Lỗi máy chủ nội bộ!', error: err.message });
});

module.exports = app;
