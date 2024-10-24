import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useWebSocket } from '../contexts/WebSocketContext'; 
import { useUser } from '../contexts/UserLogContext'; 
import { useConfirmedServicesContext } from '../contexts/ServicesContext';

function Map() {
  const [walkerLocation, setWalkerLocation] = useState(null); // Ubicación inicial
  const [joinedRoom, setJoinedRoom] = useState(false); // Estado para saber si ya está en la sala
  const socket = useWebSocket(); 
  const { userLog } = useUser(); 
  const { confirmedServices } = useConfirmedServicesContext(); 
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const activeServiceRef = useRef(null); // Ref para mantener el servicio activo


  // Efecto para manejar la carga de servicios confirmados
  useEffect(() => {
    if (confirmedServices.length > 0) {
      setLoading(false); // Ya hay servicios confirmados
    }
  }, [confirmedServices]);

  // Unir a la sala del paseador si hay un servicio activo
  const joinWalkerRoom = (service) => {
    const roomName = `turn_service_${service.TurnId}`;
    
    if (!joinedRoom) {
      console.log('Unirse a la sala:', roomName);
      setJoinedRoom(true);
      socket.emit('joinRoom', { roomName, userId: userLog.id });

      // Solicitar ubicación inicial del paseador
      socket.emit('requestLocation', { roomName });

      // Escuchar actualizaciones de ubicación
      socket.on('receiveLocation', (location) => {
        console.log('Recibida nueva ubicación:', location);
        setWalkerLocation([location.lat, location.long]);
      });

      // Escuchar cuando se finalice el servicio
      socket.on('serviceFinished', () => {
        console.log('Servicio finalizado');
        setWalkerLocation(null);
        setJoinedRoom(false); // Resetear el estado de la sala
        socket.emit('leaveRoom', { roomName , userId: userLog.id });
      });

      // Limpiar cuando el componente se desmonte o el servicio termine
      return () => {
        socket.off('receiveLocation');
        socket.off('serviceFinished');
        socket.emit('leaveRoom', { roomName, userId: userLog.id });
      };
    }
  };

  // Efecto para gestionar la unión a la sala del paseador y la ubicación inicial
  useEffect(() => {
    if (userLog.tipo === 'client' && confirmedServices.length > 0) {
      const service = confirmedServices.find(service => service.comenzado === true && service.finalizado === false);
      
      if (service && (!activeServiceRef.current || activeServiceRef.current.TurnId !== service.TurnId)) {
        activeServiceRef.current = service; // Guardamos el servicio activo en la referencia
        joinWalkerRoom(service);
      }
    }
  }, [userLog, confirmedServices, socket]);

  

  // Componente para centrar el mapa en la ubicación del paseador
  function CenterMapOnLocation({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView(location);
      }
    }, [location, map]);
    return null;
  }

  if (loading) {
    return <div>Cargando servicios...</div>;
  }

  return (
    <>
    {!walkerLocation && <div>Esperando la ubicacion del paseador...</div>}
    <MapContainer center={[-34.9011, -56.1645]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      { walkerLocation && 
      <>
      <Marker position={walkerLocation}>
        <Popup>Ubicación actual del paseador.</Popup>
      </Marker>
      <CenterMapOnLocation location={walkerLocation} /> 
      </>}
    </MapContainer>
    </>
  );
}

export default Map;
