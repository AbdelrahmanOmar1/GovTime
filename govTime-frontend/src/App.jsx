import { Routes ,Route } from 'react-router-dom'
import Home from "./pages/Home"
import Login from "./pages/Login"
import Appointment from "./pages/Appointment"
import './assets/Css/App.css'
function App() {
  return (
    <div className='app'>
   <Routes>
      <Route path='/' element = {<Home/>}/>
      <Route path='/signin' element = {<Login/>}/>
      <Route path='/appointment' element = {<Appointment/>}/>
    </Routes>
    </div>
 
  )
}

export default App