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

function WalkersList() {
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    calificacion: 0,
    zona: '',
    tarifa: ''
  });
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchWalkers = async () => {
      try {
        if(!token){
          return alert('Usuario no autorizado')
        }
        const response = await fetch(`http://localhost:3001/api/v1/walkers`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 2 }}>
          <FormControl>
            <InputLabel id="rating-label">Calificación</InputLabel>
            <Select
              labelId="rating-label"
              id="rating-select"
              value={filters.calificacion}
              onChange={handleRatingChange}
              label="Calificación"
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
