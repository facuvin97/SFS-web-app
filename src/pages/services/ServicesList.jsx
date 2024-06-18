import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useConfirmedServicesContext } from '../../contexts/ServicesContext';

function ServicesList({}) {
  const { confirmedServices, deleteService } = useConfirmedServicesContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false)
  }, [confirmedServices]);

  const handleDeleteService = async (service) => {
    const msg = await deleteService(service);
    setMensaje(msg);
  };

  const handleClick = () => {
    navigate('/add-service');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
        {confirmedServices.map((service) => (
          <Grid item key={service.id}>
            <ServiceCard service={service} onDelete={() => handleDeleteService(service)} />
          </Grid>
        ))}
      </Grid>
      {mensaje && <p>{mensaje}</p>}
    </Box>
  )
}

export default ServicesList;