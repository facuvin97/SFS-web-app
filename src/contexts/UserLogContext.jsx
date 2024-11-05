import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userLog, setUserLog] = useState(JSON.parse(localStorage.getItem('userData')));

  const logout = () => {
    setUserLog(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
  };

  return (
    <UserContext.Provider value={{ userLog, setUserLog, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
