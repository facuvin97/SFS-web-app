import React, { createContext, useState, useContext, useEffect, useCallback  } from 'react';
import { useUser } from './UserLogContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';


const WalkerLocationContext = createContext();

export const WalkerLocationProvider = ({ children }) => {
  const [walkerLocation, setWalkerLocation] = useState([]);
  const [activeTurn, setActiveTurn] = useState(null);
  const socket = useWebSocket();
  const { userLog } = useUser();

  // Función para emitir eventos de WebSocket
  const emitSocketEvent = (eventName, data) => {
    if (socket) socket.emit(eventName, data);
  };

  // funcion que le pide la ubicacion al paseador
  const getWalkerLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            setWalkerLocation([position.coords.latitude, position.coords.longitude]);
          },
          (error) => console.error('Error obteniendo ubicación:', error),
          { enableHighAccuracy: true }
        );
      } else {
        console.error('Geolocalización no es soportada por este navegador.');
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }};

    //use effect para enviar la ubicacion del paseador al socket cada vez que se actualice
    useEffect(() => {
      // solo ejecuto este useEffect si el usuario es un paseador
      if (userLog.tipo === 'walker') { 
        if (walkerLocation && activeTurn) { // si hay una location y un turno activo, envia la ubicación al socket
          emitSocketEvent('newLocation', { lat: walkerLocation[0], long: walkerLocation[1] });
        }
      }
    },  [walkerLocation, activeTurn]);


  return (
    <WalkerLocationContext.Provider value={{ walkerLocation, setWalkerLocation }}>
      {children}
    </WalkerLocationContext.Provider>
  );
};

export const useWalkerLocation = () => {
  const context = useContext(WalkerLocationContext);
  if (!context) {
    throw new Error('useWalkerLocation debe usarse dentro de un WalkerLocationProvider');
  }
  return context;
};
