import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import person from '../assets/images/person.png';
import api from '../axiosConfig';

export default function Signin() {
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [placeBirth, setPlaceBirth] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [nationalIdExpiryDate, setNationalIdExpiryDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("auth/signin", {
        full_name: fullName,
        national_id: nationalId,
        phone,
        email,
        place_birth: placeBirth,
        address,
        date_of_birth: dateOfBirth,
        password,
        nationalID_expiry_date: nationalIdExpiryDate
      });

      // Save user ID in localStorage
      localStorage.setItem("user", res.data.data.user.id);

      navigate(`/verify`, { replace: true });
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.message || 'Sign in failed');
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
      <div className="relative w-full max-w-lg bg-white p-8 rounded-3xl shadow-lg">
        <img
          src={person}
          alt="Person icon"
          className="absolute w-20 left-1/2 transform -translate-x-1/2 -top-10"
        />
        <h2 className="text-center text-3xl font-extrabold text-blue-900 mt-10">
          Sign In
        </h2>

        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        <form onSubmit={handleSignIn} className="mt-6 space-y-4 ">
          <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="text" placeholder="National ID" value={nationalId} onChange={e => setNationalId(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="text" placeholder="Place of Birth" value={placeBirth} onChange={e => setPlaceBirth(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="date" placeholder="Date of Birth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
          <input type="date" placeholder="National ID Expiry Date" value={nationalIdExpiryDate} onChange={e => setNationalIdExpiryDate(e.target.value)} className="w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />

          <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-linear-to-r from-blue-600 to-cyan-400 text-white rounded-full shadow-lg hover:scale-105 transform transition duration-300 disabled:opacity-50 hover:cursor-pointer">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <span className="block text-center mt-4 text-xs">
          <Link to="/login" className="text-blue-600 hover:cursor-pointer ">Already have an account? Log in here.</Link>
        </span>
      </div>
    </div>
  );
}
