// app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const chalk = require("chalk")

require('dotenv').config();

const UserRouter = require('./routes/userRouter');
const AuthRouter = require('./routes/authRouter');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorHandler');

const app = express();

// ============================
// MIDDLEWARES
// ============================

// Security headers
app.use(helmet());

// Body parser
app.use(express.json());
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10 ,
  message: 'Too many login/signup attempts, please try again later'
});

app.use('/api', globalLimiter);
app.use('/api/v1/auth', authLimiter);

// ============================
// ROUTES
// ============================
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/auth', AuthRouter);

// ============================
// UNHANDLED ROUTES (404)
// ============================
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ============================
// GLOBAL ERROR HANDLER
// ============================
app.use(globalErrorHandler);

module.exports = app;
