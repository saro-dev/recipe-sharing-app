import React from 'react';

const NotificationItem = ({ notification }) => {
  return (
    <div className={`notification ${notification.isRead ? 'read' : 'unread'}`}>
      <p>{notification.message}</p>
      <p className="timestamp">{new Date(notification.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default NotificationItem;
