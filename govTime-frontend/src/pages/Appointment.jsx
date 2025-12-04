// import { useNavigate } from "react-router-dom";
// import axios from "axios";
import Sidenav from "../components/Sidenav";  
function Appointment() {
  // const navigate = useNavigate();
  // const handleLogout = async () => {
  //   try {
  //     await axios.post(
  //       "http://127.0.0.1:8000/api/v1/auth/logout",
  //       {},
  //       { withCredentials: true }
  //     );

  //     navigate("/login");
  //   } catch (error) {
  //     console.log("Logout error:", error);
  //   }
  // };

  return (
    <div className="appointment-page h-full">
       <Sidenav />  
    </div>
  );
}

export default Appointment;
//  <button
//         onClick={handleLogout}
//         className="mt-5 px-6 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
//       >
//         Log Out
//       </button>