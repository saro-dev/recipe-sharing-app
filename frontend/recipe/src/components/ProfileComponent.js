import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import { FaInfoCircle, FaStar, FaHome } from 'react-icons/fa';
import BadgeDescriptionModal from './BadgeDescriptionModal';
import two from './two.jpg'
import ironIcon from '../iron.png';
import bronzeIcon from '../bronze.png';
import silverIcon from '../silver.png';
import goldIcon from '../gold.png';
import '../App.css';

const ProfileComponent = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [recipeCount, setRecipeCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}`);
        setUserData(response.data);
        setUpdatedName(response.data.name); // Set the initial value for the updated name
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const fetchFollowersCount = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}/follower-count`);
        setFollowersCount(response.data.count);
      } catch (error) {
        console.error('Error fetching followers count:', error);
      }
    };

    const fetchRecipeCount = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/recipe/count/${userId}`);
        setRecipeCount(response.data.count);
      } catch (error) {
        console.error('Error fetching recipe count:', error);
      }
    };

    fetchUserData();
    fetchFollowersCount(); 
    fetchRecipeCount();
  }, [userId]);
    
  const handleEditName = () => {
    setEditingName(true);
  };
  // Function to open the info modal
  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  // Function to close the info modal
  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setUpdatedName(userData.name); // Reset the updated name to the original name
  };

  const handleSaveEdit = async () => {
    try {
      // Update the name in the database
      await axios.patch(`https://recipe-backend-1e02.onrender.com/api/user/${userId}`, { name: updatedName });
      setUserData(prevUserData => ({ ...prevUserData, name: updatedName }));
      setEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };
  //logout
  const handleLogout = () => {
    setConfirmLogout(true);
  };
  const confirmLogoutAction = () => {
    // Clear the local storage and redirect to the login page
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  };

  const cancelLogoutAction = () => {
    // Close the confirmation dialog
    setConfirmLogout(false);
  };
// Function to open the badge description modal
const openBadgeModal = () => {
  setIsBadgeModalOpen(true);
};

// Function to close the badge description modal
const closeBadgeModal = () => {
  setIsBadgeModalOpen(false);
};

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center ">
      <div className="bg-white p-6 rounded-lg custom-shadow w-full sm:w-96">
      <div className="flex justify-end">
          <FaInfoCircle
            className="text-blue-500 cursor-pointer"
            size={20}
            onClick={openInfoModal}
          />
        </div>
        {userData ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-underline">Profile</h2>
            <div className="mb-4 flex">
              <p className="text-lg font-semibold mr-3">Name: {userData.name} </p>
              <button
                className="text-blue-600 mt-1 block hover:underline"
                onClick={openBadgeModal} // Open the badge description modal
              >
                {recipeCount >= 0 && recipeCount <= 25 && (
                  <img src={ironIcon} alt="Iron Icon" className="inline-block w-6 h-auto mr-2" />
                )}
                {recipeCount >= 26 && recipeCount <= 50 && (
                  <img src={bronzeIcon} alt="Bronze Icon" className="inline-block w-6 h-auto mr-2" />
                )}
                {recipeCount >= 51 && recipeCount <= 75 && (
                  <img src={silverIcon} alt="Silver Icon" className="inline-block w-6 h-auto mr-2" />
                )}
                {recipeCount >= 76 && recipeCount <= 100 && (
                  <img src={goldIcon} alt="Gold Icon" className="inline-block w-6 h-auto mr-2" />
                )}
                
              </button>
              <BadgeDescriptionModal
        isOpen={isBadgeModalOpen}
        onClose={closeBadgeModal}
        recipeCount={recipeCount} // Pass recipeCount as needed
      />
            </div>
            {editingName ? (
                <div className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    value={updatedName}
                    onChange={e => setUpdatedName(e.target.value)}
                    className="border rounded py-1 w-9/12 px-2 flex-grow focus:outline-none focus:border-blue-400"
                  />
                  <button
                    className="bg-green-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 py-1 px-2 rounded hover:bg-gray-400"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="text-blue-600 mt-1 block hover:underline"
                  onClick={handleEditName}
                >
                  Edit<i className='fas fa-edit ml-2'></i>
                </button>
              )}
            <p className="mt-1">Email: {userData.email}</p>
            <p className="mt-1">Recipe Posts: {recipeCount}</p>
            <p className="mt-1">Followers: {followersCount}</p>
            
            <Link to="/" className="flex items-center text-blue-900 mt-4 mb-4 hover:underline">
              <FaHome className="mr-1 text-blue-900 cursor-pointer" size={20} />
              Go to Homepage
            </Link>
            <Link to="/myposts" className="text-gray-600 font-bold">
                My Posts
            </Link>
            <br></br>
            <button className="text-yellow-600 mt-4 block hover:underline">
            <Link to={`/favourites/${userId}`} className="flex items-center text-yellow-600 mt-4 hover:underline">
                <FaStar className="mr-1" />
                View Favorites
            </Link>
            </button>
            <br></br>
            <button
              className="mt-10 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <Modal isOpen={isInfoModalOpen} onRequestClose={closeInfoModal}>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Developer Information</h2>
          <div className="w-20 mx-auto flex justify-center h-auto">
            <img
              className="flex rounded-full my-3"
              src={two}
              alt="Saravanan"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <h4 className='mb-1'>Developer: Saravanan</h4>
          <p className='mb-1'>Email: <a href="mailto:codersaro@gmail.com" className='text-blue-600'>codersaro@gmail.com</a></p>
          <p>Website: <a className='text-blue-600' href="https://saravanan.me" target="_blank" rel="noopener noreferrer">saravanan.me</a></p>
        </div>
      </Modal>
      {confirmLogout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg custom-shadow w-96">
            <p className="text-xl font-semibold mb-4">Confirm Logout</p>
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
                onClick={confirmLogoutAction}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                onClick={cancelLogoutAction}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
