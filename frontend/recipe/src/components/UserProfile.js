import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const UserProfile = ({ loggedInUser }) => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUnfollow, setLoadingUnfollow] = useState(false);
  const [userFollowers, setUserFollowers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUserData(response.data);
        setFollowerCount(response.data.followers.length);
        setFollowingCount(response.data.following.length);
        setRecipeCount(response.data.recipeCount); // Assuming you have a field for recipe count
        // Move the fetchRecipeCount logic here
        try {
            const countResponse = await axios.get(`http://localhost:5000/api/recipe/count/${userId}`);
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
        const response = await axios.get(`http://localhost:5000/api/user/${userId}/followers`);
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
      await axios.post(`http://localhost:5000/api/user/${userId}/follow`, { followerId: loggedInUser._id });
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
      await axios.delete(`http://localhost:5000/api/user/${userId}/unfollow`, { data: { followerId: loggedInUser._id } });
      setUserFollowers(prevFollowers => prevFollowers.filter(follower => follower._id !== loggedInUser._id)); // Remove logged-in user from followers list
      setFollowerCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingUnfollow(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg custom-shadow w-full sm:w-96">
        {userData ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-underline">Profile</h2>
            <div className="mb-4">
              <p className="text-lg font-semibold">
                Name: {userData.name}
                <i className="fas fa-check-circle text-green-500 ml-1"></i>
              </p>
              <p className="mt-1">Followers: {followerCount}</p>
              <p className="mt-1">Recipe Posts: {recipeCount}</p>
              <Link to={`/user-posts/${userId}`} className="text-blue-700 border-blue-700 border-2 px-2 py-2 rounded font-bold hover:underline">
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
                  className={`ml-2 mt-2 bg-blue-500 text-white px-4 py-2 rounded ${loadingFollow ? 'opacity-50 cursor-not-allowed' : ''}`}
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
