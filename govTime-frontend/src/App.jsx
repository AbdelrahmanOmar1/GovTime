import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Appointment from "./pages/Appointment";
import Profile from "./pages/Profile";
import Notification from "./pages/Notification";
import VerifyAccountPage from './pages/VerifyAccount';
import './assets/Css/App.css';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signin />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/profile' element={<Profile />} /> 
        <Route path='/notification' element={<Notification />} />
        <Route path='/verify' element={<VerifyAccountPage />} />
      </Routes>
    </div>
  );
}

export default App;
