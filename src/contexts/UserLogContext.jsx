import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userLog, setUserLog] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserLog(JSON.parse(storedUserData));
    }
  }, []);

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

// El hook useUser para acceder al contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
