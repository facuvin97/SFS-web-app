import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useWebSocket } from '../contexts/WebSocketContext'; 
import { useUser } from '../contexts/UserLogContext'; 
import { useConfirmedServicesContext } from '../contexts/ServicesContext';

function Map() {
  const [walkerLocation, setWalkerLocation] = useState(null); // Ubicación inicial
  const socket = useWebSocket(); 
  const { userLog } = useUser(); 
  const { confirmedServices } = useConfirmedServicesContext(); 
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  // Efecto para manejar la carga de servicios confirmados
  useEffect(() => {
    if (confirmedServices.length > 0) {
      setLoading(false); // Ya hay servicios confirmados
    }
  }, [confirmedServices]);

  // Unir a la sala del paseador si hay un servicio activo
  useEffect(() => {
    if (userLog.tipo === 'client' && confirmedServices.length > 0) {
      console.log('userLog.tipo === cliente', userLog.tipo);
      console.log('confirmedServices', confirmedServices);
      
      const service = confirmedServices.find(service => service.comenzado === true && service.finalizado === false);
      
      if (service) {
        const roomName = `turn_service_${service.TurnId}`;
        console.log('Unirse a la sala:', roomName);
  
        // Emitir el evento para unirse a la sala
        socket.emit('joinRoom', { roomName, userId: userLog.id });
  
        // Escuchar actualizaciones de ubicación
        socket.on('receiveLocation', (location) => {
          console.log('Recibida nueva ubicación:', location);
          setWalkerLocation([location.lat, location.long]); // Actualiza la ubicación del paseador en el mapa
        });
        socket.on('serviceFinished', () => {
          console.log('Servicio finalizado');
          setWalkerLocation(null);
        });
  
        // Limpiar cuando el componente se desmonte o el servicio termine
        return () => {
          socket.emit('leaveRoom', { roomName });
          socket.off('location'); // Eliminar el listener de 'location'
        };
      }
    }
  }, [userLog, socket, confirmedServices]);
  

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
