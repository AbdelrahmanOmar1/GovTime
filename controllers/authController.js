// authController.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const userSchema = require('../validators/userValidation');
const AppError = require('../utils/AppError');


// ===============================
// Helper Functions
// ===============================

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Generate JWT token
const generateToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Send token in cookie and response
const createSendToken = (user, res, statusCode = 200) => {
  const token = generateToken(user.id, user.role);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // Send response
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

// ===============================
// SIGN UP / REGISTER
// ===============================
exports.signin = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) return next(new AppError(error.details.map(d => d.message.replace(/['"]/g, '')).join(', '), 400));

    value.password = await hashPassword(value.password);

    const { full_name, national_id, phone, email, place_birth, address, date_of_birth, password, role } = value;

    const { rows } = await pool.query(
      'INSERT INTO users(full_name, national_id, phone, email, place_birth, address, date_of_birth, password, role) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [full_name, national_id, phone, email, place_birth, address, date_of_birth, password, role || 'user']
    );

    createSendToken(rows[0], res, 201);

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res, next) => {
  try {
    const { national_id, password } = req.body;

    if (!national_id || !password) {
      return next(new AppError('Please provide national_id and password', 400));
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE national_id = $1', [national_id]);
    const user = rows[0];

    if (!user) return next(new AppError('User not found, please signup!', 404));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(new AppError('Incorrect password or national_id', 401));

    createSendToken(user, res, 200);

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ===============================
// Protect Routes Middleware
// ===============================
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.jwt) token = req.cookies.jwt;

    if (!token) return next(new AppError('You are not logged in! Please log in to access this route.', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const currentUser = rows[0];

    if (!currentUser) return next(new AppError('The user belonging to this token no longer exists.', 401));

    req.user = currentUser;
    next();

  } catch (err) {
    return next(new AppError('Invalid or expired token.', 401));
  }
};

// ===============================
// Role-based Access Middleware
// ===============================
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not allowed to perform this operation!', 403));
    }
    next();
  };
};
