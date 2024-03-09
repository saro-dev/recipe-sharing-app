import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const FavouritesPage = () => {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/favorite-posts/${userId}`);
        setFavoritePosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorite posts:', error);
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, [userId]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Favorite Posts</h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin h-8 w-8 mr-3 text-gray-600" />
          <p>Loading...</p>
        </div>
      ) : favoritePosts.length === 0 ? (
        <p>No favorite posts found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favoritePosts.map(post => (
            <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
              <Link to={`/post-details/${post._id}`} className="text-blue-500 hover:underline">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
                  alt={post.title}
                  className="max-w-full max-h-full object-cover rounded-lg skeleton-item"
                  style={{ height: '200px' }}
                />
              </Link>
              <p className="text-gray-600">{post.authorName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
