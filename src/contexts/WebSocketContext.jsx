import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useUser } from './UserLogContext'; // Para verificar si el usuario está logueado

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userLog } = useUser(); // Acceder al usuario logueado

  useEffect(() => {
    if (userLog) {
      // Solo conectarse cuando el usuario esté logueado
      const newSocket = io('http://localhost:3001', {
        transports: ['websocket'],
        auth:{
          userId: userLog.id
        }
      });

      // Autenticar al usuario logueado en WebSocket
      newSocket.emit('authenticate', userLog.id);

      setSocket(newSocket);

      // Limpiar la conexión cuando el usuario se desconecta o cierre sesión
      return () => {
        newSocket.close();
      };
    }
  }, [userLog]); // Solo se ejecuta cuando 'userLog' cambie

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
