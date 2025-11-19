// import { Link } from "react-router-dom"
// import Login from "../pages/Login"
import egyptVision from "../assets/images/removed.png" 
import govTimeLogo from "../assets/images/govtime-removed.png"
import Grid from "../assets/images/Grid_colored.svg"
function Navbar() {
  return (
    <>
    <div className="nav-bar" style={{ backgroundImage: `url(${Grid})` }}>
        <div className="continer flex justify-between items-center mx-7.5">
        <img src={egyptVision} alt="egyptVision2030 logo" className="w-40"/>
        <img src={govTimeLogo} alt="govtime logo" className="w-43"/>
        </div>
    </div>
    </>
   
  )
}

export default Navbar