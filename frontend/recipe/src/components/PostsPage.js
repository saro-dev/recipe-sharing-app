import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'

const PostsPage = ({ loggedInUser }) => {
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({}); // Object to store comment texts
  const [showAllComments, setShowAllComments] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        const reversedPosts = response.data.reverse(); // Reverse the order of posts
        setPosts(reversedPosts);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);
  useEffect(() => {
    const storedLikedPosts = localStorage.getItem('likedPosts');
    if (storedLikedPosts) {
      const likedPostIds = JSON.parse(storedLikedPosts);
      setLikedPosts(likedPostIds);
    }
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-20 w-20 mt-5 border-t-2 border-blue-500"></div>
        </div>
    );
  }

  const handleToggleLike = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/like/${postId}`, {
        userId: loggedInUser._id,
      });
      const updatedPost = response.data;
      console.log('Updated Post:', updatedPost);

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

      if (updatedPost.isLiked) {
        const notificationMessage = `${loggedInUser.name} likes your post`;
        console.log('Notification Message:', notificationMessage);

        const notification = {
          type: 'like',
          postId: updatedPost._id,
          message: notificationMessage,
          isRead: false,
          createdAt: new Date(),
        };
        console.log('Notification:', notification);

        const notificationResponse = await axios.post(
          `http://localhost:5000/api/addNotification/${updatedPost.userId}`,
          {
            notification,
          }
        );

        console.log(`Notification sent to post owner ${updatedPost.userId}:`, notificationResponse.data);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  const handleAddComment = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/comment/${postId}`, {
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
        };
        console.log('Notification:', notification);
  
        const notificationResponse = await axios.post(
          `http://localhost:5000/api/addNotification/${postOwner._id}`, // Use postOwner._id to access the user's ID
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
      await axios.delete(`http://localhost:5000/api/comment/${postId}/${commentId}`, {
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

  return (
    <div className="p-4 ">
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      {posts.map(post => (
        
        <div key={post._id} className="border p-4 mb-4 rounded-lg bg-gray-100 custom-shadow">
          <p className="text-gray-500">Posted by: <strong>{post.authorName}</strong></p>
          
          <div className="w-100 h-100 mt-2">
          <Link to={{
            pathname: `/post-details/${post._id}`,
            state: { comments: post.comments }, // Pass comments as a prop
          }}>
            <img
              src={`http://localhost:5000/api/getRecipeImage/${post._id}`}
              alt={post.title}
              className="max-w-full max-h-full object-cover"
              style={{ maxWidth: '150px' }}
            />
            <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
            </Link>
          </div>
          
          <button
  className={`text-${likedPosts.includes(post._id) ? 'red' : 'red'}-500 hover:text-${likedPosts.includes(
    post._id
  )
    ? 'red'
    : 'red'}-700`}
  onClick={() => handleToggleLike(post._id)}
>
  <i
    className={`fas fa-heart${
      likedPosts.includes(post._id) ? ' text-red-700 animate-like' : ''
    }`}
  ></i>{' '}
  {likedPosts.includes(post._id) ? (
    <span>
      Liked{' '}
      <i
        className={`fas fa-check-circle text-green-500 ml-1 ${
          likedPosts.includes(post._id) ? 'animate-pulse' : ''
        }`}
      ></i>
    </span>
  ) : (
    'Like'
  )}
</button>

          
          <div className="mt-2">
            <p>{post.likes.length} likes</p>
            <hr />
            <div className="flex mt-2">
            <div className="flex mt-2">
  <input
    type="text"
    value={commentTexts[post._id] || ''} // Use comment text from state or empty string
    onChange={event => handleCommentChange(post._id, event)} // Pass postId and event
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
          <div className='max-h-40 overflow-y-scroll'>
            <ul>
              <strong className='border-b border-blue-600 mb-3 text-blue-800'>Comments:</strong>
              {post.comments.slice(0, showAllComments[post._id] ? post.comments.length : 3).map(comment => (
  <li key={comment._id}>
    {comment.user ? (
      <span>
        <strong >{comment.name}:</strong> {comment.text}
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
      <span>Unknown User: {comment.text}</span>
    )}
  </li>
))}
{!showAllComments[post._id] && post.comments.length > 3 && (
  <button
    className="text-blue-500 mt-2"
    onClick={() => setShowAllComments(prevState => ({ ...prevState, [post._id]: true }))}
  >
    Show all comments ({post.comments.length})
  </button>
)}
            </ul>
            </div>
          </div>
        </div>
        
      ))}
    </div>
  );
};

export default PostsPage;

//all ok
