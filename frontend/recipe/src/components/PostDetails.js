import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft,FaStar } from 'react-icons/fa';
import Alert from './Alert';
import { ClipLoader } from 'react-spinners'; 

const PostDetails = ({ loggedInUser }) => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [alert, setAlert] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/posts/${postId}`);
        setPost(response.data);
        //check favourite
        if (loggedInUser) {
          const response2 = await axios.get(`https://recipe-backend-wntf.onrender.com/api/isFavorite/${loggedInUser._id}/${postId}`);
          setIsFavorite(response2.data.isFavorite);
          const notificationsResponse = await axios.get(`https://recipe-backend-wntf.onrender.com/api/user/${loggedInUser._id}`);
          const user = notificationsResponse.data;
          const formattedNotifications = Object.values(user.notifications || {});
          setNotifications(formattedNotifications);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);
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
          src={`https://recipe-backend-wntf.onrender.com/uploads/${post.image}`}
          alt={post.title}
          className="max-w-full object-cover"
          style={{ maxWidth: '300px' }}
        />
      </div>
      <div className="mt-2">
        <h3 className="font-semibold">Ingredients:</h3>
        {ingredientList}
      </div>
      <div className="mt-2">
        <h3 className="font-semibold">Steps:</h3>
        {stepList}
      </div>
      <p className="mt-2">
        <span className="text-blue-600">#Tags:</span> {post.tags}
      </p>
    </div>
  );
};

export default PostDetails;
