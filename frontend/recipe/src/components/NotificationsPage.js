import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationsPage = ({ loggedInUser }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (loggedInUser) {
          const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/user/${loggedInUser._id}`);
          const user = response.data;
          const formattedNotifications = Object.values(user.notifications || {});
          setNotifications(formattedNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [loggedInUser]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications to display.</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification._id}>{notification.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
