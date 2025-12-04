const cron = require('node-cron');
const pool = require('../config/db');
const helpers = require('./helpers'); // your helper functions
const notificationService = require('../services/notification.service');

function startScheduler() {
  // Runs every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Scheduler running: Checking national ID expirations...');

    try {
      const { rows: users } = await pool.query(
        "SELECT id, nationalid_expiry_date, email, phone FROM users"
      );

      const today = new Date();
      for (const user of users) {
        const expiryDate = new Date(user.nationalid_expiry_date);
        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        // 1️⃣ If national ID expires in 10 days
        if (daysLeft === 10) {
          await notificationService.send(
            user.email,
            `Your National ID will expire in 10 days on ${expiryDate.toDateString()}`
          );
          console.log(`Notification sent to user ${user.id}`);
        }

        // 2️⃣ If expired
        if (expiryDate < today) {
          // Mark as expired, assign fine, generate next available dates
          await helpers.assignNewAppointment(user.id);
        }
      }
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  });
}

module.exports = { startScheduler };
