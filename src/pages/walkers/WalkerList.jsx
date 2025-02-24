import React, { useEffect, useState } from 'react';
import WalkerCard from '../../components/WalkerCard'; 
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { WalkersImageContextProvider } from '../../contexts/WalkersImageContext';
import StarIcon from '@mui/icons-material/Star';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;


function WalkersList() {
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    calificacion: 0,
    zona: '',
    tarifa: ''
  });
  const [maxDistance, setMaxDistance] = useState('');
  const [clientLocation, setClientLocation] = useState(null);
  const [zones, setZones] = useState({});
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);


  // Función para calcular la distancia entre dos coordenadas (fórmula de Haversine)
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Resultado en km
  };

  // Obtener la ubicación del cliente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setClientLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error("Error obteniendo ubicación:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Cargar el archivo barrios.geojson para obtener las coordenadas de cada zona
  useEffect(() => {
    fetch('/barrios.geojson')
      .then((response) => response.json())
      .then((data) => {
        const zonesData = data.features.reduce((acc, feature) => {
          const { nombre } = feature.properties;
          const coordinates = feature.geometry.coordinates[0][0]; // Primera coordenada de cada barrio
          acc[nombre] = { lat: coordinates[1], lon: coordinates[0] };
          return acc;
        }, {});
        setZones(zonesData);
      })
      .catch((error) => console.error("Error cargando barrios.geojson:", error));
  }, []);

  // Carga los datos de los paseadores
  useEffect(() => {
    const fetchWalkers = async () => {
      try {
        if(!token){
          return navigate('/');
        }
        const response = await fetch(`${baseUrl}/walkers`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('data.body en turn', data);
        //filtra los paseadores que no tienen turnos
        const filteredWalkers = data.body.filter((walker) => walker.Turns.length > 0);
        setWalkers(filteredWalkers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalkers();
  }, [token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleRatingChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      calificacion: event.target.value
    }));
  };

  const handleDistanceChange = (event) => {
    setMaxDistance(event.target.value);
  };

  const filteredWalkers = walkers.filter((walker) => {
    const calificacionMatch = filters.calificacion ? walker.User.calificacion >= filters.calificacion : true;
    const zonaMatch = filters.zona ? walker.Turns.some(turn => turn.zona.toLowerCase().includes(filters.zona.toLowerCase())) : true;
    const tarifaMatch = filters.tarifa ? walker.Turns.some(turn =>parseFloat(turn.tarifa) <= parseFloat(filters.tarifa)) : true;

    const distanceMatch = maxDistance && clientLocation
      ? walker.Turns.some((turn) => {
          const zoneCoordinates = zones[turn.zona];
          if (!zoneCoordinates) return false;
          const distance = haversineDistance(
            clientLocation.lat,
            clientLocation.lon,
            zoneCoordinates.lat,
            zoneCoordinates.lon
          );
          return distance <= maxDistance;
        })
      : true;

    return calificacionMatch && zonaMatch && tarifaMatch && distanceMatch;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <WalkersImageContextProvider>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 2 }}>
        <FormControl sx={{ backgroundColor: '#333', borderRadius: 1, padding: 1, color: '#ccc', minWidth: 150 }}>
          <InputLabel id="rating-label" sx={{ color: '#ccc' }}>Calificación</InputLabel>
          <Select
            labelId="rating-label"
            id="rating-select"
            value={filters.calificacion}
            onChange={handleRatingChange}
            label="Calificación"
            sx={{ color: '#ccc' }}
          >
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating === 0 ? 'Sin filtrar' : (
                  <>
                    {rating}
                    {Array.from({ length: rating }, (_, i) => (
                      <StarIcon key={i} sx={{ color: 'yellow' }} />
                    ))}
                  </>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          
        <input
          type="text"
          name="zona"
          placeholder="Zona"
          value={filters.zona}
          onChange={handleFilterChange}
          style={{
            backgroundColor: '#333',
            color: '#ccc',
            borderRadius: '4px',
            padding: '8px',
            border: '1px solid #444',
            marginLeft: '8px'
          }}
        />

        <input
          type="number"
          name="tarifa"
          placeholder="Tarifa máxima"
          value={filters.tarifa}
          onChange={handleFilterChange}
          style={{
            backgroundColor: '#333',
            color: '#ccc',
            borderRadius: '4px',
            padding: '8px',
            border: '1px solid #444',
            marginLeft: '8px'
          }}
        />

        <input
          type="number"
          placeholder="Distancia máxima (km)"
          value={maxDistance}
          onChange={handleDistanceChange}
          style={{
            backgroundColor: '#333',
            color: '#ccc',
            borderRadius: '4px',
            padding: '8px',
            border: '1px solid #444',
            marginLeft: '8px'
          }}
        />
        <Button
          onClick={() => {
            setFilters({
              calificacion: 0,
              zona: '',
              tarifa: ''
            });
            setMaxDistance('');
          }}
          style={{
            minWidth: 'auto', 
            backgroundColor: '#333',
            color: '#ccc',
            borderRadius: '50%',
            padding: '8px',
            marginLeft: '8px'
          }}
        >
          <ClearIcon />
        </Button>
        </Box>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {filteredWalkers.map((walker) => (
            <Grid item key={walker.id}>
              <WalkerCard walker={walker} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </WalkersImageContextProvider>
  );
}

export default WalkersList;
