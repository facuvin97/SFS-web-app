import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { useWebSocket } from '../contexts/WebSocketContext'; 
import { useUser } from '../contexts/UserLogContext'; 
import { useConfirmedServicesContext } from '../contexts/ServicesContext';
import { useNavigate } from 'react-router-dom';

function Map() {
  const [walkerLocation, setWalkerLocation] = useState(null); // Ubicación inicial
  const [joinedRoom, setJoinedRoom] = useState(false); // Estado para saber si ya está en la sala
  const socket = useWebSocket(); 
  const { userLog } = useUser(); 
  const { confirmedServices } = useConfirmedServicesContext(); 
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const activeServiceRef = useRef(null); // Ref para mantener el servicio activo
  const [geoData, setGeoData] = useState(null); // Estado para almacenar los datos GeoJSON
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Efecto para cargar el archivo GeoJSON
  useEffect(() => {
    // Carga el archivo GeoJSON localmente
    fetch('/barrios.geojson')
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error('Error al cargar el archivo GeoJSON:', error));
  }, []);
  
    // Función para definir el estilo de los límites de barrios
    const geoJSONStyle = {
      color: 'blue',       // Color de los bordes
      weight: 1,           // Grosor de los bordes
      fillOpacity: 0       // Sin relleno en el área
    };

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
      setJoinedRoom(true);
      socket.emit('joinRoom', { roomName, userId: userLog.id });

      // Solicitar ubicación inicial del paseador
      socket.emit('requestLocation', { roomName });

      // Escuchar actualizaciones de ubicación
      socket.on('receiveLocation', (location) => {
        setWalkerLocation([location.lat, location.long]);
      });

      // Escuchar cuando se finalice el servicio
      socket.on('serviceFinished', () => {
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
    if (userLog?.tipo === 'client' && confirmedServices.length > 0) {
      const service = confirmedServices.find(service => service.comenzado === true && service.finalizado === false);
      
      if (service && (!activeServiceRef.current || activeServiceRef.current.TurnId !== service.TurnId)) {
        activeServiceRef.current = service; // Guardamos el servicio activo en la referencia
        joinWalkerRoom(service);
      }
    }
  }, [userLog, confirmedServices, socket]);

  function CenterMapOnGeoJSON({ data, walkerLocation }) {
    const map = useMap();
    const [hasCentered, setHasCentered] = useState(false);
  
    useEffect(() => {
      if (!data || !walkerLocation || hasCentered) return;
  
      try {
        // Buscamos el barrio más cercano a la ubicación del paseador
        const closestFeature = data.features.find((feature) => {
          const coordinates = feature.geometry.coordinates[0];
          return coordinates.some(coord => {
            const [lng, lat] = coord;
            // Calculamos la distancia entre walkerLocation y el punto del barrio
            return (
              Math.abs(lat - walkerLocation[0]) < 0.05 &&
              Math.abs(lng - walkerLocation[1]) < 0.05
            );
          });
        });
  
        if (closestFeature) {
          // Extraemos los límites de ese barrio
          const latlngs = closestFeature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
          const bounds = L.latLngBounds(latlngs);
  
          // Usamos flyToBounds para centrar la vista sin bloquear el movimiento posterior
          map.flyToBounds(bounds, { maxZoom: 15 });
          setHasCentered(true); // Evita re-centrar en cada render
        }
      } catch (error) {
        console.error("Error procesando el archivo GeoJSON:", error);
      }
    }, [data, walkerLocation, map, hasCentered]);
  
    return null;
  }
  
  

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
    <MapContainer center={[-34.9011, -56.1645]} zoom={17} style={{ height: '400px', width: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {geoData && <GeoJSON data={geoData} style={geoJSONStyle}/>}
      {geoData && <CenterMapOnGeoJSON data={geoData} walkerLocation={walkerLocation}/>}
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
