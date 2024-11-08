import React, { useEffect } from 'react';
import { useLocation , useNavigate} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

const WalkerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { walker, turns } = location.state || {};
  const token = localStorage.getItem('userToken');

  // si no hay token redirijo al inicio
  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  if (!walker || !walker.User) {
    return <p>No hay datos disponibles para este paseador.</p>;
  }
  

  const walkerImage = walker.imageSrc || 'path/to/default/image.png'; // Ruta de la imagen por defecto si no hay imagen
  
  const handleAddService = (turn) => {
    navigate('/add-service', { state: { turn } });
  };

  return (
    <Container maxWidth="md" sx={{ p: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar alt={walker.User.nombre_usuario} src={walkerImage} sx={{ width: 100, height: 100, mr: 2, border: '2px solid #fff', boxShadow: 3 }} />
          <Typography variant="h4" component="div">
            {walker.User.nombre_usuario}
          </Typography>
        </Box>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Turnos:
        </Typography>
        {turns && turns.length > 0 ? (
          turns.map((turn, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body1" color="text.primary">
                <strong>Zona:</strong> {turn.zona}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Días:</strong> {turn.dias.join(', ')}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Hora de inicio:</strong> {turn.hora_inicio}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Hora de fin:</strong> {turn.hora_fin}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleAddService(turn)}>
                solicitar Servicio
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No hay turnos disponibles.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default WalkerDetails;
