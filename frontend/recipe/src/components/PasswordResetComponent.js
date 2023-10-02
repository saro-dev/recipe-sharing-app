// PasswordResetComponent.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PasswordResetComponent = () => {
const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        token,
        newPassword: password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        {message && (
          <p className="text-green-500 mb-2 text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-500 mb-2 text-center">{error}</p>
        )}
        <form className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            onChange={handlePasswordChange}
            value={password}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetComponent;
