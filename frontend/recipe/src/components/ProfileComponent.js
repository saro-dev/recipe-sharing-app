import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import { FaInfoCircle, FaStar } from 'react-icons/fa';
import BadgeDescriptionModal from './BadgeDescriptionModal';
import EditProfileModal from './EditProfileModal';
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
  const [editingBio, setEditingBio] = useState(false); // Add state for editing bio
  const [updatedBio, setUpdatedBio] = useState('');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State to store the profile image
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false); // Modal for profile image preview


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}`);
        setUserData(response.data);
        setUpdatedName(response.data.name);
        setUpdatedBio(response.data.bio); // Set the initial value for the updated name
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


  // Function to open the info modal
  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  // Function to close the info modal
  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const handleProfileImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', profileImage);

    try {
      // Upload the profile image
      const response = await axios.post(`https://recipe-backend-1e02.onrender.com/api/uploadProfileImage/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the user data with the new profile image URL
      setUserData({ ...userData, profileImage: response.data.profileImage });
      console.log("uploaded!!")

      // Close the modal
      setIsProfileImageModalOpen(false);
    } catch (error) {
      console.error('Error uploading profile image:', error.response.data); // Log the error
      // You can also display an error message to the user
      // Example: setErrorMessage('Error uploading profile image');
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
  const openEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };

  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };
  const handleSaveProfileChanges = async (updatedName, updatedBio) => {
    try {
      // Update the name and bio in the database
      await axios.patch(`https://recipe-backend-1e02.onrender.com/api/user/${userId}`, {
        name: updatedName,
        bio: updatedBio,
      });
      // Update the local state with the changes
      setUserData((prevUserData) => ({
        ...prevUserData,
        name: updatedName,
        bio: updatedBio,
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
            <div className="bg-blue-100 p-2 rounded">
              
              <div className="flex items-center justify-center">
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${userId}`}
                  alt="Profile"
                  className="max-w-full max-h-full object-cover "
                  style={{ height: '100px', width: '100px', borderRadius:'50%' }}
                />
              </div>
              <label
                htmlFor="profile-image-upload"
                className="text-blue-500 cursor-pointer block mt-2 text-center"
              >
                Change Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                id="profile-image-upload"
                className="sr-only"
              />

              </div>
            <div className='bg-blue-100 p-2 rounded'>
              <div className="mb-2 flex">
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

              <div className="mt-4">
                <p className="text-lg font-semibold mb-2">Bio:</p>
                <p>{userData.bio}</p>

              </div>
            </div>
            
            <p className="mt-1">Email: {userData.email}</p>
            <p className="mt-1">Recipe Posts: {recipeCount}</p>
            <p className="mt-1">Followers: {followersCount}</p>


            <div className='flex justify-around'>
              <Link to="/myposts" className="flex items-center mt-4 text-gray-600 font-bold bg-blue-300 p-2 rounded">
                My Posts
              </Link>
              <button className="text-yellow-600 mt-4 ml-4 hover:underline bg-yellow-100 p-2 rounded">
                <Link to={`/favourites/${userId}`} className="flex items-center text-yellow-600 hover:underline">
                  <FaStar className="mr-1" />
                  View Favorites
                </Link>
              </button>
            </div>

            <br></br>
            <div className='flex justify-between'>
              <button
                className="mt-10 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="mt-10 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={openEditProfileModal}
              >
                Edit Profile
              </button>
            </div>
            <EditProfileModal
              isOpen={isEditProfileModalOpen}
              onClose={closeEditProfileModal}
              userData={userData}
              onSave={handleSaveProfileChanges} // Define this function to handle saving changes
            />

          </div>
        ) : (
          <div>
            <div className="mb-4 animate-pulse">
              <div className="bg-gray-200 h-6 w-2/3 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded-lg"></div>
            </div>
            <div className="mb-4 flex animate-pulse">
              <div className="bg-gray-200 h-6 w-1/3 rounded-lg mr-2"></div>
              <div className="bg-gray-200 h-4 w-1/4 rounded-lg"></div>
            </div>
          </div>
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
