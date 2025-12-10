// src/pages/Home.js
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import govTimeLogo from "../assets/images/govtime-removed.png";
import govTimeLogoBlue from "../assets/images/govtime-logoBlue.png";
import govTimeLogoBrown from "../assets/images/govtime-logoBrown.png";
import Card from "../components/Card"

function Home() {
  return (
    <div className="home">
      <div className="container">
        <Navbar />
        <div className="welcome-section mx-20">
          <h1 className="mt-20 mb-2 text-[#008850] font-bold text-5xl">Welcome to GovTime!</h1>
          <p className="w-102 pl-2 text-[#555] text-[16px]">
            The electronic platform for the services of the Ministry of Interior and its sectors, to serve citizens!
          </p>
        </div>
        <div className="cards-section m-20 cursor-pointer">
          <div className="card-grid flex justify-between gap-5 mx-20">
            <Card
              imageSrc={govTimeLogo}
              title="Save Time!"
              description="You can now reserve an appointment online, and save your time."
              bgColor="green-800"
            />
            <Card
              imageSrc={govTimeLogoBlue}
              title="Notification!"
              description="Before your NationalId expires, we will notify you with the date and time automatically."
              bgColor="blue-800"
              
            />
            <Card
              imageSrc={govTimeLogoBrown}
              title="VIP!"
              description="Now all VIP services available in all branches, to achieve your purpose faster."
              bgColor="amber-950"
            />
          </div>
        </div>
        <div className="buttons flex justify-center items-center gap-12">
         <Link to='/login'>
          <button className="btn-23 relative overflow-hidden rounded-full border-2 border-transparent bg-green-900 text-white font-extrabold text-base uppercase cursor-pointer py-5 px-18 focus:outline-none">
            <span className="text absolute inset-0 grid place-items-center transition-opacity duration-200">log in</span>
            <span aria-hidden="true" className="marquee absolute inset-0 grid place-items-center opacity-0 text-shadow-marquee">log in</span>
          </button>
          </Link>
        </div>
        <footer className="bg-[#e7eaeb] text-black  py-1.5 mt-20">
          <div className="container mx-auto text-center">
          <p>&copy; 2025 GovTime. All Rights Reserved.</p>
         </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;