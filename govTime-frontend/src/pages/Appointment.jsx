import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import Sidenav from "../components/Sidenav";

function Appointment() {
  const [availableDates, setAvailableDates] = useState([]);
  const [userAppointment, setUserAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // "success", "error", "warning"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // =============================
  // FETCH APPOINTMENTS
  // =============================
useEffect(() => {
  // Define an async function inside the effect
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments");
      setAvailableDates(res.data.dats || []);
      setMessage(res.data.message || "");
      setMessageType(res.data.message?.includes("expired") ? "warning" : "success");

      try {
        const appointmentRes = await api.get("/appointments/my-appointment");
        setUserAppointment(appointmentRes.data.appointment || null);
      } catch {
        setUserAppointment(null);
      }
    } catch {
      setMessage("Error fetching appointments");
      setMessageType("error");
    }
    setLoading(false);
  };

  fetchData(); // call it here
}, []);

  // =============================
  // BOOK APPOINTMENT
  // =============================
  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage("Please select both date and time");
      setMessageType("error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post("/appointments/book", { date: selectedDate, time: selectedTime });
      setMessage(res.data.message);
      setMessageType("success");
      setUserAppointment({ date: selectedDate, time: selectedTime });
    } catch (err) {
      const backendMsg = err.response?.data?.message || "Error booking appointment";
      setMessage(backendMsg);
      setMessageType("error");
    }
    setActionLoading(false);
  };

  // =============================
  // CANCEL APPOINTMENT
  // =============================
  const handleCancelAppointment = async () => {
    setActionLoading(true);
    try {
      const res = await api.patch("/appointments/cancel-booking");
      setMessage(res.data.message);
      setMessageType("success");
      setUserAppointment(null);
    } catch (err) {
      const backendMsg = err.response?.data?.message || "Error canceling appointment";
      setMessage(backendMsg);
      setMessageType("error");
    }
    setActionLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDENAV */}
      <div className="w-64 min-h-screen bg-gray-900 text-white shadow-lg">
        <Sidenav />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-12 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
            {userAppointment ? "Your Appointment" : "Book an Appointment"}
          </h1>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center font-semibold text-lg shadow-sm ${
                messageType === "success"
                  ? "bg-green-100 text-green-800"
                  : messageType === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
            </div>
          ) : (
            <>
              {userAppointment ? (
                <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
                  <p className="text-2xl font-bold text-gray-700 mb-2">
                    📅 {userAppointment.date}
                  </p>
                  <p className="text-2xl font-bold text-gray-700 mb-6">
                    ⏰ {userAppointment.time}
                  </p>

                  <button
                    disabled={actionLoading}
                    onClick={handleCancelAppointment}
                    className={`px-8 py-3 rounded-full hover:cursor-pointer font-bold text-white text-lg transition ${
                      actionLoading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {actionLoading ? "Canceling..." : "Cancel Appointment"}
                  </button>
                </div>
              ) : (
                <div className="bg-white shadow-xl rounded-2xl p-8">
                  {/* DATE SELECTION */}
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Select a Date</h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {availableDates.length === 0 ? (
                      <p className="text-center text-gray-500 col-span-full">
                        ❌ No available dates. Please book via VIP services.
                      </p>
                    ) : (
                      availableDates.map((date, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(date.date || date)}
                          className={`py-2 hover:cursor-pointer rounded-xl font-medium border transition-colors ${
                            selectedDate === (date.date || date)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 hover:bg-blue-100"
                          }`}
                        >
                          {date.date || date}
                        </button>
                      ))
                    )}
                  </div>

                  {/* TIME SELECTION */}
                  {selectedDate && (
                    <>
                      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Select a Time</h2>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                        {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"].map((time, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 hover:cursor-pointer rounded-xl font-medium border transition-colors ${
                              selectedTime === time
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 hover:bg-blue-100"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={actionLoading}
                        onClick={handleBookAppointment}
                        className={`w-full py-3 hover:cursor-pointer rounded-full font-bold text-white text-lg transition ${
                          actionLoading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        }`}
                      >
                        {actionLoading ? "Booking..." : "Book Appointment"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointment;
