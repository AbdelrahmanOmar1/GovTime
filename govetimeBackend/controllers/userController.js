const bcrypt = require("bcrypt");
const NodeCache = require("node-cache");
const User = require("../models/User");
const userSchema = require("../validators/userValidation");
const AppError = require("../utils/AppError");
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// ====================
// GET ALL USERS
// ====================
exports.getAllUsers = async (req, res, next) => {
  try {
    const cachedUsers = myCache.get("all_users");
    if (cachedUsers) {
      return res.status(200).json({
        status: "success",
        message: "Users fetched from cache",
        results: cachedUsers.length,
        data: { users: cachedUsers },
      });
    }

    const users = await User.find().lean();
    myCache.set("all_users", users);

    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ====================
// CREATE USER
// ====================
exports.createUser = async (req, res, next) => {
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

    value.password = await bcrypt.hash(
      value.password,
      await bcrypt.genSalt(12),
    );

    const user = await User.create({
      ...value,
      role: value.role || "user",
      verified: false,
    });

    myCache.del("all_users"); // clear cache

    res.status(201).json({ status: "success", data: { user } });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ====================
// GET USER BY ID
// ====================
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({ status: "success", data: { user } });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ====================
// UPDATE USER
// ====================
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
      presence: "optional",
    });
    if (error)
      return next(
        new AppError(
          error.details.map((d) => d.message.replace(/['"]/g, "")).join(", "),
          400,
        ),
      );

    if (value.password) {
      value.password = await bcrypt.hash(
        value.password,
        await bcrypt.genSalt(12),
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) return next(new AppError("User not found", 404));

    myCache.del("all_users"); // clear cache

    res.status(200).json({ status: "success", data: { user: updatedUser } });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ====================
// DELETE USER
// ====================
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return next(new AppError("User not found", 404));

    myCache.del("all_users"); // clear cache

    res
      .status(200)
      .json({
        status: "success",
        message: "User deleted successfully",
        data: null,
      });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
