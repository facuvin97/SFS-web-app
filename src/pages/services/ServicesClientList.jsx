import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard'; // Asegúrate de que la ruta es correcta
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ServicesList({ clientId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${baseUrl}/services/client/${clientId}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServices(data.body);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchServices();
    }
  }, [clientId]);

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(`${baseUrl}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el servicio');
      }
      const updatedServices = services.filter((service) => service.id !== serviceId);
      setServices(updatedServices);
    } catch (error) {
      console.error('Error al eliminar el servicio:', error.message);
    }
  };

  const handleClick = () => {
    navigate('/add-service');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<Box sx={{ flexGrow: 1, p: 2 }}>
  <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
    <Grid item>
      <Card
        sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
        onClick={handleClick}
      >
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            Nuevo Servicio
          </Typography>
          <Tooltip title='Agregar servicio' arrow>
            <IconButton aria-label="agregar" size='large'>
              <AddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </CardContent>
      </Card>
    </Grid>
    {services.map((service) => (
      <Grid item key={service.id}>
        <ServiceCard service={service} onDelete={() => handleDeleteService(service.id)} />
      </Grid>
    ))}
  </Grid>
</Box>


  )
}

export default ServicesList;
