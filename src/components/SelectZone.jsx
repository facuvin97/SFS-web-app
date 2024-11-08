import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

function SelectNeighborhood({ initialSelectedNeighborhood = null, onNeighborhoodSelect }) {
  const [geoData, setGeoData] = useState(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialSelectedNeighborhood);
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Cargar el archivo GeoJSON
  useEffect(() => {
    fetch('/barrios.geojson')
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error('Error al cargar el archivo GeoJSON:', error));
  }, []);

  // Actualiza el barrio seleccionado cuando `initialSelectedNeighborhood` cambia
  useEffect(() => {
    setSelectedNeighborhood(initialSelectedNeighborhood);
  }, [initialSelectedNeighborhood]);

  // Estilo para los barrios
  const geoJSONStyle = (feature) => ({
    color: selectedNeighborhood && selectedNeighborhood.properties.nombre === feature.properties.nombre ? 'red' : 'blue', // Resalta el barrio seleccionado
    weight: 2,
    fillOpacity: hoveredNeighborhood === feature ? 0.4 : 0.2, // Cambia opacidad al hacer hover
  });

  // Función para manejar el clic en un barrio
  const handleNeighborhoodClick = (feature) => {
    const isSelected = selectedNeighborhood && selectedNeighborhood.properties.nombre === feature.properties.nombre;
    const updatedSelected = isSelected ? null : feature; // Si ya está seleccionado, lo deseleccionamos
    setSelectedNeighborhood(updatedSelected);
    onNeighborhoodSelect(updatedSelected); // Actualizar en el formulario
  };

  // Función para manejar el hover
  const handleNeighborhoodHover = (feature) => {
    setHoveredNeighborhood(feature);
  };

  return (
    <div>
      <h3>Selecciona el barrio donde trabajar:</h3>
      <MapContainer center={[-34.9011, -56.1645]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={geoJSONStyle}
            onEachFeature={(feature, layer) => {
              layer.on('click', () => handleNeighborhoodClick(feature));
              layer.on('mouseover', () => handleNeighborhoodHover(feature));
              layer.on('mouseout', () => setHoveredNeighborhood(null));
              layer.bindTooltip(feature.properties.nombre, { sticky: true });
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default SelectNeighborhood;
