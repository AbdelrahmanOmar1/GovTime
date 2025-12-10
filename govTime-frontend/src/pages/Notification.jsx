import { useState, useEffect, useMemo } from "react";
import api from "../axiosConfig";
import Sidenav from "../components/Sidenav";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load notifications. Please try again later.");
      }
      setLoading(false);
    };
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  const renderedNotifications = useMemo(() => {
    return notifications.map((n) => (
      <div
        key={n.id}
        className={`p-5 rounded-xl shadow-md border-l-4 transition ${
          n.read ? "bg-gray-100 border-gray-300" : "bg-white border-blue-600"
        }`}
      >
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              🔔 {n.type === "appointment" ? "Appointment" : "Notification"}
            </h2>
            <p className="text-gray-700 mt-1">{n.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </div>

          {!n.read && (
            <button
              onClick={() => markAsRead(n.id)}
              className="px-4 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:cursor-pointer"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    ));
  }, [notifications]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 min-h-screen bg-gray-900 text-white shadow-lg">
        <Sidenav />
      </div>

      <div className="flex-1 p-12 overflow-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Notifications</h1>

        {error && <div className="text-red-600">{error}</div>}

        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            <p className="text-6xl mb-4">🔔</p>
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-4">{renderedNotifications}</div>
        )}
      </div>
    </div>
  );
}

export default Notification;

