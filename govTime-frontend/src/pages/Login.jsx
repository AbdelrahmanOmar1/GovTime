import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Import Link here
import person from '../assets/images/person.png';
import api from '../axiosConfig';

export default function Login() {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("auth/login", {
        national_id: nationalId,
        password
      });

      localStorage.setItem("user", res.data.data.user.id);
      
      navigate('/profile', { replace: true });
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.message || 'Login failed');
      } else if (err.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-sm bg-white p-8 rounded-3xl shadow-lg">
        <img
          src={person}
          alt="Person icon"
          className="absolute w-20 left-1/2 transform -translate-x-1/2 -top-10"
        />
        <h2 className="text-center text-3xl font-extrabold text-blue-900 mt-10">
          Log In
        </h2>

        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="National ID"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
          />
          <span className="block text-right text-xs text-blue-600">
            <a href="#">Forgot Password?</a>
          </span>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-linear-to-r from-blue-600 to-cyan-400 text-white rounded-full shadow-lg hover:scale-105 transform transition duration-300 disabled:opacity-50 hower:cursor-pointer"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Replace the 'Learn user license agreement' with the 'Not signed yet' link */}
        <span className="block text-center mt-4 text-xs">
          <Link to="/signup" className="text-blue-600 hover:cursor-pointer">Not signed yet? Sign up here.</Link>
        </span>
      </div>
    </div>
  );
}
