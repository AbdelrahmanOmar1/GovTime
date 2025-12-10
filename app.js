// app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const chalk = require("chalk")

require('dotenv').config();

const UserRouter = require('./routes/userRouter');
const AuthRouter = require('./routes/authRouter');
const appointmetnsRouter = require('./routes/appointments')
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorHandler');
const notificationRouter = require('./routes/notificationRouter');
const app = express();

// ============================
// MIDDLEWARES
// ============================

// Security headers
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
// Body parser
app.use(express.json());
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
    console.log(chalk.green("🚀 Server is running in development mode..."))  ;
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
    console.log(chalk.blue("🚀 Server is running in production mode..."))  ;
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

// app.use('/api', globalLimiter);
// app.use('/api/v1/auth', authLimiter);

// ============================
// ROUTES
// ============================
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/appointments' , appointmetnsRouter)
app.use('/api/v1/notifications',notificationRouter );
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
