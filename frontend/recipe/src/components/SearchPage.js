import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';
import defaultimg from './defaultimg.jpg';

const SearchPage = ({ loggedInUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchType, setSearchType] = useState('recipes');
  const navigate = useNavigate();

  // State to store the number of recipe posts for each user
  const [recipeCounts, setRecipeCounts] = useState({});

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (searchQuery.trim() === '') {
          setSearchResults([]);
          return;
        }
        setLoading(true);
        const response = await axios.get(
          `https://recipe-backend-1e02.onrender.com/api/search?q=${searchQuery}&category=${selectedCategory}&type=${searchType}`
        );
        setSearchResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    const fetchUserSearchResults = async () => {
      try {
        if (searchQuery.trim() === '') {
          setUserSearchResults([]);
          return;
        }
        setLoading(true);
        const response = await axios.get(
          `https://recipe-backend-1e02.onrender.com/api/searchUsers?q=${searchQuery}`
        );
        setUserSearchResults(response.data);
        setLoading(false);
        // Fetch recipe counts for each user
        response.data.forEach((user) => {
          fetchRecipeCount(user._id);
        });
      } catch (error) {
        console.error('Error fetching user search results:', error);
        setLoading(false);
      }
    };

    const fetchRecipeCount = async (userId) => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/recipe/count/${userId}`);
        setRecipeCounts((prevCounts) => ({
          ...prevCounts,
          [userId]: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching recipe count:', error);
      }
    };

    fetchSearchResults();
    fetchUserSearchResults();
  }, [searchQuery, selectedCategory, searchType]);

  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleProfileClick = (userId) => {
    if (loggedInUser && loggedInUser._id === userId) {
      // If the user is the logged-in user, navigate to their own profile
      navigate('/profile');
    } else {
      // If the user is not the logged-in user, navigate to the user's profile
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Search Any Recipe or User...</h2>
      <div className="mb-4 search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by title or user"
          className="border p-2 rounded w-full"
        />
        <button className="search-button">
          <FaSearch size={20} />
        </button>
      </div>
      {/* Radio Buttons for Filtering */}
      <div className="mb-4 radio-container">
        <label
          className={`radio-label ${searchType === 'recipes' ? 'checked-label' : ''}`}
          htmlFor="reciperadio"
          id="recipelabel"
        >
          Recipes
        </label>
        <input
          type="radio"
          value="recipes"
          checked={searchType === 'recipes'}
          onChange={handleRadioChange}
          id="reciperadio"
          className="radio-input"
        />
        <label
          className={`radio-label ${searchType === 'users' ? 'checked-label' : ''}`}
          htmlFor="userradio"
          id="userlabel"
        >
          Users
        </label>
        <input
          type="radio"
          value="users"
          checked={searchType === 'users'}
          onChange={handleRadioChange}
          id="userradio"
          className="radio-input"
        />
      </div>

      {/* User Search Section */}
      <div className="search-results">
        {loading ? (
          <div className="loading-container">
            <PulseLoader color="#007BFF" size={10} />
          </div>
         ) : searchType === 'users' ? (
          searchQuery.trim() === '' ? (
            <p>Enter a search query to find users.</p>
          ) : userSearchResults.length === 0 ? (
            <p>No results found for users.</p>
          ) : (
          userSearchResults.map((user) => (
            <div key={user._id} className="cursor-pointer border p-4 mb-4 rounded-lg bg-gray-100 custom-shadow" onClick={() => handleProfileClick(user._id)}>
              <p className="text-black flex">
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${user._id}`}
                  alt=""
                  className="max-w-full max-h-full object-cover mr-2"
                  style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.src = defaultimg;
                  }}
                />
                <strong>{user.name}</strong>
              </p>
              
              <p className='ml-10'>{recipeCounts[user._id] || 0} posts</p>
            </div>
          )))
        ) :(
          searchQuery.trim() === '' ? (
            <p className='text-l mt-2 ml-2'>Enter a search query to find recipes.</p>
          ) : searchResults.length === 0 ? (
            <p>No results found for recipes.</p>
          ) : (
          // Recipe Search Section
          searchResults.map((post) => (
            <div key={post._id} className="border p-4 mb-4 rounded-lg bg-gray-100 custom-shadow">
              <p className="text-gray-500 flex">
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${post.userId._id}`}
                  alt=""
                  className="max-w-full max-h-full object-cover mr-2"
                  style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.src = defaultimg;
                  }}
                />
                <strong>{post.authorName}</strong>
              </p>
              <div className="w-100 h-100 mt-2">
                <Link to={`/post-details/${post._id}`}>
                  <img
                    src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
                    alt={post.title}
                    className="max-w-full max-h-full object-cover"
                    style={{ maxWidth: '150px' }}
                  />
                  <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
                </Link>
              </div>
            </div>
          )))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
