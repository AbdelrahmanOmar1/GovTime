require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Notification = require("../models/Notification");
const userSchema = require("../validators/userValidation");
const AppError = require("../utils/AppError");
const helpers = require("../utils/helpers");
const sendEmail = require("../utils/sendEmail");

// ===============================
// Helper Functions
// ===============================
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

const getJwtExpiry = () => {
  return process.env.JWT_EXPIRES_IN || "1d";
};

const generateToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET_KEY, {
    expiresIn: getJwtExpiry(),
  });
};

const createSendToken = (user, res, statusCode = 200) => {
  const token = generateToken(user.id, user.role);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    status: "success",
    data: { user },
    token,
  });
};

// ===============================
// SIGN UP / REGISTER
// ===============================
exports.signin = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return next(
        new AppError(
          error.details.map((d) => d.message.replace(/['"]/g, "")).join(", "),
          400,
        ),
      );

    value.password = await hashPassword(value.password);

    const {
      full_name,
      national_id,
      phone,
      email,
      place_birth,
      address,
      date_of_birth,
      password,
      role,
      nationalID_expiry_date,
    } = value;

    if (!helpers.checkNationalIdWithDate(national_id, date_of_birth)) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide a valid national ID and validate with date of birth",
      });
    }

    const newUser = await User.create({
      full_name,
      national_id,
      phone,
      email,
      place_birth,
      address,
      date_of_birth,
      password,
      role: role || "user",
      nationalID_expiry_date,
      verified: false,
    });

    await Notification.create({
      user_id: newUser._id,
      type: "system",
      message: `🎉 Welcome ${newUser.full_name}! Your account has been created successfully.`,
      read: false,
    });

    // const verificationToken = jwt.sign(
    //   { id: newUser.id },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: "1d" },
    // );
    // const verifyUrl = `${process.env.BACKEND_URL}/api/v1/auth/verify/${verificationToken}`;

    // await sendEmail(
    //   newUser.email,
    //   "Verify your account",
    //   `<p>Hello ${newUser.full_name},</p>
    //    <p>Please verify your account by clicking the link below:</p>
    //    <a href="${verifyUrl}">Verify Account</a>`,
    // );

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

    if (!token)
      return next(new AppError("You must verify you account first!", 400));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verified) {
      return res.json({ message: "Your account is already verified!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verified: true, verification_token: token },
      { new: true },
    );

    await Notification.create({
      user_id: userId,
      type: "system",
      message: "✅ Your account has been successfully verified!",
      read: false,
    });

    res.json({
      message: "Your account has been successfully verified!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Verification error:", err);
    next(new AppError("Invalid or expired verification link", 400));
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res, next) => {
  try {
    const { national_id, password } = req.body;

    if (!national_id || !password)
      return next(new AppError("Please provide national_id and password", 400));

    const user = await User.findOne({ national_id });
    if (!user) return next(new AppError("User not found, please signup!", 404));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return next(new AppError("Incorrect password or national_id", 401));

    if (!user.verified)
      return next(
        new AppError("Please verify your email before logging in.", 401),
      );

    createSendToken(user, res, 200);
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ===============================
// LOGOUT
// ===============================
exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
};

// ===============================
// Protect Routes Middleware
// ===============================
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.jwt) token = req.cookies.jwt;

    if (!token)
      return next(
        new AppError(
          "You are not logged in! Please log in to access this route.",
          401,
        ),
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );

    req.user = currentUser;
    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    return next(new AppError("Invalid or expired token.", 401));
  }
};

// ===============================
// Role-based Access Middleware
// ===============================
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You are not allowed to perform this operation!", 403),
      );
    next();
  };
