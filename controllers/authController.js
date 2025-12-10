require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const userSchema = require('../validators/userValidation');
const AppError = require('../utils/AppError');
const helpers = require("../utils/helpers");
const sendEmail = require('../utils/sendEmail');

// ===============================
// Helper Functions
// ===============================
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

const generateToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, res, statusCode = 200) => {
  const token = generateToken(user.id, user.role);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(statusCode).json({
    status: 'success',
    data: { user },
    token
  });
};

// ===============================
// SIGN UP / REGISTER
// ===============================
exports.signin = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) return next(new AppError(
      error.details.map(d => d.message.replace(/['"]/g, '')).join(', '),
      400
    ));

    value.password = await hashPassword(value.password);

    const { full_name, national_id, phone, email, place_birth, address, date_of_birth, password, nationalID_expiry_date } = value;

    if (!helpers.checkNationalIdWithDate(national_id, date_of_birth)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid national ID and validate with date of birth'
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO users(
        full_name, national_id, phone, email, place_birth, address, date_of_birth, password, nationalID_expiry_date, verified
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false) RETURNING *`,
      [
        full_name,
        national_id,
        phone,
        email,
        place_birth,
        address,
        date_of_birth,
        password,
        nationalID_expiry_date || 'user'
      ]
    );

    const newUser = rows[0];

    // CREATE WELCOME NOTIFICATION
    await pool.query(
      `INSERT INTO notifications(user_id, type, message, read, created_at)
       VALUES ($1, 'system', $2, false, NOW())`,
      [newUser.id, `🎉 Welcome ${newUser.full_name}! Your account has been created successfully.`]
    );

    // Generate verification token
    const verificationToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    const verifyUrl = `${process.env.BACKEND_URL}/api/v1/auth/verify/${verificationToken}`; // must match mounted route

    // Send verification email
    await sendEmail(
      newUser.email,
      'Verify your account',
      `<p>Hello ${newUser.full_name},</p>
       <p>Please verify your account by clicking the link below:</p>
       <a href="${verifyUrl}">Verify Account</a>`
    );

    createSendToken(newUser, res, 201);

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ===============================
// EMAIL VERIFICATION
// ===============================
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) return next(new AppError('You must verify you account first!', 400));

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // Fetch user
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = rows[0];

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.verified) {
      return res.json({ message: 'Your account is already verified!' });
    }

    // Update verified status and store verification token
    const { rows: updatedRows } = await pool.query(
      'UPDATE users SET verified = true, verification_token = $1 WHERE id = $2 RETURNING *',
      [token, userId]
    );

    const updatedUser = updatedRows[0];

    // Add notification for user
    await pool.query(
      `INSERT INTO notifications(user_id, type, message, read, created_at)
       VALUES ($1, 'system', $2, false, NOW())`,
      [userId, `✅ Your account has been successfully verified!`]
    );

    res.json({ message: 'Your account has been successfully verified!', user: updatedUser });

  } catch (err) {
    console.error('Verification error:', err);
    next(new AppError('Invalid or expired verification link', 400));
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res, next) => {
  try {
    const { national_id, password } = req.body;

    if (!national_id || !password) 
      return next(new AppError('Please provide national_id and password', 400));

    const { rows } = await pool.query('SELECT * FROM users WHERE national_id = $1', [national_id]);
    const user = rows[0];

    if (!user) return next(new AppError('User not found, please signup!', 404));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(new AppError('Incorrect password or national_id', 401));

    if (!user.verified) 
      return next(new AppError('Please verify your email before logging in.', 401));

    createSendToken(user, res, 200);

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ===============================
// LOGOUT
// ===============================
exports.logout = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out" });
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
    console.error('Protect middleware error:', err);
    return next(new AppError('Invalid or expired token.', 401));
  }
};

// ===============================
// Role-based Access Middleware
// ===============================
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('You are not allowed to perform this operation!', 403));
  next();
};
