import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginComponent = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = event => {
    const { name, value } = event.target;
    setLoginData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://recipe-backend-wntf.onrender.com/api/login', loginData);
      console.log('Login successful:', response.data);
      onLoginSuccess(response.data);
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred while logging in. Please try again later.');
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
        <h2 className="text-xl font-semibold mb-4">Log In</h2>
        {errorMessage && (
          <p className="text-red-500 mb-2 text-center border border-red-500 py-1 rounded">
            {errorMessage}
          </p>
        )}
        <form onSubmit={e => e.preventDefault()} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleLogin}
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
