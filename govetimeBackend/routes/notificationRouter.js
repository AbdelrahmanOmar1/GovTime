const express= require("express");
const router = express.Router();
const notificationController = require('../controllers/notification');
const authController = require('../controllers/authController');

router.get("/",authController.protect,  notificationController.showNotifications);
router.put("/:id/read",authController.protect, notificationController.markAsRead);

module.exports = router;