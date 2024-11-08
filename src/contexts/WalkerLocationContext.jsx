import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';
import { useWalkerTurnsContext } from '../contexts/TurnContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';

const WalkerLocationContext = createContext();

export const WalkerLocationProvider = ({ children }) => {
  const [walkerLocation, setWalkerLocation] = useState([]);
  const { turns } = useWalkerTurnsContext();
  const { userLog } = useUser();
  const [activeTurnId, setActiveTurnId] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const socket = useWebSocket();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  // Función para emitir eventos de WebSocket
  const emitSocketEvent = (eventName, data) => {
    if (socket && socket.connected) { // Asegurarse que el socket esté conectado
      socket.emit(eventName, data);
    } else {
      console.warn('Socket de ubicación no está conectado, no se puede emitir el evento:', eventName);
    }
  };

  useEffect(() => {
    return () => {
      stopWatchingLocation();
    };
  }, []);

  const startWatchingLocation = (roomName) => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setWalkerLocation(coords);

          // Emitir la ubicación al servidor
          emitSocketEvent('newLocation', {
            roomName,
            lat: coords[0],
            long: coords[1],
            walkerId: userLog.id,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('Permiso de geolocalización denegado.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('La información de ubicación no está disponible.');
              break;
            case error.TIMEOUT:
              console.error('El tiempo de espera para obtener la ubicación ha expirado.');
              break;
            default:
              console.error('Error desconocido obteniendo la ubicación:', error);
          }
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
      setWatchId(id);
    } else {
      console.error('Geolocalización no es soportada por este navegador.');
    }
  };

  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    if (userLog && userLog.tipo === 'walker') {

      const activeTurn = turns.find(turn =>
        turn.Services.some(service => service.comenzado && !service.finalizado)
      );
      
      if (activeTurn) {

        // Si el turno activo ha cambiado, únete a una nueva sala
        if (activeTurn.id !== activeTurnId) {

          if (activeTurnId) {
            const roomName = `turn_service_${activeTurnId}`;
            emitSocketEvent('leaveRoom', {roomName, userId: userLog.id});
          }

          const newRoomName = `turn_service_${activeTurn.id}`;
          emitSocketEvent('createRoom', {newRoomName, userId: userLog.Id} );

          setActiveTurnId(activeTurn.id);

          // Inicia la observación de la ubicación solo si hay un turno activo
          stopWatchingLocation(); // Asegura que no haya otra observación corriendo
          startWatchingLocation(newRoomName);
        }
      } else {
        // Si no hay un turno activo, dejar la sala y detener la observación de la ubicación
        if (activeTurnId) {
          const roomName = `turn_service_${activeTurnId}`;
          emitSocketEvent('leaveRoom', {roomName, userId: userLog.id});
          setActiveTurnId(null);
          stopWatchingLocation();
        }
      }
    }

    // El return solo detiene la observación al desmontar el componente
    return () => {
      stopWatchingLocation();
    };
  }, [turns, userLog]);  // Solo se ejecuta cuando cambian los turnos o el tipo de usuario

  return (
    <WalkerLocationContext.Provider value={{ walkerLocation, setWalkerLocation }}>
      {children}
    </WalkerLocationContext.Provider>
  );
};

// Hook para acceder a la ubicación del paseador
export const useWalkerLocation = () => {
  const context = useContext(WalkerLocationContext);
  if (!context) {
    throw new Error('useWalkerLocation debe usarse dentro de un WalkerLocationProvider');
  }
  return context;
};
