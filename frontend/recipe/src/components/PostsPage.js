import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'
import defaultimg from './defaultimg.jpg';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomToast from './CustomToast';


const PostsPage = ({ loggedInUser, favoritePosts, setFavoritePosts }) => {
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({}); // Object to store comment texts
  const [showAllComments, setShowAllComments] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts to load
  const postsPerPage = 3;
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/posts?page=${currentPage}&limit=${postsPerPage}`);
        const newPosts = response.data;

        if (newPosts.length === 0) {
          setHasMorePosts(false);
        } else {
          setPosts([...posts, ...newPosts]);
          setCurrentPage(currentPage + 1);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (hasMorePosts) {
      fetchPosts();
    }
  }, [currentPage, hasMorePosts]);

  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      if (container && container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
        // Reached the bottom, load more posts
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const storedLikedPosts = localStorage.getItem('likedPosts');
    if (storedLikedPosts) {
      const likedPostIds = JSON.parse(storedLikedPosts);
      setLikedPosts(likedPostIds);
    }
  }, []);

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


  if (loading) {
    return (
      <div className="p-4">

        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border p-4 mb-4 rounded-lg bg-white shadow-md skeleton-loading">
            <div className="w-full h-40 mb-4 bg-gray-300 rounded-lg text-center flex justify-center items-center text-xl text-gray-500">loading..</div> {/* Placeholder image */}
            <h3 className="text-lg font-semibold mb-2 bg-gray-300 h-8 rounded"></h3> {/* Placeholder heading */}
            <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
            <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
            <div className="bg-gray-200 h-4 rounded mb-2"></div> {/* Placeholder detail */}
          </div>
        ))}
      </div>
    );
  }

  const handleToggleLike = async (postId) => {
    try {
      const response = await axios.post(`https://recipe-backend-1e02.onrender.com/api/like/${postId}`, {
        userId: loggedInUser._id,
      });
      const updatedPost = response.data;

      setLikedPosts((prevLikedPosts) =>
        updatedPost.isLiked
          ? [...prevLikedPosts, postId]
          : prevLikedPosts.filter((id) => id !== postId)
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );

      const updatedLikedPosts = updatedPost.isLiked
        ? [...likedPosts, postId]
        : likedPosts.filter((id) => id !== postId);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));

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
          `https://recipe-backend-1e02.onrender.com/api/addNotification/${postOwner._id}`, // Use postOwner._id to access the user's ID
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


  return (
    <div className="p-4 scrollable-container h-full" ref={containerRef} style={{ overflowY: 'scroll', maxHeight: '100%' }}>

      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <CustomToast />
      {posts.map((post) => (
        <div key={post._id} className="border p-4 mb-4 rounded-lg bg-white shadow-md">
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
              <img
                src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
                alt={post.title}
                className="max-w-full max-h-full object-cover rounded-lg skeleton-item"
                style={{ height: '200px' }}
              />
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
            <div className='flex items-center mr-5'>
              <i className='fa fa-clock mr-1 text-green-600'></i>
              <p className='text-xl mb-2 mt-1'>{post.cookingTime}</p>
            </div>
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
              <div className="flex mt-2">
                <input
                  type="text"
                  value={commentTexts[post._id] || ''}
                  onChange={(event) => handleCommentChange(post._id, event)}
                  placeholder="Enter your comment"
                  className="border rounded p-2 flex-grow mr-2 w-9/12"
                />
                <button
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => handleAddComment(post._id)}
                  disabled={!commentTexts[post._id]}
                >
                  <i className="fas fa-paper-plane"></i> Post
                </button>
              </div>
            </div>
            <div className="mt-4">
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
  );
};

export default PostsPage;
