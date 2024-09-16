import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function Map() {
  const [walkerLocation, setWalkerLocation] = useState([ -34.9011, -56.1645 ]) // latitud y longitud en mdeo

  // Componente que centra el mapa cada vez que la ubicación cambia
  function CenterMapOnLocation({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView(location); // Centra el mapa en la nueva ubicación
      }
    }, [location, map]);
    return null;
  }

   // Obtener ubicación en tiempo real
   useEffect(() => {
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
  }, []);

  return (
      <MapContainer center={walkerLocation} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={walkerLocation}>
          <Popup>
            Ubicación actual del paseador.
          </Popup>
        </Marker>
        {/* Componente para centrar el mapa en la ubicación actual */}
        <CenterMapOnLocation location={walkerLocation} />
      </MapContainer>
  )
}

export default Map