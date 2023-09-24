import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const UserPostsPage = () => {
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
    const navigate= useNavigate();
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userId) {
          return;
        }

        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user-posts/${userId}`);
        setUserPosts(response.data);
        setIsLoading(false); // Turn off loading animation
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
    const fetchUserName = async () => {
        try {
          const userResponse = await axios.get(`https://recipe-backend-1e02.onrender.com/author/${userId}`);
          setUserName(userResponse.data.name);
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };

    fetchUserPosts();
    fetchUserName();
  }, [userId]);

  return (
    <div className="p-4">
        <div className="mb-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        </div>
      <h2 className="text-xl font-semibold mb-4"><span className='font-bold text-blue-800 text-2xl'>{userName} </span>'s Posts</h2>
      {isLoading ? (
        <p>Loading...</p> // Show loading animation
      ) : userPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userPosts.map(post => (
            <div key={post._id} className="border p-4 rounded-lg bg-white shadow-md">
              <Link to={`/post-details/${post._id}`}>
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
                  alt={post.title}
                  className="max-w-full h-40 object-cover mb-2"
                />
              </Link>
              <Link to={`/post-details/${post._id}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
              <div className="flex items-center mt-2">
                <i className='fas fa-heart text-red-700 mx-1'></i>
                <span>{post.likes.length}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPostsPage;
