import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import Profile from "./pages/Profile";
import './assets/Css/App.css';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/profile' element={<Profile />} /> 
      </Routes>
    </div>
  );
}

export default App;
