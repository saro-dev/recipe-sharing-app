import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Notifications.css';
import defaultimg from './defaultimg.jpg';
import Alert from './Alert';

const Notifications = ({ userId }) => {
  const [userData, setUserData] = useState({ notifications: [] });
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${userId}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/notifications/${userId}/${notificationId}`);
      // Remove the deleted notification from the state
      setUserData((prevUserData) => ({
        ...prevUserData,
        notifications: prevUserData.notifications.filter((notification) => notification._id !== notificationId),
      }));
      // Show a success alert
      setAlertMessage('Notification deleted successfully.');
      setShowAlert(true);

      setTimeout(() => {
        // Hide the alert after a delay (e.g., 3 seconds)
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Sort notifications by createdAt in descending order
  const sortedNotifications = userData.notifications.slice().sort((a, b) => b.createdAt - a.createdAt);

  const reversedNotifications = sortedNotifications.slice().reverse();

  return (
    <div className="notifications-container">
      <h2 className='h2'>Notifications</h2>
      {showAlert && (
        <div className="fixed top-0 left-0 w-full h-20 flex justify-center z-999">
          <Alert type="success" message={alertMessage} />
        </div>
      )}
      {loading ? (
        <div className="loading-skeleton">
          {/* Skeleton loading effect */}
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      ) : (
        <div>
          {reversedNotifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            <ul className="notifications-list">
              {reversedNotifications.map((notification, index) => (
                <li key={notification._id} className="notification-item">
                  <Link to={`/post-details/${notification.postId}`} className="notification-link">
                    {notification.type === 'like' ? (
                      <span className="heart-icon">❤️</span>
                    ) : (
                      <span className="comment-icon">💬</span>
                    )}
                    <img
                  src={`https://recipe-backend-1e02.onrender.comnrender.com/api/getProfileImage/${userData._id}`}
                  alt=""
                  className="max-w-full max-h-full object-cover mr-2"
                  style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.src = defaultimg; // Replace with the URL of your default image
                  }}
                />
                    {notification.message}
                  </Link>
                  <span className="timestamp">{formatTimestamp(notification.createdAt)}</span>
                  <button
                    className="delete-button ml-5"
                    onClick={() => handleDeleteNotification(notification._id)}
                  >
                    <i className="fas fa-trash text-red-700"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
