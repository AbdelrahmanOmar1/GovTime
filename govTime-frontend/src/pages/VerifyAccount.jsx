import React from 'react';

const VerifyAccountPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Almost There!</h2>
        <p className="text-gray-600 mb-6">
          🎉 Your account has been created successfully. Please check your email inbox and click the verification link to activate your account.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105 hover:cursor-pointer"
        >
          Go to Home 
        </button>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
