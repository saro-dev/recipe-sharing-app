import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BadgeDescriptionModal from './BadgeDescriptionModal';
import ironIcon from '../iron.png';
import bronzeIcon from '../bronze.png';
import silverIcon from '../silver.png';
import goldIcon from '../gold.png';
import defaultimg from './defaultimg.jpg';
import axios from 'axios';

const UserProfile = ({ loggedInUser }) => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUnfollow, setLoadingUnfollow] = useState(false);
  const [userFollowers, setUserFollowers] = useState([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [bio, setBio] =useState("")


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}`);
        setUserData(response.data);
        setFollowerCount(response.data.followers.length);
        setRecipeCount(response.data.recipeCount); // Assuming you have a field for recipe count
        setBio(response.data.bio);
        // Move the fetchRecipeCount logic here
        try {
          const countResponse = await axios.get(`https://recipe-backend-1e02.onrender.com/api/recipe/count/${userId}`);
          setRecipeCount(countResponse.data.count);
        } catch (error) {
          console.error('Error fetching recipe count:', error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}/followers`);
        setUserFollowers(response.data.followers);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [userId]);

  const handleFollow = async () => {
    if (loadingFollow) return;
    setLoadingFollow(true);

    try {
      await axios.post(`https://recipe-backend-1e02.onrender.com/api/user/${userId}/follow`, { followerId: loggedInUser._id });
      setUserFollowers(prevFollowers => [...prevFollowers, loggedInUser]); // Add logged-in user to followers list
      setFollowerCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (loadingUnfollow) return;
    setLoadingUnfollow(true);

    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/user/${userId}/unfollow`, { data: { followerId: loggedInUser._id } });
      setUserFollowers(prevFollowers => prevFollowers.filter(follower => follower._id !== loggedInUser._id)); // Remove logged-in user from followers list
      setFollowerCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingUnfollow(false);
    }
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
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg custom-shadow w-full sm:w-96">
        {userData ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-underline">Profile</h2>
            <div className="mb-4">
              <div className='flex'>
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${userData._id}`}
                  alt=""
                  className="max-w-full max-h-full object-cover mr-2"
                  style={{ height: '60px', width: '60px', borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.src = defaultimg; // Replace with the URL of your default image
                  }}
                />
                <p className="text-lg font-semibold mr-2 mt-2">
                  {userData.name}
                </p>
                <button
                  className="text-blue-600  block hover:underline"
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
              </div>
              <hr className='mt-3'></hr>
              <div className=' px-1 py-2 my-2 rounded text-left'>
                <h5 className='font-bold text-purple-900 mb-1'>About</h5>
              <p>{bio}</p>
              </div>
              <BadgeDescriptionModal
                isOpen={isBadgeModalOpen}
                onClose={closeBadgeModal}
                recipeCount={recipeCount} // Pass recipeCount as needed
              />

              <div className='flex '>
                <p className="mt-1 text-center ml-5 mr-10"><span className='text-2xl font-bold text-center mr-5'>{followerCount}</span> <br></br> Followers</p>
                <p className="mt-1 text-center "><span className='text-2xl font-bold text-center'>{recipeCount}</span> <br></br> Posts</p>
              </div>
              <Link to={`/user-posts/${userId}`} className="text-purple-900 border-purple-900 border-2 px-2 py-2 rounded font-bold mr-5 mt-2">
                View Posts
              </Link>
              {userFollowers.some(follower => follower._id === loggedInUser._id) ? (
                <button
                  onClick={handleUnfollow}
                  className={`ml-2 mt-2 bg-red-500 text-white px-4 py-2 rounded ${loadingUnfollow ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`ml-2 mt-2 bg-purple-900 text-white px-4 py-2 rounded ${loadingFollow ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
