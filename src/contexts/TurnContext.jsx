// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';
import{useWebSocket} from './WebSocketContext'
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const WalkerTurnsContext = createContext();

export const useWalkerTurnsContext = () => useContext(WalkerTurnsContext);

export const WalkerTurnsProvider = ({ children }) => {
  const [turns, setTurns] = useState([]);
  const { userLog } = useUser();
  const socket = useWebSocket();
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();


  const getWalkerTurns = async () => {
    try {
      if(!token) {
        return navigate('/');
      }
      const turnsResponse = await fetch(`${baseUrl}/turns/walker/${userLog.id}`,{ 
        headers: { 
          'Authorization': `Bearer ${token}` 
        }, 
      });
      if (!turnsResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const turnsData = await turnsResponse.json();
      setTurns(turnsData.body);

    } catch (error) {
      console.error('Error fetching turns:', error);
    }};

  // useEffect que actualiza el estado de turns cada vez que se inicia o finaliza un turno
  useEffect(() => {
    if (userLog?.tipo === 'walker' && socket) {
      socket.on('startOrFinishTurn', getWalkerTurns);    
      // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
      return () => socket.off('startOrFinishTurn', getWalkerTurns);
    }
  }, [socket]);

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