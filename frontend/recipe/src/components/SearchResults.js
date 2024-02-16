import React from 'react';
import { Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import defaultimg from './defaultimg.jpg';

const UserResult = ({ user, handleProfileClick, recipeCounts }) => (
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
);

const RecipeResult = ({ post }) => (
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
);

const SearchResults = ({ loading, searchType, searchQuery, userSearchResults, searchResults, handleProfileClick, recipeCounts }) => (
  <div className="search-results">
    {loading ? (
      <div className="loading-container">
        <PulseLoader color="#007BFF" size={10} />
      </div>
    ) : searchType === 'users' ? (
      searchQuery.trim() === '' ? (
        <p></p>
      ) : userSearchResults.length === 0 ? (
        <p>No results found for users.</p>
      ) : (
        userSearchResults.map((user) => (
          <UserResult key={user._id} user={user} handleProfileClick={handleProfileClick} recipeCounts={recipeCounts} />
        ))
      )
    ) : (
      searchQuery.trim() === '' ? (
        <p className='text-l mt-2 ml-2'></p>
      ) : searchResults.length === 0 ? (
        <p>No results found for recipes.</p>
      ) : (
        // Recipe Search Section
        searchResults.map((post) => (
          <RecipeResult key={post._id} post={post} />
        ))
      )
    )}
    
  </div>
);

export default SearchResults;
