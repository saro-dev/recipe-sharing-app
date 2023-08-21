// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  return (
    <UserContext.Provider value={{ loggedInUserId, setLoggedInUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
