import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useConfirmedServicesContext } from '../../contexts/ServicesContext';
import { Typography } from '@mui/material';
import { useUser } from '../../contexts/UserLogContext';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ServiceHistory({}) {
  const { oldServices} = useConfirmedServicesContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const { userLog } = useUser()
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  



  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    setLoading(false)
  }, [oldServices]);

  const handleReview = async (service) => {
    const serviceId = service.id;
    console.log('urlBase', baseUrl)


    if (userLog.tipo === 'walker') { //si la reseña la escribe un paseador
      navigate(`/add-review/${service.ClientId}`, { state: { serviceId } }) //el receiver es el cliente del servicio
    } else { //si la reseña la escribe un cliente
  
      const response = await fetch(`${baseUrl}/turns/${service.TurnId}`, { 
        headers: { 
          'Authorization': `Bearer ${token}` 
        } 
    }); //voy a buscar el turno para obtener el id del paseador
      const turnData = await response.json();

      navigate(`/add-review/${turnData.body.WalkerId}`, { state: { serviceId }}) //el receiver es el paseador que esta en el turno
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {oldServices.length > 0 ? (
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
          {oldServices.map((service) => (
            <Grid item key={service.id}>
              <ServiceCard service={service} onReview={() => handleReview(service)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Usted no tiene ningun servicio en su historial.
        </Typography>
      )
      }
      {mensaje && <p>{mensaje}</p>}
    </Box>
  )
}

export default ServiceHistory;