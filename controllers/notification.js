const pool = require("../config/db");

exports.showNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // now works automatically

    const { rows } = await pool.query(
      `SELECT id, user_id, type, message, read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: rows.length,
      notifications: rows
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Error fetching notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE notifications SET read = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating notification" });
  }
};
