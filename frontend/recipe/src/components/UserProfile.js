import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BadgeDescriptionModal from "./BadgeDescriptionModal";
import ironIcon from "../iron.png";
import bronzeIcon from "../bronze.png";
import silverIcon from "../silver.png";
import goldIcon from "../gold.png";
import defaultimg from "./defaultimg.jpg";
import axios from "axios";
import "./termsofservices.css";

const UserProfile = ({ loggedInUser }) => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUnfollow, setLoadingUnfollow] = useState(false);
  const [userFollowers, setUserFollowers] = useState([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [isFollowing, setIsFollowing] = useState(false); // New state to manage follow status

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous route
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://recipe-backend-1e02.onrender.com/api/user/${userId}`
        );
        setUserData(response.data);
        setFollowerCount(response.data.followers.length);
        setRecipeCount(response.data.recipeCount);
        setBio(response.data.bio);

        // Check if the logged-in user is among the followers
        setIsFollowing(response.data.followers.some(
          (follower) => follower._id === loggedInUser._id
        ));

        try {
          const countResponse = await axios.get(
            `https://recipe-backend-1e02.onrender.com/api/recipe/count/${userId}`
          );
          setRecipeCount(countResponse.data.count);
        } catch (error) {
          console.error("Error fetching recipe count:", error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, loggedInUser]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(
          `https://recipe-backend-1e02.onrender.comm/api/user/${userId}/followers`
        );
        setUserFollowers(response.data.followers);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [userId]);

  const handleFollow = async () => {
    if (loadingFollow) return;
    setLoadingFollow(true);
  
    try {
      await axios.post(`https://recipe-backend-1e02.onrender.com/api/user/${userId}/follow`, {
        followerId: loggedInUser._id,
      });
      setUserFollowers((prevFollowers) => [...prevFollowers, loggedInUser]);
      setFollowerCount((prevCount) => prevCount + 1);
      setIsFollowing(true); // Update follow state
  
      // Send notification to the user being followed
      const notificationMessage = `${loggedInUser.name} follows you`;
      const notification = {
        type: 'follow',
        message: notificationMessage,
        isRead: false,
        createdAt: new Date(),
        userId: userId, // Assuming userId is the id of the user being followed
      };
  
      const notificationResponse = await axios.post(
        `https://recipe-backend-1e02.onrender.com/api/addNotification/${userId}`,
        {
          notification,
        }
      );
  
      console.log('Notification sent:', notificationResponse.data);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setLoadingFollow(false);
    }
  };
  

  const handleUnfollow = async () => {
    if (loadingUnfollow) return;
    setLoadingUnfollow(true);

    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/user/${userId}/unfollow`, {
        data: { followerId: loggedInUser._id },
      });
      setUserFollowers((prevFollowers) =>
        prevFollowers.filter((follower) => follower._id !== loggedInUser._id)
      );
      setFollowerCount((prevCount) => prevCount - 1);
      setIsFollowing(false); // Update follow state
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setLoadingUnfollow(false);
    }
  };

  const openBadgeModal = () => {
    setIsBadgeModalOpen(true);
  };

  const closeBadgeModal = () => {
    setIsBadgeModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center" style={{ flexDirection: 'column' }}>
      <div className="back-nav my-1" onClick={handleGoBack} style={{ position: 'absolute', top: '20px', left: '10px' }}>
        &#x2190; Back
      </div>
      <div className="p-4 ">
        <div className="bg-white p-6 rounded-lg custom-shadow w-full sm:w-96">
          {userData ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-underline">
                Profile
              </h2>
              <div className="mb-4">
                <div className="flex">
                  <img
                    src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${userData._id}`}
                    alt=""
                    className="max-w-full max-h-full object-cover mr-2"
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      e.target.src = defaultimg;
                    }}
                  />
                  <p className="text-lg font-semibold mr-2 mt-2">
                    {userData.name}
                  </p>
                  <button
                    className="text-blue-600  block hover:underline"
                    onClick={openBadgeModal}
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
                </div>
                <hr className="mt-3"></hr>
                <div className=" px-1 py-2 my-2 rounded text-left">
                  <h5 className="font-bold text-purple-900 mb-1">About</h5>
                  <p>{bio}</p>
                </div>
                <BadgeDescriptionModal
                  isOpen={isBadgeModalOpen}
                  onClose={closeBadgeModal}
                  recipeCount={recipeCount}
                />

                <div className="flex ">
                  <p className="mt-1 text-center ml-5 mr-10">
                    <span className="text-2xl font-bold text-center mr-5">
                      {followerCount}
                    </span>{" "}
                    <br></br> Followers
                  </p>
                  <p className="mt-1 text-center ">
                    <span className="text-2xl font-bold text-center">
                      {recipeCount}
                    </span>{" "}
                    <br></br> Posts
                  </p>
                </div>
                <Link
                  to={`/user-posts/${userId}`}
                  className="text-purple-900 border-purple-900 border-2 px-2 py-2 rounded font-bold mr-5 mt-2"
                >
                  View Posts
                </Link>
                {isFollowing ? (
                  <button
                    onClick={handleUnfollow}
                    className={`ml-2 mt-2 bg-red-500 text-white px-4 py-2 rounded ${
                      loadingUnfollow ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`ml-2 mt-2 bg-purple-900 text-white px-4 py-2 rounded ${
                      loadingFollow ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{width:"100%"}}>
          {Array.from({ length: 1 }).map((_, index) => (
            <div key={index} className="post-item skeleton-loading" style={{width:"290px"}}>
              <div className="w-full h-40 mb-4 bg-gray-300 rounded-lg text-center flex justify-center items-center text-xl text-gray-500" >loading..</div> {/* Placeholder image */}
              <h3 className="text-lg font-semibold mb-2 bg-gray-300 h-8 rounded"></h3> {/* Placeholder heading */}
              <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
              <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
              <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
            </div>
          ))}
        </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
