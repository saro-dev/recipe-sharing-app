import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import banner from "../banner.webp";

const SignupComponent = ({ onSignupSuccess }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false); // Initialize the button state
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const phoneNumberPattern = /^\d{10}$/;
    if (!phoneNumberPattern.test(userData.phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSigningUp(true); // Disable the button and show "Signing up..." message
      const response = await axios.post(
        "https://recipe-backend-1e02.onrender.com/api/signup",
        userData
      );
      console.log("User created:", response.data);
      onSignupSuccess(response.data);
      navigate("/profile");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage(
          "An error occurred while signing up. Please try again later."
        );
      }
    } finally {
      setIsSigningUp(false); // Re-enable the button and hide "Signing up..." message
    }
  };

  return (
    <div className="p-4 bg-blue-100 h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
        <img
          src={banner}
          alt="banner"
          className="rounded"
          style={{ width: "400px", margin: "auto " }}
        />
        <h2 className="text-xl font-semibold mb-4 text-center mt-4">Sign Up</h2>
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
            />
            {userData.password && ( // Only render the eye icon if password has a value
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleInputChange}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
              isSigningUp ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isSigningUp} // Add the 'disabled' attribute based on the state
          >
            {isSigningUp ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          By continuing, you agree to the{" "}
          <Link to="/termsofservices" className="text-blue-700">
            Terms and Conditions
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
