const express = require("express");
const route = express.Router();
const appointmentController = require('../controllers/appointments');
const authController = require('../controllers/authController')


route.get("/",authController.protect , appointmentController.getAvaliableAppointment);
route.post('/book' , authController.protect , appointmentController.bookAppointment);
route.patch('/cancel-booking/:id' , authController.protect , appointmentController.cancelAppointment)

module.exports = route