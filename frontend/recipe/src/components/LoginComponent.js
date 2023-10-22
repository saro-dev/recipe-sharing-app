import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../banner.webp';

const LoginComponent = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Initialize the button state

  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true); // Disable the button and show "Logging in..." message
      const response = await axios.post('https://recipe-backend-1e02.onrender.com/api/login', loginData);
      console.log('Login successful:', response.data);
      onLoginSuccess(response.data);
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred while logging in. Please try again later.');
      }
    } finally {
      setIsLoggingIn(false); // Re-enable the button and hide "Logging in..." message
    }
  };

  return (
    <div className="p-4 bg-blue-100 h-screen flex items-center justify-center ">
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
      <img src={banner} alt="banner" className='rounded' style={{width:"400px", margin:"auto "}}/>
        <h2 className="text-xl font-semibold mb-4 mt-4 text-center">Log In</h2>
        {errorMessage && (
          <p className="text-red-500 mb-2 text-center border border-red-500 py-1 rounded">
            {errorMessage}
          </p>
        )}
        <form onSubmit={(e) => e.preventDefault()}  className="space-y-4 wow fadeInUp" >
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
            />
            {loginData.password.length > 0 && ( // Check password length before rendering the icon
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-0 right-0 mt-3 mr-3 cursor-pointer"
              >
                {showPassword ? (
                  <i className="fa fa-eye-slash" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-eye" aria-hidden="true"></i>
                )}
              </button>
            )}
          </div>
          <button
            type="button"
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
              isLoggingIn ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={handleLogin}
            disabled={isLoggingIn} // Add the 'disabled' attribute based on the state
          >
            {isLoggingIn ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500">Create an account</Link>
        </p>
        <p className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-800">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
