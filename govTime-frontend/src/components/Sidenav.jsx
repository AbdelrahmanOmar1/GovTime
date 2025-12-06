import govTimeLogo from "../assets/images/govtime-removed.png"
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate  } from "react-router-dom";
import { useState } from "react";



const links  = ["profile" , "appointments" , "notification"];
const svgs = [<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>  ,           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                </svg> ,     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                </svg> ];
function Sidenav() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handelLogout = async () => {
    try {
      await axios.post(
       " http://127.0.0.1:8000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );    
    navigate("/" , {replace : true});
    } catch (err) {
     setError("Logout error:", err);
    }
    console.log("logging out");
    
    }
  return (
    <div className="sidenav h-full ">
         {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        <div className="sidenav-list fixed left-0 top-0 flex justify-left flex-col items-center gap-15 bg-[#0b1b4f] h-full w-[15%] ml-0  pl-2 text-white text-[20px] " >
            <img src={govTimeLogo} alt="govtime logo" className="w-43"/>
            {links.map((link , index) => (
                <div key={link} className="button-icon flex jsustify-center items-center gap-3 hover:cursor-pointer duration-1000 py-2 hover:bg-[#ffffff3f] w-full rounded-md">
                    {svgs[index]}
                    <Link to={`/${link}`} className="sidenav-link ">{link.charAt(0).toUpperCase() + link.slice(1)}</Link>
                </div>
            ))}
            <button onClick={handelLogout} className=" m-5 p-3 flex gap-1 justify-center items-center absolute bottom-0 text-[16px] hover:bg-[#ffffff3f] cursor-pointer duration-1000 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                 Log Out
            </button>
        </div>
    </div>
  );
}

export default Sidenav;