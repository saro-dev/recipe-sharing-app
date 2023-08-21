import React from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux

import ProfilePage from './ProfilePage';

const LoggedInUserPage = () => {
  const loggedInUserId = useSelector(state => state.user.id); // Adjust this based on your Redux setup

  return (
    <div>
      {/* Render other components */}
      <ProfilePage userId={loggedInUserId} />
      {/* Render other components */}
    </div>
  );
};

export default LoggedInUserPage;
