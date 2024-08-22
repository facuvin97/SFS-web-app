// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';

const WalkerTurnsContext = createContext();

export const useWalkerTurnsContext = () => useContext(WalkerTurnsContext);

export const WalkerTurnsProvider = ({ children }) => {
  const [turns, setTurns] = useState([]);
  const { userLog } = useUser();


  const getWalkerTurns = async () => {
    try {
      const turnsResponse = await fetch(`http://localhost:3001/api/v1/turns/walker/${userLog.id}`);
      if (!turnsResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const turnsData = await turnsResponse.json();
      setTurns(turnsData.body);

    } catch (error) {
      console.error('Error fetching turns:', error);
    }};


  useEffect(() => {
    if (userLog?.tipo === 'walker') {
      getWalkerTurns();
    }
  }, [userLog]);

  
  return (
    <WalkerTurnsContext.Provider value={{ 
      turns, 
      setTurns
    }}>
      {children}
    </WalkerTurnsContext.Provider>
  );
};