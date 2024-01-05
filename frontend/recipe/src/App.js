import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaUser, FaBell } from 'react-icons/fa';
import SignupComponent from './components/SignupComponent';
import LoginComponent from './components/LoginComponent';
import RecipePostComponent from './components/RecipePostComponent';
import ProfileComponent from './components/ProfileComponent';
import PostsPage from './components/PostsPage';
import MyPostsPage from './components/MyPostsPage';
import PostDetails from './components/PostDetails'; 
import SearchPage from './components/SearchPage';
import Alert from './components/Alert';
import Notifications from './components/Notifications';
import UserProfile from './components/UserProfile';
import './App.css';
import FavouritesPage from './components/FavouritesPage';
import UserPostsPage from './components/UserPostsPage';
import ForgotPasswordComponent from './components/ForgotPasswordComponent';
import PasswordResetComponent from './components/PasswordResetComponent';
import LandingPage from './components/LandingPage';
import NotFound404 from './components/NotFound404';
import axios from 'axios';
import splash from './splash.png';
import TermsOfService from './components/TermsOfService';

const Splash = () => {
  return (
    <div className="splash">
      <img src={splash} alt="Splash" />
    </div>
  );
};



const App = () => {
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [loggedInUser, setLoggedInUser] = useState(storedUser);
  const [alert, setAlert] = useState(null); 
  const [showSplash, setShowSplash] = useState(true);
  const [favoritePosts, setFavoritePosts] = useState([]);


  const handleSignupSuccess = userData => {
    setLoggedInUser(userData);
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    setAlert({ type: 'success', message: 'Signup successful!' });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleLoginSuccess = userData => {
    setLoggedInUser(userData);
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    setAlert({ type: 'success', message: 'Login successful!' });
    setTimeout(() => {
      setAlert(null);
    }, 3000);

  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
  <Router>
    {showSplash ? (
      <Splash />
    ) : (
      <div className="all">
        <div className='flex justify-center '>
          {alert && <Alert type={alert.type} message={alert.message} />}
        </div>
        <Routes>
          <Route path="/signup" element={<SignupComponent onSignupSuccess={handleSignupSuccess} />} />
          <Route path="/login" element={<LoginComponent onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPasswordComponent loggedInUser={loggedInUser}/>} />
          <Route path="/password-reset/:token" element={<PasswordResetComponent />} />
          <Route path="/termsofservices" element={<TermsOfService />} />
  
          {/* Add the route for post details */}
          
          {loggedInUser ? (
            <>
            <Route path="/" element={<PostsPage loggedInUser={loggedInUser}  favoritePosts={favoritePosts} setFavoritePosts={setFavoritePosts}/>} />
              <Route path="/profile" element={<ProfileComponent userId={loggedInUser._id} />} />
              <Route path="/post" element={<RecipePostComponent userId={loggedInUser._id} />} />
              <Route path="/myposts" element={<MyPostsPage userId={loggedInUser._id} />} />
              
              <Route path="/search" element={<SearchPage loggedInUser={loggedInUser} />} />
              <Route path="/favourites/:userId" element={<FavouritesPage />} />
              <Route path="/user/:userId" element={<UserProfile loggedInUser={loggedInUser} />}/>
              <Route path="/user-posts/:userId" element={<UserPostsPage userId={loggedInUser._id}/>} />
              <Route path="/notifications" element={<Notifications loggedInUser={loggedInUser} userId={loggedInUser._id}/>} />
              
            </>
          ) : (
            <Route path="/" element={<LandingPage />} />
          )}
          <Route path="/post-details/:postId" element={<PostDetails loggedInUser={loggedInUser} />} />
           <Route path="*" element={<NotFound404 />} />
        </Routes>
      </div>
    )}

    {loggedInUser && (
      <div className='mt-10 overflow-x-hidden '>
        <nav className="fixed bottom-0 left-0 w-full bg-blue-200 shadow-md ">
          <ul className="flex justify-evenly mb-5 mt-3">
            <li >
              <Link to="/" className="text-gray-900 ">
                <FaHome size={25} />
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-gray-900">
                <FaSearch size={25} />
              </Link>
            </li>
            <li>
              <Link to="/post" className="text-gray-900">
                <FaPlus size={25} />
              </Link>
            </li>
            <li>
              <Link to="/notifications" className="text-gray-900">
                <FaBell size={25} />
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-900 ">
                <FaUser size={25} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    )}
  </Router>
);

};

export default App;
