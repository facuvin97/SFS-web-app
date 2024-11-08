import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

const ClientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [pets, setPets] = useState([]);
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const response = await fetch(`/api/v1/clients/${location.state.client.id}/pets`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        if (response.ok) {
          const data = await response.json();
          setClient(location.state.client);
          setPets(data.body);
        } else {
          console.error('Error al obtener los datos del cliente y sus mascotas:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener los datos del cliente y sus mascotas:', error);
      }
    };

    if (location.state && location.state.client) {
      fetchData();
    }
  }, [location.state]);

  if (!client) {
    return <p>Cargando...</p>;
  }

  const clientImage = client.imageSrc || 'path/to/default/image.png'; // Ruta de la imagen por defecto si no hay imagen

  const handleAddService = (pet) => {
    navigate('/add-service', { state: { pet } });
  };

  return (
    <Container maxWidth="md" sx={{ p: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar alt={client.User.nombre_usuario} src={clientImage} sx={{ width: 100, height: 100, mr: 2, border: '2px solid #fff', boxShadow: 3 }} />
          <Typography variant="h4" component="div">
            {client.User.nombre_usuario}
          </Typography>
        </Box>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Mascotas:
        </Typography>
        {pets && pets.length > 0 ? (
          pets.map((pet, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body1" color="text.primary">
                <strong>Nombre:</strong> {pet.nombre}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Tipo:</strong> {pet.tipo}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Edad:</strong> {pet.edad}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleAddService(pet)}>
                Solicitar Servicio
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No hay mascotas registradas.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ClientDetails;
