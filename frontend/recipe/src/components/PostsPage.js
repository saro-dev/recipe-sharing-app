import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'
import './PostsPage.css';
import defaultimg from './defaultimg.jpg';
import nonveg from '../non-veg.png';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomToast from './CustomToast';
import veg from '../veg.webp';
import { debounce } from 'lodash';
import logo from "../splash.png";

const PostsPage = ({ loggedInUser, favoritePosts, setFavoritePosts }) => {
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({}); // Object to store comment texts
  const [showAllComments, setShowAllComments] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts to load
  const postsPerPage = 3;
  const containerRef = useRef(null);

 


  const fetchPostsFromApi = async (page, limit) => {
    try {
      const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  const fetchAndCachePosts = async () => {
  try {
    const cachedPosts = JSON.parse(sessionStorage.getItem('cachedPosts')) || [];
    const startIdx = (currentPage - 1) * postsPerPage;

    // Check if cached posts are available for the current page
    if (startIdx < cachedPosts.length) {
      const newPosts = cachedPosts.slice(startIdx, startIdx + postsPerPage);
      setPosts([...posts, ...newPosts]);
      setCurrentPage(currentPage + 1);
    } else {
      // Fetch new posts from the API
      const newPosts = await fetchPostsFromApi(currentPage, postsPerPage);

      if (newPosts.length === 0) {
        setHasMorePosts(false);
      } else {
        setPosts([...posts, ...newPosts]);
        setCurrentPage(currentPage + 1);

        // Cache the new posts
        sessionStorage.setItem('cachedPosts', JSON.stringify([...cachedPosts, ...newPosts]));
      }
    }

    setLoading(false);
  } catch (error) {
    console.error('Error fetching and caching posts:', error);
  }
};

  useEffect(() => {
    if (hasMorePosts) {
      fetchAndCachePosts();
    }
  }, [currentPage, hasMorePosts]);

  useEffect(() => {
    const handleScrollDebounced = debounce(() => {
      const container = containerRef.current;
      if (container && container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }, 500);
  
    const container = containerRef.current;
  
    if (container) {
      container.addEventListener('scroll', handleScrollDebounced);
  
      return () => {
        container.removeEventListener('scroll', handleScrollDebounced);
      };
    }
  }, [setCurrentPage]);
  
  
  useEffect(() => {
    const checkLikedByCurrentUser = () => {
      posts.forEach((post) => {
        if (post.likes.includes(loggedInUser._id)) {
          setLikedPosts((prevLikedPosts) => [...prevLikedPosts, post._id]);
        }
      });
    };

    checkLikedByCurrentUser();
  }, [posts, loggedInUser]);
 

  useEffect(() => {
    const checkIsFavorite = async (postId) => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/isFavorite/${loggedInUser._id}/${postId}`);
        const { isFavorite } = response.data;
  
        if (isFavorite) {
          setFavoritePosts((prevFavorites) => [...prevFavorites, postId]);
        }
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };
  
    // Check if each post is a favorite
    posts.forEach((post) => {
      checkIsFavorite(post._id);
    });
  }, [loggedInUser, posts, setFavoritePosts]);
  

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };


  if (loading) {
    return (
      <div className="p-4 scrollable-container h-full" ref={containerRef} style={{ overflowY: 'scroll', maxHeight: '100%' }}>
        <div className='flex items-left mb-4'>
        <h2 className="text-2xl font-semibold mr-8 flex items-center justify-center"> <img src={logo} alt="logo" className='w-7 h-7 mx-2 rounded'/> Recipeeze</h2>
          <div className="filter-bar">
            <input type="radio" name="toggle" value="nonveg" id="toggle-nonveg" checked={selectedMode === 'nonveg'} onChange={() => handleModeChange('nonveg')} />
            <label className={`toggle toggle-nonveg mr-10 ${selectedMode === 'nonveg' ? 'active' : ''}`} htmlFor="toggle-nonveg"> <img src={nonveg} alt="non-veg" className='h-5 w-auto mt-3' /> </label>

            <input type="radio" name="toggle" value="all" id="toggle-all" checked={selectedMode === 'all'} onChange={() => handleModeChange('all')} />
            <label className={`toggle toggle-all mr-10${selectedMode === 'all' ? 'active' : ''}`} htmlFor="toggle-all">All</label>

            <input type="radio" name="toggle" value="veg" id="toggle-veg" checked={selectedMode === 'veg'} onChange={() => handleModeChange('veg')} />
            <label className={`toggle toggle-veg ${selectedMode === 'veg' ? 'active' : ''}`} htmlFor="toggle-veg"><img src={veg} className='h-5 w-auto mt-3' alt='veg' /></label>

            <span></span>
          </div>
        </div>
        <CustomToast />
        <div className="posts-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="post-item skeleton-loading">
              <div className="w-full h-40 mb-4 bg-gray-300 rounded-lg text-center flex justify-center items-center text-xl text-gray-500">loading..</div> {/* Placeholder image */}
              <h3 className="text-lg font-semibold mb-2 bg-gray-300 h-8 rounded"></h3> {/* Placeholder heading */}
              <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
              <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
              <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
            </div>
          ))}
        </div>
      </div>
    );
  }


  const handleToggleLike = async (postId) => {
    try {
      // Update the like status immediately
      setLikedPosts((prevLikedPosts) =>
        likedPosts.includes(postId)
          ? prevLikedPosts.filter((id) => id !== postId)
          : [...prevLikedPosts, postId]
      );
  
      const response = await axios.post(`https://recipe-backend-1e02.onrender.com/api/like/${postId}`, {
        userId: loggedInUser._id,
      });
      const updatedPost = response.data;
  
      // Update the post with the new like status from the server response
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
  
      const updatedLikedPosts = updatedPost.isLiked
        ? [...likedPosts, postId]
        : likedPosts.filter((id) => id !== postId);
      //update the session storage after likes
      sessionStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));

  
      if (updatedPost.isLiked && updatedPost.userId !== loggedInUser._id) {
        const notificationMessage = `${loggedInUser.name} likes your post`;
        const notification = {
          type: 'like',
          postId: updatedPost._id,
          message: notificationMessage,
          isRead: false,
          createdAt: new Date(),
          UserId: loggedInUser._id,
        };
  
        // Send notification to the post owner, excluding self
        if (updatedPost.userId !== loggedInUser._id) {
          const notificationResponse = await axios.post(
            `https://recipe-backend-1e02.onrender.com/api/addNotification/${updatedPost.userId}`,
            {
              notification,
            }
          );
  
          console.log(`Notification sent to post owner ${updatedPost.userId}:`, notificationResponse.data);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  

  const handleAddComment = async (postId) => {
    try {
      const response = await axios.post(`https://recipe-backend-1e02.onrender.com/api/comment/${postId}`, {
        userId: loggedInUser._id,
        text: commentTexts[postId], // Use the comment text for the specific post
      });
      const newComment = response.data;

      // Update the post with the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );

      // Clear the comment text for the specific post
      setCommentTexts((prevState) => ({
        ...prevState,
        [postId]: '',
      }));

      // Show all comments for this post
      setShowAllComments((prevState) => ({
        ...prevState,
        [postId]: true,
      }));

      // Get the post owner's ID from the current post data
      const post = posts.find((post) => post._id === postId);
      if (!post) {
        console.error(`Post with ID ${postId} not found.`);
        return;
      }

      const postOwner = post.userId; // Assuming the user ID is stored in the 'userId' field of the post

      console.log('Post Owner:', postOwner);

      if (postOwner && postOwner !== loggedInUser._id) {
        const notificationMessage = `${loggedInUser.name} commented on your post`;
        console.log('Notification Message:', notificationMessage);

        const notification = {
          type: 'comment',
          postId: postId,
          message: notificationMessage,
          isRead: false,
          createdAt: new Date(),
          UserId: loggedInUser._id,
        };
        console.log('Notification:', notification);

        const notificationResponse = await axios.post(
          `https://recipe-backend-1e02.onrender.com/api/addNotification/${postOwner}`, // Use postOwner._id to access the user's ID
          {
            notification,
          }
        );

        console.log(
          `Notification sent to post owner ${postOwner}:`,
          notificationResponse.data
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };







  const handleCommentChange = (postId, event) => {
    const newText = event.target.value;
    setCommentTexts(prevState => ({
      ...prevState,
      [postId]: newText, // Update comment text for the specific post
    }));
  };



  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/comment/${postId}/${commentId}`, {
        data: { userId: loggedInUser._id } // Send userId in the request body
      });
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const updatedComments = post.comments.filter(comment => comment._id !== commentId);
          return { ...post, comments: updatedComments };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const isFavorite = (postId) => favoritePosts.includes(postId);
  const handleToggleFavorite = async (postId) => {
    try {
      if (isFavorite(postId)) {
        // Remove from favorites
        await axios.delete(`https://recipe-backend-1e02.onrender.com/api/removeFavorite/${loggedInUser._id}/${postId}`, {
          data: { userId: loggedInUser._id },
        });
        setFavoritePosts((prevFavorites) => prevFavorites.filter((id) => id !== postId));
        toast.error('Removed from favorites!', {
          position: 'top-right',
          autoClose: 1000, // Close after 2 seconds
        });
      } else {
        // Add to favorites
        await axios.post(`https://recipe-backend-1e02.onrender.com/api/addFavorite/${loggedInUser._id}/${postId}`, {
          userId: loggedInUser._id,
        });
        setFavoritePosts((prevFavorites) => [...prevFavorites, postId]);
        toast.success('Added to favorites!', {
          position: 'top-right',
          autoClose: 1000, // Close after 2 seconds
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  function checkForNonVeg(ingredients) {
    const nonVegKeywords = ['egg', 'chicken', 'meat', 'mutton', 'beef', 'pork', 'fish', 'seafood', 'lamb', 'venison', 'duck', 'turkey', 'veal', 'salmon', 'shrimp', 'crab', 'lobster', 'clam', 'oyster', 'scallop', 'squid', 'octopus', 'prawn', 'ham', 'bacon', 'sausage', 'steak', 'ribs', 'liver', 'tripe', 'gizzard', 'offal'];
    const lowerIngredients = ingredients.toLowerCase();

    return nonVegKeywords.some((keyword) => lowerIngredients.includes(keyword));
  }


  return (
    <div className="p-4 scrollable-container h-full" ref={containerRef} style={{ overflowY: 'scroll', maxHeight: '100%' }}>
      <div className='flex items-left mb-4'>
        <h2 className="text-2xl font-semibold mr-8 flex items-center justify-center"> <img src={logo} alt="logo" className='w-7 h-7 mx-2 rounded'/> Recipeeze</h2>
        <div className="filter-bar">
          <input type="radio" name="toggle" value="nonveg" id="toggle-nonveg" checked={selectedMode === 'nonveg'} onChange={() => handleModeChange('nonveg')} />
          <label className={`toggle toggle-nonveg mr-10 ${selectedMode === 'nonveg' ? 'active' : ''}`} htmlFor="toggle-nonveg"> <img src={nonveg} className='h-5 w-auto mt-3' alt='non-veg'/> </label>

          <input type="radio" name="toggle" value="all" id="toggle-all" checked={selectedMode === 'all'} onChange={() => handleModeChange('all')} />
          <label className={`toggle toggle-all mr-10${selectedMode === 'all' ? 'active' : ''}`} htmlFor="toggle-all">All</label>

          <input type="radio" name="toggle" value="veg" id="toggle-veg" checked={selectedMode === 'veg'} onChange={() => handleModeChange('veg')} />
          <label className={`toggle toggle-veg ${selectedMode === 'veg' ? 'active' : ''}`} htmlFor="toggle-veg"><img src={veg} className='h-5 w-auto mt-3' alt='veg'/></label>

          <span></span>
        </div>
      </div>

      <CustomToast />
      <div className='posts-grid'>
        {posts
          .filter((post) => {
            if (selectedMode === 'veg') {
              return !checkForNonVeg(post.ingredients);
            } else if (selectedMode === 'nonveg') {
              return checkForNonVeg(post.ingredients);
            }
            return true; // 'all' mode
          })
          .map((post) => (
            <div key={post._id} className="border p-4 mb-4 rounded-lg bg-white shadow-md post-item">
              <div className="flex items-center mt-2">
                <img
                  src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${post.userId}`}
                  alt=""
                  className="max-w-full max-h-full object-cover mr-2"
                  style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.src = defaultimg; // Replace with the URL of your default image
                  }}
                />
                <strong>{post.authorName}</strong>
              </div>
              <div className="w-full h-auto mt-2">
                <Link to={{
                  pathname: `/post-details/${post._id}`,
                  state: { comments: post.comments },
                }}>
                  <div style={{ width: '100%', height: '200px' ,overflow:'hidden', borderRadius: '10px'}} >
                    <img
                      src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
                      alt={post.title}
                      className="max-w-full max-h-full object-cover rounded-lg skeleton-item recipe-image hover:transform hover:scale-105 transition-transform duration-300"
                      style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
                </Link>
              </div>

              <div className='flex items-center'>


                <button
                  className={`like-button mr-3 ${likedPosts.includes(post._id) ? 'liked' : ''}`}
                  onClick={() => handleToggleLike(post._id)}
                >
                  <i className="fas fa-heart heart-icon"></i> {likedPosts.includes(post._id) ? 'Liked' : 'Like'}
                </button>
                <div className='flex items-center mr-2'>
                  <i className='fa fa-clock mr-1 text-green-600'></i>
                  <p className='text-xl mb-2 mt-1'>{post.cookingTime}</p>
                </div>
                {checkForNonVeg(post.ingredients) ? (
                  <img
                    src={nonveg} // Replace with the path to your non-veg icon
                    alt="Non-Veg"
                    className="h-6 w-6 mr-3"
                  />
                ) : (
                  <img
                    src={veg} // Replace with the path to your veg icon
                    alt="Veg"
                    className="h-6 w-6 mr-3"
                  />
                )}
                <button
                  className={`favorite-button  ${favoritePosts.includes(post._id) ? 'favorited' : ''}`}
                  onClick={() => handleToggleFavorite(post._id)}
                >
                  <FaStar color={favoritePosts.includes(post._id) ? 'orange' : 'grey'} size={25} />
                </button>
              </div>
              <div className="mt-2">
                <p className="text-gray-600">{post.likes.length} likes</p>
                <hr />
                <div className="flex mt-2">
                  <div className="flex mt-2 bg-gray-300 px-2 py-1 w-full rounded-lg">
                    <input
                      type="text"
                      value={commentTexts[post._id] || ''}
                      onChange={(event) => handleCommentChange(post._id, event)}
                      placeholder="Enter your comment"
                      className="border rounded-xl p-2 flex-grow mr-2 w-9/12"
                    />
                    <button
                      className="stroke-slate-300 bg-slate-500 focus:stroke-blue-200 focus:bg-blue-600 border border-slate-600 hover:border-slate-300 rounded-lg p-2 duration-300"
                      onClick={() => handleAddComment(post._id)}
                      disabled={!commentTexts[post._id]}
                    >
                      <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M10.11 13.6501L13.69 10.0601"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4" style={{width:'300px',height:'80px', overflowX:'scroll',wordWrap: 'break-word'}}>
                  <strong className="border-b border-blue-600 mb-3 text-blue-800">Comments:</strong>
                  <ul>
                    {post.comments.slice(0, showAllComments[post._id] ? post.comments.length : 3).map((comment) => (
                      <li key={comment._id} className="mb-2">
                        {comment.user ? (
                          <span className="text-gray-800">
                            <strong>{comment.name}:</strong> {comment.text}
                            {comment.user === loggedInUser._id && (
                              <button
                                className="text-red-500 ml-2"
                                onClick={() => handleDeleteComment(post._id, comment._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-800">Unknown User: {comment.text}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {!showAllComments[post._id] && post.comments.length > 3 && (
                    <button
                      className="text-blue-500 mt-2"
                      onClick={() =>
                        setShowAllComments((prevState) => ({
                          ...prevState,
                          [post._id]: true,
                        }))
                      }
                    >
                      Show all comments ({post.comments.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>

  );
};

export default PostsPage;
