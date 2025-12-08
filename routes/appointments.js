const express = require("express");
const route = express.Router();
const appointmentController = require('../controllers/appointments');
const authController = require('../controllers/authController')


route.get("/",authController.protect , appointmentController.getAvaliableAppointment);
route.get("/my-appointment" , authController.protect , appointmentController.getAppointment)
route.post('/book' , authController.protect , appointmentController.bookAppointment);
route.patch('/cancel-booking', authController.protect, appointmentController.cancelAppointment);

module.exports = route