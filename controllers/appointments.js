const pool = require('../config/db');
const helpers = require('../utils/helpers');
const AppError = require('../utils/AppError');
require("dotenv").config();

// -------------------------------------------
// Helper to check available dates
// -------------------------------------------
async function checkAvailableDates(datesGenerated) {
  const availableDays = [];

  for (const date of datesGenerated) {
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM appointments WHERE appointment_date = $1",
      [date]
    );
    const total = parseInt(countRes.rows[0].count, 10);

    if (total < 400) {
      if (process.env.NODE_ENV === "development") {
        availableDays.push({
          date,
          slots_left: 400 - total
        });
      } else {
        availableDays.push(date);
      }
    }
  }

  return availableDays;
}

// -------------------------------------------
// GET AVAILABLE APPOINTMENTS
// -------------------------------------------
exports.getAvaliableAppointment = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const userRes = await pool.query(
      "SELECT nationalid_expiry_date FROM Users WHERE id = $1",
      [userID]
    );

    const expiryDate = userRes.rows[0].nationalid_expiry_date;
    const isValid = helpers.checkNationalIdExpiry(expiryDate);

    const generatedDates = await helpers.generateDatsForExpierd();
    const availableDays = await checkAvailableDates(generatedDates);

    const response = {
      message: isValid
        ? "Your national ID is valid!"
        : 'Your national ID has expired! Please renew it now. "You will pay a fine"',
      dats:
        availableDays.length === 0
          ? ["No available dates. Please book via VIP services!"]
          : availableDays,
    };

    return res.status(200).json(response);

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// -------------------------------------------
// BOOK APPOINTMENT
// -------------------------------------------
exports.bookAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid date and time!"
      });
    }

    // Check if user already booked
    const bookedCheck = await pool.query(
      "SELECT * FROM appointments WHERE user_id = $1 AND status = 'booked'",
      [userId]
    );

    if (bookedCheck.rows.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "You already have an active appointment. Cancel it before booking a new one."
      });
    }

    // Check capacity
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM appointments WHERE appointment_date = $1",
      [date]
    );

    const count = parseInt(countRes.rows[0].count, 10);

    if (count >= 400) {
      return res.status(400).json({
        status: "fail",
        message: "No available appointments for this date!"
      });
    }

    // Insert appointment
    await pool.query(
      `INSERT INTO appointments (user_id, appointment_time, appointment_date, status)
       VALUES ($1, $2, $3, 'booked')`,
      [userId, time, date]
    );

    return res.status(200).json({
      status: "success",
      message: `Appointment successfully booked for ${date} at ${time}.`
    });

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// -------------------------------------------
// GET USER APPOINTMENT
// -------------------------------------------
exports.getAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT appointment_date, appointment_time FROM appointments WHERE user_id = $1 AND status = 'booked'",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "You don't have any active appointments. Please book one!"
      });
    }

    const { appointment_date, appointment_time } = result.rows[0];

    return res.status(200).json({
      status: "success",
      appointment: {
        date: new Date(appointment_date).toISOString().split("T")[0],
        time: appointment_time.slice(0, 5)
      }
    });

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// -------------------------------------------
// CANCEL USER APPOINTMENT
// -------------------------------------------
exports.cancelAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if user has booked appointment
    const check = await pool.query(
      "SELECT * FROM appointments WHERE user_id = $1 AND status = 'booked'",
      [userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        message: "No active appointment found for this user."
      });
    }

    // Cancel it
    await pool.query(
      "UPDATE appointments SET status = 'cancelled' WHERE user_id = $1 AND status = 'booked'",
      [userId]
    );

    return res.status(200).json({
      status: "success",
      message: "Appointment cancelled successfully."
    });

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
