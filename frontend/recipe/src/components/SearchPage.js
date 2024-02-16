// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaSearch } from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';
import defaultimg from './defaultimg.jpg';
import SearchResults from './SearchResults'; // Assuming you put the refactored code in a separate file

// The main component
const SearchPage = ({ loggedInUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchType, setSearchType] = useState('recipes');
  const [recommendedPostsLoading, setRecommendedPostsLoading] = useState(true);
  const navigate = useNavigate();

  // State to store the number of recipe posts for each user
  const [recipeCounts, setRecipeCounts] = useState({});

  // State for recommended posts
  const [recommendedPosts, setRecommendedPosts] = useState([]);

  // Function to fetch search results
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

    // Function to fetch user search results and recipe counts
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

    // Function to fetch recipe count for a specific user
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

    // Function to fetch recommended posts
    const fetchRecommendedPosts = async () => {
      try {
        setRecommendedPostsLoading(true);
        let recommendedPostsData = sessionStorage.getItem('recommendedPosts');
    
        // Check if recommended posts data exists in sessionStorage
        if (recommendedPostsData) {
          recommendedPostsData = JSON.parse(recommendedPostsData);
          setRecommendedPosts(recommendedPostsData);
        } else {
          // If not found in sessionStorage, fetch from localhost:5000
          const response = await axios.get('https://recipe-backend-1e02.onrender.com/api/posts');
    
          // Get a random subset of posts (adjust the count based on your preference)
          const recommendedPostsSubset = getRandomSubset(response.data, 5);
    
          setRecommendedPosts(recommendedPostsSubset);
    
          // Store the fetched recommended posts in sessionStorage
          sessionStorage.setItem('recommendedPosts', JSON.stringify(recommendedPostsSubset));
        }
      } catch (error) {
        console.error('Error fetching recommended posts:', error);
      } finally {
        setRecommendedPostsLoading(false);
      }
    };
    
    // Function to get a random subset of an array
    const getRandomSubset = (array, count) => {
      const shuffledArray = array.sort(() => 0.5 - Math.random());
      return shuffledArray.slice(0, count);
    };

    // Call the fetch functions
    fetchSearchResults();
    fetchUserSearchResults();
    fetchRecommendedPosts(); // Call the function to fetch recommended posts
  }, [searchQuery, selectedCategory, searchType]);

  // Event handler for radio button change
  const handleRadioChange = (event) => {
    setSearchType(event.target.value);
  };

  // Event handler for category filter change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Event handler for profile click
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
      <div className="mb-4">
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className='px-2 py-1 bg-gray-200 ml-2 rounded-xl'
        >
          <option value="">All</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Snacks">Snacks</option>
        </select>
      </div>
      <hr />

      {/* Render search results using the SearchResults component */}
      <SearchResults
        loading={loading}
        searchType={searchType}
        searchQuery={searchQuery}
        userSearchResults={userSearchResults}
        searchResults={searchResults}
        handleProfileClick={handleProfileClick}
        recipeCounts={recipeCounts}
      />

<h2 className="text-xl font-semibold mb-2">Recommended Posts</h2>
<div className="mb-4 overflow-x-auto p-2 scrollbar-hidden">
  
  {recommendedPostsLoading ? (
    // Show loading spinner while fetching recommended posts
    <div className="loading-container">
      <PulseLoader color="#007BFF" size={10} />
    </div>
  ) : (
    <div className="flex space-x-2">
      {recommendedPosts.map((post) => (
        <div
          key={post._id}
          className="flex-none border p-4 rounded-lg bg-gray-100 custom-shadow"
          style={{ width: '250px' }}
        >
          <p className="text-gray-700 flex">
            <img
              src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${post.userId}`}
              alt=""
              className="max-w-full max-h-full object-cover mr-2"
              style={{ height: '30px', width: '30px', borderRadius: '50%' }}
              onError={(e) => {
                e.target.src = defaultimg;
              }}
            />
            <strong>{post.authorName}</strong>
          </p>
          <div className="w-full h-100 mt-2">
            <Link to={`/post-details/${post._id}`}>
              <img
                src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
                alt={post.title}
                className="max-w-full max-h-full object-cover rounded"
                style={{ width: '100%', height: '150px' }}
              />
              <div className="flex justify-between items-center mt-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <div className="flex items-center bg-gray-300 p-1 rounded-full">
                  <FaHeart className="text-red-700" />
                  <p className="font-bold ml-2">{post.likes.length}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
};

export default SearchPage;
