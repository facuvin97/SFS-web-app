import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ServiceRequestCard from '../../components/ServiceRequestCard';
import { useServicesContext } from '../../contexts/ServiceContext';
import { Typography } from '@mui/material';

function WalkerServicesRequests({ walkerId }) {
  const {pendingServices, setPendingServices, deleteService, authorizeService} = useServicesContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // window.addEventListener('beforeunload', () => {
  //   // Guardar datos en LocalStorage
  //   localStorage.setItem('pendingServices', JSON.stringify(pendingServices));
  // });

  // useEffect(() => {
  //   // Recuperar datos del LocalStorage al cargar la página
  //   const storedData = localStorage.getItem('pendingServices');
  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData);
  //     // Usar los datos recuperados
  //     // Por ejemplo, establecer el estado de un contexto
  //     setPendingServices(parsedData);
  //   }
  // }, []);
  

  console.log('En walkerServiceRequest: ', pendingServices);

  // useEffect(() => {
  //   const fetchServices = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3001/api/v1//services/walker/${walkerId}`);
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setServices(data.body);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (walkerId) {
  //     fetchServices();
  //   }
  // }, [walkerId]);

  const handleRejectService = async (service) => {
    try {

      // const response = await fetch(`http://localhost:3001/api/v1/service/${service.id}`, {
      //   method: 'DELETE',
      // });

      deleteService(service.id)


      //ENVIAR UNA NOTIFICACION AL CLIENTE


      // if (!response.ok) {
      //   throw new Error('Error al eliminar el servicio');
      // }
      //actualiza la lista de servicios que se muestran
      // const updatedServices = services.filter((servicio) => servicio.id !== service.id);
      // setServices(updatedServices);
    } catch (error) {
      console.error('Error al eliminar el servicio:', error.message);
    }
  };

  const handleAcceptService = async (service) => {
    try {
      authorizeService(service);

      //ENVIAR UNA NOTIFICACION AL CLIENTE

    } catch (error) {
      console.error('Error al aceptar el servicio:', error.message);
    }
  }

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {pendingServices.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No hay servicios disponibles.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {pendingServices.map((service) => (
            <Grid item key={service.id}>
              <ServiceRequestCard service={service} onAccept={() => handleAcceptService(service)} onReject={() => handleRejectService(service)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default WalkerServicesRequests;
