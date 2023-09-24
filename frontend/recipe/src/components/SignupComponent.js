import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SignupComponent = ({ onSignupSuccess }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post('https://recipe-backend-1e02.onrender.com/api/signup', userData);
      console.log('User created:', response.data);
      onSignupSuccess(response.data); // Pass the user data to the parent component
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred while signing up. Please try again later.');
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
        {errorMessage && (
          <p className="text-red-500 mb-2 text-center border border-red-500 py-1 rounded">
            {errorMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
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
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
