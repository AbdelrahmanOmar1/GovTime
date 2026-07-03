const Appointment = require("../models/Appointment");
const User = require("../models/User");
const helpers = require("../utils/helpers");
const AppError = require("../utils/AppError");
require("dotenv").config();

async function checkAvailableDates(datesGenerated) {
  const availableDays = [];

  for (const date of datesGenerated) {
    const total = await Appointment.countDocuments({ appointment_date: date });

    if (total < 400) {
      if (process.env.NODE_ENV === "development") {
        availableDays.push({
          date,
          slots_left: 400 - total,
        });
      } else {
        availableDays.push(date);
      }
    }
  }

  return availableDays;
}

exports.getAvaliableAppointment = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const user = await User.findById(userID).select("nationalID_expiry_date");
    if (!user) return next(new AppError("User not found", 404));

    const expiryDate = user.nationalID_expiry_date;
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

exports.bookAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid date and time!",
      });
    }

    const bookedCheck = await Appointment.find({
      user_id: userId,
      status: "booked",
    });
    if (bookedCheck.length > 0) {
      return res.status(400).json({
        status: "fail",
        message:
          "You already have an active appointment. Cancel it before booking a new one.",
      });
    }

    const count = await Appointment.countDocuments({ appointment_date: date });

    if (count >= 400) {
      return res.status(400).json({
        status: "fail",
        message: "No available appointments for this date!",
      });
    }

    await Appointment.create({
      user_id: userId,
      appointment_time: time,
      appointment_date: date,
      status: "booked",
    });

    return res.status(200).json({
      status: "success",
      message: `Appointment successfully booked for ${date} at ${time}.`,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await Appointment.findOne({
      user_id: userId,
      status: "booked",
    })
      .select("appointment_date appointment_time")
      .lean();

    if (!result) {
      return res.status(400).json({
        status: "fail",
        message: "You don't have any active appointments. Please book one!",
      });
    }

    const { appointment_date, appointment_time } = result;

    return res.status(200).json({
      status: "success",
      appointment: {
        date: new Date(appointment_date).toISOString().split("T")[0],
        time: appointment_time.slice(0, 5),
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const check = await Appointment.findOne({
      user_id: userId,
      status: "booked",
    });
    if (!check) {
      return res.status(404).json({
        message: "No active appointment found for this user.",
      });
    }

    await Appointment.findOneAndUpdate(
      { user_id: userId, status: "booked" },
      { status: "cancelled" },
    );

    return res.status(200).json({
      status: "success",
      message: "Appointment cancelled successfully.",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
