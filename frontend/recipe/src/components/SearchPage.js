import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';

const SearchPage = ({ loggedInUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (searchQuery.trim() === '') {
          setSearchResults([]);
          return;
        }

        setLoading(true);
        const response = await axios.get(
          `https://recipe-dbs.vercel.app/api/search?q=${searchQuery}&category=${selectedCategory}`
        );
        setSearchResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Search Any Recipe...</h2>
      <div className="mb-4 search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by title"
          className="border p-2 rounded w-full"
        />
        <button className="search-button">
          <FaSearch size={20} />
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Filter by Category:</label>
        <select
          name="category"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="w-full border rounded p-2 appearance-none"
        >
          <option value="">All Categories</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          {/* Add more categories here if needed */}
        </select>
      </div>
      <div className="search-results">
        {loading ? (
          <div className="loading-container">
            <PulseLoader color="#007BFF" size={10} />
          </div>
        ) : (
          searchResults.map((post) => (
            <div key={post._id} className="border p-4 mb-4 rounded-lg bg-gray-100 custom-shadow">
              <p className="text-gray-500 flex">
          <img
            src={`https://recipe-dbs.vercel.app/api/getProfileImage/${post.userId._id}`}
            alt=""
            className="max-w-full max-h-full object-cover mr-2"
            style={{ height: '30px', width: '30px', borderRadius: '50%' }}
          /> 
            <strong>{post.authorName}</strong>
            </p>

              <div className="w-100 h-100 mt-2">
                <Link to={`/post-details/${post._id}`}>
                  <img
                    src={`https://recipe-dbs.vercel.app/api/getRecipeImage/${post._id}`}
                    alt={post.title}
                    className="max-w-full max-h-full object-cover"
                    style={{ maxWidth: '150px' }}
                  />
                  <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
                </Link>
              </div>
            </div>
          ))
        )}
        {searchResults.length === 0 && !loading && (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
