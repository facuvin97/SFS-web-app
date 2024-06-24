import React, { useEffect, useState } from 'react';
import WalkerCard from '../../components/WalkerCard'; 
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { WalkersImageContextProvider } from '../../contexts/WalkersImageContext';

function WalkersList() {
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({  // estado para los filtros
    calificacion: '',
    zona: '',
    tarifa: ''
  });

  //carga la lista de walkers en el primer render
  useEffect(() => {
    const fetchWalkers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/walkers`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWalkers(data.body);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalkers();
  }, []);

  // funcion para el manejo de los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // lista de paseadores con los filtros aplicados
  const filteredWalkers = walkers.filter((walker) => {
    const calificacionMatch = filters.calificacion ? walker.User.calificacion >= filters.calificacion : true;
    const zonaMatch = filters.zona ? walker.Turns.some(turn => turn.zona.toLowerCase().includes(filters.zona.toLowerCase())) : true;
    const tarifaMatch = filters.tarifa ? walker.Turns.some(turn =>parseFloat(turn.tarifa) <= parseFloat(filters.tarifa)) : true;
  
    return calificacionMatch && zonaMatch && tarifaMatch;
  });


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <WalkersImageContextProvider>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <select
            name="calificacion"
            value={filters.calificacion}
            onChange={handleFilterChange}
          >
            <option value="">Sin filtrar</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <input
            type="text"
            name="zona"
            placeholder="Zona"
            value={filters.zona}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="tarifa"
            placeholder="Tarifa máxima"
            value={filters.tarifa}
            onChange={handleFilterChange}
          />
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
