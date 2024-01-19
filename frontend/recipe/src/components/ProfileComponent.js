import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import BadgeDescriptionModal from "./BadgeDescriptionModal";
import EditProfileModal from "./EditProfileModal";
import two from "./two.jpg";
import ironIcon from "../iron.png";
import bronzeIcon from "../bronze.png";
import silverIcon from "../silver.png";
import goldIcon from "../gold.png";
import defaultimg from "./defaultimg.jpg";
import "../App.css";

const ProfileComponent = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [recipeCount, setRecipeCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [updatedName, setUpdatedName] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [updatedBio, setUpdatedBio] = useState("");
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State to store the profile image
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchData = async () => {
    try {
      const [userDataResponse, followersCountResponse, recipeCountResponse] =
        await Promise.all([
          axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}`),
          axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}/follower-count`),
          axios.get(`https://recipe-backend-1e02.onrender.com/api/recipe/count/${userId}`),
        ]);

      setUserData(userDataResponse.data);
      setRecipeCount(recipeCountResponse.data.count);
      setFollowersCount(followersCountResponse.data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
    formData.append("image", profileImage);

    try {
      // Upload the profile image
      setUploadingProfileImage(true);
      const response = await axios.post(
        `https://recipe-backend-1e02.onrender.com/api/uploadProfileImage/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData({ ...userData, profileImage: response.data.profileImage });
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        window.location.reload();
      }, 1000);
      console.log("uploaded!!");
    } catch (error) {
      console.error("Error uploading profile image:", error.response.data); // Log the error
    } finally {
      setUploadingProfileImage(false);
    }
  };

  const removeProfileImage = async () => {
    try {
      await axios.delete(
        `https://recipe-backend-1e02.onrender.com/api/removeProfileImage/${userId}`
      );
      setUserData({ ...userData, profileImage: null });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  //logout
  const handleLogout = () => {
    setConfirmLogout(true);
  };
  const confirmLogoutAction = () => {
    // Clear the local storage and redirect to the login page
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
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
      if (updatedName.length > 15) {
        // Limit the name to 15 characters
        updatedName = updatedName.substring(0, 15);
      }
      if (updatedBio.length > 100) {
        // Limit the bio to 40 characters
        updatedBio = updatedBio.substring(0, 100);
      }
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
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen flex items-center justify-center ">
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
            <h2 className="text-xl font-semibold mb-4 text-underline">
              Profile
            </h2>
            <div className="bg-blue-100 p-2 rounded">
              <div className="flex items-center justify-center">
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${userData._id}`}
                  alt=""
                  className="max-w-full max-h-full object-cover mr-2"
                  style={{ height: "60px", width: "60px", borderRadius: "50%" }}
                  onError={(e) => {
                    e.target.src = defaultimg; // Replace with the URL of your default image
                  }}
                />
              </div>
              <label
                htmlFor="profile-image-upload"
                className="text-blue-500 font-bold cursor-pointer block mt-2 text-center"
                onClick={handleProfileImageUpload}
              >
                Change Profile
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                id="profile-image-upload"
                className="sr-only"
              />
              {userData.profileImage && (
                <button
                  className="text-red-600 cursor-pointer font-bold block mt-2 text-center mx-auto"
                  onClick={removeProfileImage}
                >
                  Remove Profile
                </button>
              )}
            </div>
            {uploadingProfileImage && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="absolute inset-0 bg-gray-200 opacity-75"></div>
                <div className="bg-white p-6 rounded-lg custom-shadow">
                  <p className="text-xl font-semibold mb-4">
                    Uploading Profile Image...
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              </div>
            )}
            {uploadSuccess && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="absolute inset-0 bg-gray-200 opacity-75"></div>
                <div className="bg-white p-6 rounded-lg custom-shadow">
                  <p className="text-xl font-semibold mb-4">
                    Upload Successful
                  </p>
                  <p>Your profile image has been uploaded.</p>
                </div>
              </div>
            )}
            <div className="bg-blue-100 p-2 rounded">
              <div className="mb-2 flex justify-center">
                <p className="text-2xl font-semibold mr-3 text-center ">
                  {userData.name}{" "}
                </p>
                <button
                  className="text-blue-600 mt-1 block hover:underline"
                  onClick={openBadgeModal} // Open the badge description modal
                >
                  {recipeCount >= 0 && recipeCount <= 25 && (
                    <img
                      src={ironIcon}
                      alt="Iron Icon"
                      className="inline-block w-6 h-auto mr-2"
                    />
                  )}
                  {recipeCount >= 26 && recipeCount <= 50 && (
                    <img
                      src={bronzeIcon}
                      alt="Bronze Icon"
                      className="inline-block w-6 h-auto mr-2"
                    />
                  )}
                  {recipeCount >= 51 && recipeCount <= 75 && (
                    <img
                      src={silverIcon}
                      alt="Silver Icon"
                      className="inline-block w-6 h-auto mr-2"
                    />
                  )}
                  {recipeCount >= 76 && recipeCount <= 100 && (
                    <img
                      src={goldIcon}
                      alt="Gold Icon"
                      className="inline-block w-6 h-auto mr-2"
                    />
                  )}
                </button>
                <BadgeDescriptionModal
                  isOpen={isBadgeModalOpen}
                  onClose={closeBadgeModal}
                  recipeCount={recipeCount} // Pass recipeCount as needed
                />
              </div>

              <div className="mt-4 flex justify-center">
                <pre style={{fontFamily:'ubuntu'}}>{userData.bio}</pre>
              </div>
            </div>

            <p className="mt-1 text-center">Email: {userData.email}</p>
            <div className="flex justify-between mx-10">
              <p className="mt-1 text-center">
                <strong className="text-2xl">{recipeCount}</strong> <br></br>{" "}
                Posts
              </p>
              <p className="mt-1 text-center">
                <strong className="text-2xl">{followersCount}</strong> <br></br>{" "}
                Followers
              </p>
            </div>

            <div className="flex justify-around">
              <Link
                to="/myposts"
                className="flex items-center mt-4 text-gray-600 font-bold bg-blue-300 p-2 rounded"
              >
                My Posts
              </Link>
              <button className="text-yellow-600 mt-4 ml-4  bg-yellow-100 p-2 rounded">
                <Link
                  to={`/favourites/${userId}`}
                  className="flex items-center text-yellow-600 "
                >
                  <FaStar className="mr-1" />
                  View Favorites
                </Link>
              </button>
            </div>

            <br></br>
            <div className="flex justify-between">
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
            <div className="mb-4 mt-2 animate-pulse">
              <div
                className="bg-blue-200 h-20 w-3/3 rounded-lg mb-2"
                style={{ height: "200px" }}
              ></div>
              <div className="bg-gray-200 h-20 w-1/2 rounded-lg"></div>
            </div>
            <div className="mb-4 flex animate-pulse">
              <div className="bg-gray-200 h-10 w-1/2 rounded-lg mr-2"></div>
              <div className="bg-gray-200 h-15 w-1/4 rounded-lg"></div>
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
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <h4 className="mb-1">Developer: Saravanan</h4>
          <p className="mb-1">
            Email:{" "}
            <a href="mailto:codersaro@gmail.com" className="text-blue-600">
              codersaro@gmail.com
            </a>
          </p>
          <p>
            Website:{" "}
            <a
              className="text-blue-600"
              href="https://saravanan.me"
              target="_blank"
              rel="noopener noreferrer"
            >
              saravanan.me
            </a>
          </p>
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
