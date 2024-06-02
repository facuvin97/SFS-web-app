import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ServiceRequestCard from '../../components/ServiceRequestCard';

function WalkerServicesRequests({ walkerId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1//services/walker/${walkerId}`);
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

    if (walkerId) {
      fetchServices();
    }
  }, [walkerId]);

  const handleRejectService = async (service) => {
    try {

      const response = await fetch(`http://localhost:3001/api/v1/service/${service.id}`, {
        method: 'DELETE',
      });

      //ENVIAR UNA NOTIFICACION AL CLIENTE

      if (!response.ok) {
        throw new Error('Error al eliminar el servicio');
      }
      //actualiza la lista de servicios que se muestran
      const updatedServices = services.filter((servicio) => servicio.id !== service.id);
      setServices(updatedServices);
    } catch (error) {
      console.error('Error al eliminar el servicio:', error.message);
    }
  };

  const handleAcceptService = async (service) => {
    try {

      service.aceptado = true;

      console.log(JSON.stringify(service))

      //modifica el servicio para marcarlo como aceptado
      const response = await fetch(`http://localhost:3001/api/v1/service/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(service)
      });

      //ENVIAR UNA NOTIFICACION AL CLIENTE

      if (!response.ok) {
        throw new Error('Error al aceptar el servicio');
      }
      //actualiza la lista de servicios que se muestran
      const updatedServices = services.filter((servicio) => servicio.id !== service.id);
      setServices(updatedServices);
    } catch (error) {
      console.error('Error al aceptar el servicio:', error.message);
    }
  }

  const confirmService= services.filter(service => !service.aceptado)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
        {confirmService.map((service) => (
          <Grid item key={service.id}>
            <ServiceRequestCard service={service} onAccept={() => handleAcceptService(service)} onReject={() => handleRejectService(service)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default WalkerServicesRequests;
