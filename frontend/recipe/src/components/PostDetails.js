import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import { WhatsappShareButton,FacebookShareButton, TwitterShareButton, } from 'react-share'; // Import WhatsAppShareButton
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon
import { FacebookIcon, TwitterIcon } from 'react-share';


const PostDetails = ({ loggedInUser }) => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [alert, setAlert] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const postURL = window.location.href;
  const customMessage = "Hey, check out this amazing dish on Recipeeze!";

  // Function to fetch comments for a specific post
  const fetchPostComments = async () => {
    try {
      const commentsResponse = await axios.get(`https://recipe-backend-1e02.onrender.com/api/comments/${postId}`);

      setComments(commentsResponse.data);
      console.log(commentsResponse);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/posts/${postId}`);
        setPost(response.data);

        // Check if the logged-in user has this post in favorites
        if (loggedInUser) {
          const response2 = await axios.get(`https://recipe-backend-1e02.onrender.com/api/isFavorite/${loggedInUser._id}/${postId}`);
          setIsFavorite(response2.data.isFavorite);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
    fetchPostComments(); // Call the function to fetch comments

  }, [postId, loggedInUser]);


  const handleAddToFavorites = async () => {
    try {
      if (!loggedInUser) {
        // Redirect to login page or show a message
        return;
      }

      if (isFavorite) {
        await axios.delete(`https://recipe-backend-1e02.onrender.com/api/removeFavorite/${loggedInUser._id}/${postId}`);
        setAlert({ type: 'success', message: 'Removed from favorites successfully' });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      } else {
        await axios.post(`https://recipe-backend-1e02.onrender.com/api/addFavorite/${loggedInUser._id}/${postId}`);
        setAlert({ type: 'success', message: 'Added to favorites successfully' });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }

      setIsFavorite(prevIsFavorite => !prevIsFavorite);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };
  const handleAddComment = async () => {
  try {
    if (!loggedInUser) {
      // Redirect to login page or show a message
      return;
    }
    if (commentText.trim() === '') {
      // Prevent posting empty comments
      return;
    }

    const response = await axios.post(`https://recipe-backend-1e02.onrender.com/api/comment/${postId}`, {
      userId: loggedInUser._id,
      text: commentText,
    });

    const newComment = response.data;

    setComments((prevComments) => [newComment, ...prevComments]); // Add the new comment to the beginning of the list
    setCommentText('');

    // Send a notification to the post owner
    if (loggedInUser._id !== post.userId._id) {
      const notificationMessage = `${loggedInUser.name} commented on your post`;
      const notification = {
        type: 'comment',
        postId: postId,
        message: notificationMessage,
        isRead: false,
        createdAt: new Date(),
      };

      await axios.post(`https://recipe-backend-1e02.onrender.com/api/addNotification/${post.userId._id}`, {
        notification,
      });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/comment/${postId}/${commentId}`, {
        data: { userId: loggedInUser._id },
      });
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-20 w-20 mt-5 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4 page-container">
        <p>Failed to load post details.</p>
      </div>
    );
  }

  const ingredientList = post.ingredients.split('\n').map((ingredient, index) => (
    <p key={index} className="mt-2">
      <span className="font-semibold">{index + 1}. </span>
      {ingredient}
    </p>
  ));
  const stepList = post.steps.split('\n').map((step, index) => (
    <p key={index} className="mt-2">
      <span className="font-semibold">{index + 1}. </span>
      {step}
    </p>
  ));
  const handleToggleComments = () => {
    setShowAllComments((prevShowAllComments) => !prevShowAllComments);
  };



  const uptitle = post.title.toUpperCase();
  const handleProfileClick = () => {
    if (loggedInUser && loggedInUser._id === post.userId._id) {
      // If the post owner is the logged-in user, navigate to their profile
      navigate('/profile');
    } else {
      // If the post owner is not the logged-in user, navigate to the post owner's profile
      navigate(`/user/${post.userId._id}`);
    }
  };
  const handleConvertToImage = () => {
    // Convert the ingredient list to a plain text string
    const ingredientText = ingredientList.map((ingredient, index) => {
      const ingredientElement = document.createElement('div');
      ReactDOM.render(ingredient, ingredientElement);
      return ` ${ingredientElement.textContent}`;
    }).join('\n');

    // Create a temporary element to measure the text size
    const tempElement = document.createElement('div');
    tempElement.style.font = 'bold 24px Arial'; // Font size and type
    tempElement.textContent = 'RECIPEEZE';

    // Get the width and height required for the text
    const textWidth = tempElement.offsetWidth + 5;
    const textHeight = tempElement.offsetHeight + 20;

    // Calculate the canvas dimensions based on text size and content
    const canvasWidth = Math.max(400, textWidth);
    const canvasHeight = textHeight + 40 + ingredientText.split('\n').length * 30; // Increased vertical padding

    // Create a canvas element with dynamic dimensions
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions based on content
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set background color to purple
    context.fillStyle = 'purple';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Define styles for text
    context.fillStyle = 'white'; // Text color
    context.font = 'bold 24px Arial'; // Font size and type

    // Add the heading text "RECIPEEZE" centered horizontally
    const headingX = (canvas.width - textWidth) / 4;
    const headingY = 30;
    context.fillText('RECIPEEZE', headingX, headingY);

    // Define initial position for drawing ingredient text
    let x = 20; // X-coordinate
    let y = textHeight + 60; // Increased vertical padding and alignment

    // Draw the ingredient text on the canvas
    ingredientText.split('\n').forEach((line) => {
      context.fillText(line, x, y);
      y += 30; // Move down for the next line
    });

    // Convert the canvas to a data URL (image)
    const dataUrl = canvas.toDataURL('image/png');

    // Create a download link for the image
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'shopping-list.png'; // Set the image filename
    a.click();
  };





  return (
    <div className="p-4 page-container mb-10">
      {alert && (
        <div className={`p-2 mb-4 text-white bg-${alert.type === 'success' ? 'green' : 'red'}-500`}>
          {alert.message}</div>)}
      <div className=" mb-4 w-100 flex">
        <Link to="/" className="text-black-600 flex items-center">
          <FaArrowLeft size={20} className="mr-2" />Back
        </Link>
        <button
          onClick={handleAddToFavorites}
          className={`ml-auto ${isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
        >
          <FaStar size={25} />
        </button>
      </div>
      <hr></hr>
      <h2 className="text-xl font-semibold mb-4 mt-2 ">
        Post By{' '}
        <button
          className="text-blue-600 hover:underline"
          onClick={handleProfileClick}
        >
          {post.userId.name}
        </button>
        <i className="fas fa-check-circle text-green-500 ml-1"></i>
      </h2>
      <hr></hr>
      <h2 className="text-xl font-semibold mb-4 mt-2 ">{uptitle}</h2>
      <div>
        <img
          src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
          alt={post.title}
          className="max-w-full object-cover"
          style={{ maxWidth: '300px' }}
        />
      </div>
      <div className="mt-2 bg-white w-40 rounded">
        <div className='ml-5'>
          <h3 className="font-semibold ">Cooking Time:</h3>
          <i className='fa fa-clock mr-2 text-green-600'></i>
          {post.cookingTime} Minutes
        </div>
      </div>
      <hr className='m-1'></hr>
      <div className="mt-2">
        <h3 className="font-semibold">Ingredients:</h3>
        {ingredientList}
      </div>
      <button className='bg-blue-600 text-white p-2 rounded mt-3' onClick={handleConvertToImage}>Convert to Shopping List</button>
      <hr className='mt-2'></hr>
      <div className="mt-2">
        <h3 className="font-semibold">Steps:</h3>
        {stepList}
      </div>
      <hr></hr>
      <div className="mt-2 bg-blue-200 rounded p-3">
        <h3 className="font-semibold mb-1">Notes and Tips:</h3>
        {post.notesAndTips}
      </div>

      <p className="mt-2">
        <span className="text-blue-600">#Tags:</span> {post.tags}
      </p>
      <hr className='m-2'></hr>
      <div className='bg-white p-2 rounded'>
      <h1 className='mb-2'>Share <i className='fa fa-share'></i></h1>
      <WhatsappShareButton url={postURL} title={`${customMessage}\n${post.title}`}>
          <FaWhatsapp size={30} className="ml-2 cursor-pointer text-green-500 hover:text-green-600" />
        </WhatsappShareButton>
        <FacebookShareButton url={postURL} quote={`${customMessage}\n${post.title}`}>
          <FacebookIcon size={30} className="ml-4 cursor-pointer text-blue-600 hover:text-blue-700" />
        </FacebookShareButton>
        <TwitterShareButton url={postURL} title={`${customMessage}\n${post.title}`}>
          <TwitterIcon size={30} className="ml-4 cursor-pointer text-blue-400 hover:text-blue-500" />
        </TwitterShareButton>
      </div>
      <div className="mt-4 mb-4">
        <h3 className="font-semibold">Comments:</h3>
        <div>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter your comment"
            className="border rounded p-2 flex-grow"
          />
          <button
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleAddComment(post._id)}
            disabled={!commentText.trim()}>
            <i className="fas fa-paper-plane"></i> Post
          </button>
        </div>
        <ul>
          <strong className="border-b border-blue-600 mb-3 text-blue-800">
            Comments:
          </strong>
          {showAllComments
            ? post.comments.map((comment) => (
              <li key={comment._id}>
                {comment.user ? (
                  <span>
                    <strong>{comment.name}:</strong> {comment.text}
                    {comment.user === loggedInUser._id && (
                      <button
                        className="text-red-500 ml-2"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </span>
                ) : (
                  <span>Unknown User: {comment.text}</span>
                )}
              </li>
            ))
            : post.comments.slice(0, 3).map((comment) => (
              <li key={comment._id}>
                {comment.user ? (
                  <span>
                    <strong>{comment.name}:</strong> {comment.text}
                    {comment.user === loggedInUser._id && (
                      <button
                        className="text-red-500 ml-2"
                        onClick={() => handleDeleteComment(comment._id)}
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
        </ul>

      </div>
      <button
        className="text-blue-500 mt-2"
        onClick={handleToggleComments}
      >
        {showAllComments ? 'Hide comments' : 'Show all comments'}
      </button>
    </div>
  );
};

export default PostDetails;
