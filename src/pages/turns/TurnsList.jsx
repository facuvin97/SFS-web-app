import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TurnCard from '../../components/TurnCard'; // Asegúrate de que la ruta es correcta
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Tooltip } from '@mui/material';

function TurnsList({ walkerId }) {
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate= useNavigate()

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

  const handleClick = async () => {
    navigate('/agregar-turno')
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ maxWidth: 345 }}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Nuevo Turno
              </Typography>
              <Tooltip title='Agregar turno' arrow>
                <IconButton aria-label="agregar" size='large'>
                  <AddIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
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
