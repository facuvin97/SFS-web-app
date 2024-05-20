import React, { useEffect, useState } from 'react';
import TurnCard from './TurnCard'; // Asegúrate de que la ruta es correcta
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

function TurnsList({ walkerId }) {
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurns = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/turns/walker/${walkerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTurns(data.body);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (walkerId) {
      fetchTurns();
    }
  }, [walkerId]);

  const handleDeleteTurn = async (turnId) => {
    // Lógica para eliminar el turno con el ID proporcionado
    try {
      const response = await fetch(`http://localhost:3001/api/v1/turn/${turnId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el turno');
      }
      // Actualizar la lista de turnos después de la eliminación
      const updatedTurns = turns.filter((turn) => turn.id !== turnId);
      setTurns(updatedTurns);
    } catch (error) {
      console.error('Error al eliminar el turno:', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {turns.map((turn) => (
          <Grid item xs={12} sm={6} md={4} key={turn.id}>
            <TurnCard turn={turn} onDelete={() => handleDeleteTurn(turn.id)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default TurnsList;
