import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VerifyAccountPage = () => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Get the token from the URL params

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.get(`/api/verify/${token}`); // Send the token to the backend
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      }
    };

    if (token) {
      verifyAccount(); 
    }
  }, [token]);

  return (
    <div className="verification-page">
      {status === 'success' ? (
        <div>
          <h2>Account Verified!</h2>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <h2>Verification Failed</h2>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyAccountPage;
