import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import person from "../assets/images/person.png"; 

function Login() {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  // Redirect to appointment if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/appointment'); 
    }
  }, [navigate]); 

 const handleLogin = async (e) => {
  e.preventDefault();
  const loginData = {
    national_id: nationalId,
    password,
  };
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token } = response.data;

    if (token) {
      localStorage.setItem('authToken', token);

      navigate('/appointment');
    } else {
      setError('Unexpected error occurred');
    }

  } catch (error) {
    if (error.response) {
      console.log('Error response:', error.response);    
      setError(error.response.data || 'Login failed'); 
    } else if (error.request) {
      console.log('Error request:', error.request);
      setError('No response from the server. Please try again.');
    } else {
 
      console.log('Error message:', error.message);
      setError(error.message || 'An unexpected error occurred.');
    }
  }
};


  return (
    <>
      <img
        src={person}
        alt="person icon"
        className="absolute w-30 left-[50%] translate-[-50%] -mt-5"
      />
      <div className="container mx-auto p-6 bg-linear-to-t from-white to-[#F4F7FB] rounded-3xl shadow-lg max-w-sm mt-35 w-full h-full">
        <div className="heading text-center font-extrabold text-3xl text-blue-900">Log In</div>

        {/* Display error message if there is one */}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        <form className="form mt-6" onSubmit={handleLogin}>
          <input
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="input w-full bg-white border-transparent px-5 py-3 rounded-full shadow-lg mt-4 focus:outline-none focus:ring-1 focus:ring-[#12B1D1] duration-800 placeholder-gray-400"
            type="text"
            name="nationalId"
            id="nationalId"
            placeholder="National ID"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full bg-white border-transparent px-5 py-3 rounded-full shadow-lg mt-4 focus:outline-none focus:ring-1 focus:ring-[#12B1D1] duration-800 placeholder-gray-400"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <span className="forgot-password block mt-2 ml-2 text-xs text-blue-600">
            <a href="#">Forgot Password?</a>
          </span>
          <input
            className="login-button w-full font-bold cursor-pointer bg-linear-to-r from-blue-600 to-cyan-400 text-white py-3 mt-5 rounded-full shadow-xl hover:scale-105 transform transition-all"
            type="submit"
            value="Sign In"
          />
        </form>

        <span className="agreement block text-center mt-4 text-xs">
          <a href="#" className="text-blue-600">Learn user licence agreement</a>
        </span>
      </div>
    </>
  );
}

export default Login;
