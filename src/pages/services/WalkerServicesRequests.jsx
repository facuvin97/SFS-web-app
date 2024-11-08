import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ServiceRequestCard from '../../components/ServiceRequestCard';
import {useConfirmedServicesContext} from '../../contexts/ServicesContext'
import { Typography } from '@mui/material';
import { useUser } from '../../contexts/UserLogContext';

function WalkerServicesRequests({ walkerId }) {
  const {pendingServices, deleteService, authorizeService} = useConfirmedServicesContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userLog } = useUser();
  const token = localStorage.getItem('userToken');



  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  useEffect(() => {
    if (userLog.tipo !== 'walker') {
      navigate('/')
    }
  });

  const handleRejectService = async (service) => {
    try {

      const msg = await deleteService(service)
      alert(msg)

     } catch (error) {
      console.error('Error al eliminar el servicio:', error.message);
    }
  };

  const handleAcceptService = async (service) => {
    try {
      const msg = await authorizeService(service);
      alert(msg)

    } catch (error) {
      console.error('Error al aceptar el servicio:', error.message);
    }
  }


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
