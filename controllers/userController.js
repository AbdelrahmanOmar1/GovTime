const bcrypt = require('bcrypt');
const NodeCache = require('node-cache');
const pool = require('../config/db');
const userSchema = require('../validators/userValidation');
const AppError = require('../utils/AppError');
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// ====================
// GET ALL USERS
// ====================
exports.getAllUsers = async (req, res, next) => {
  try {
    const cachedUsers = myCache.get('all_users');
    if (cachedUsers) {
      return res.status(200).json({
        status: 'success',
        message: 'Users fetched from cache',
        results: cachedUsers.length,
        data: { users: cachedUsers }
      });
    }

    const { rows } = await pool.query('SELECT * FROM users;');
    myCache.set('all_users', rows);

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: { users: rows }
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
    const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
    if (error) return next(new AppError(error.details.map(d => d.message.replace(/['"]/g, '')).join(', '), 400));

    value.password = await bcrypt.hash(value.password, await bcrypt.genSalt(12));

    const { full_name, national_id, phone, email, place_birth, address, date_of_birth, password, role,nationalID_expiry_date } = value;
    const { rows } = await pool.query(
      'INSERT INTO users(full_name, national_id, phone, email, place_birth, address, date_of_birth, password, role ,nationalID_expiry_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9 ,$10) RETURNING *',
      [full_name, national_id, phone, email, place_birth, address, date_of_birth, password, role ,nationalID_expiry_date]
    );

    myCache.del('all_users'); // clear cache

    res.status(201).json({ status: 'success', data: { user: rows[0] } });

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
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (!rows.length) return next(new AppError('User not found', 404));

    res.status(200).json({ status: 'success', data: { user: rows[0] } });

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
    const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });
    if (error) return next(new AppError(error.details.map(d => d.message.replace(/['"]/g, '')).join(', '), 400));

    let hashedPassword;
    if (value.password) {
      hashedPassword = await bcrypt.hash(value.password, await bcrypt.genSalt(12));
    }

    const query = `
      UPDATE users
      SET full_name=$1, national_id=$2, phone=$3, email=$4, place_birth=$5, address=$6, date_of_birth=$7 , nationalID_expiry_date =$8
      ${hashedPassword ? ', password=$9' : ''}
      WHERE id=$${hashedPassword ? 9 : 10} RETURNING *
    `;

    const { full_name, national_id, phone, email, place_birth, address, date_of_birth ,nationalID_expiry_date } = value;
    const values = [full_name, national_id, phone, email, place_birth, address, date_of_birth , nationalID_expiry_date];

    if (hashedPassword) values.push(hashedPassword, id);
    else values.push(id);

    const { rows } = await pool.query(query, values);

    if (!rows.length) return next(new AppError('User not found', 404));

    myCache.del('all_users'); // clear cache

    res.status(200).json({ status: 'success', data: { user: rows[0] } });

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
    const { rows } = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);

    if (!rows.length) return next(new AppError('User not found', 404));

    myCache.del('all_users'); // clear cache

    res.status(200).json({ status: 'success', message: 'User deleted successfully', data: null });

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

