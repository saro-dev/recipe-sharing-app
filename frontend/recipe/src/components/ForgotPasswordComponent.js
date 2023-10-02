import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setButtonDisabled] = useState(false); // Initialize the button state

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleResetPassword = async () => {
    try {
      setButtonDisabled(true); // Disable the button when clicked
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setButtonDisabled(false); // Re-enable the button after the operation is complete
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        {message && (
          <p className="text-green-500 mb-2 text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-500 mb-2 text-center">{error}</p>
        )}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            onChange={handleEmailChange}
            value={email}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <button
            type="button"
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={handleResetPassword}
            disabled={isButtonDisabled} // Add the 'disabled' attribute based on the state
          >
            {isButtonDisabled ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
