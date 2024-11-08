import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useConfirmedServicesContext } from '../../contexts/ServicesContext';
import { Typography, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useUser } from '../../contexts/UserLogContext';

function ServicesList({}) {
  const { confirmedServices, deleteService, pendingServices } = useConfirmedServicesContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [inProgressServices, setInProgressServices] = useState([]); // Nuevo estado para servicios confirmados en ejecución
  const [notInProgressServices, setNotInProgressServices] = useState([]); // Nuevo estado para servicios confirmados no en ejecución
  const { userLog } = useUser();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

// Primer useEffect: Filtra y actualiza inProgressServices y notInProgressServices solo cuando cambie confirmedServices
useEffect(() => {
  const inProgress = confirmedServices.filter(service => service.comenzado && !service.finalizado);
  setInProgressServices(inProgress);

  const notInProgress = confirmedServices.filter(service => !service.comenzado);
  setNotInProgressServices(notInProgress);

  setLoading(false);
}, [confirmedServices]); // Dependemos solo de confirmedServices

// Segundo useEffect: Filtra y actualiza filteredServices cuando cambien notInProgressServices o selectedDate
useEffect(() => {
  if (selectedDate) {
    setFilteredServices(
      notInProgressServices.filter(service => {
        const serviceDate = new Date(service.fecha);
        serviceDate.setHours(serviceDate.getHours() + 3);

        return (
          serviceDate.getFullYear() === selectedDate.getFullYear() &&
          serviceDate.getMonth() === selectedDate.getMonth() &&
          serviceDate.getDate() === selectedDate.getDate()
        );
      })
    );
  } else {
    setFilteredServices(notInProgressServices);
  }
}, [selectedDate, notInProgressServices]); // Dependemos solo de selectedDate y notInProgressServices



  const handleDeleteService = async (service) => {
    const msg = await deleteService(service);
    setMensaje(msg);
  };

  

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {confirmedServices.length > 0 && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Filtrar por fecha"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: false } }}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClearFilter}
            sx={{ mt: 2 }}
          >
            Limpiar filtro
          </Button>
        </>
      )}
      {filteredServices.length > 0 ? (
        <>
        <Typography variant="h2" sx={{ mt: 4 }}>
        Proximos servicios confirmados
        </Typography>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {filteredServices.map((service) => (
            <Grid item key={service.id}>
              <ServiceCard service={service} onDelete={() => handleDeleteService(service)} />
            </Grid>
          ))}
        </Grid>
        </>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Usted no tiene ningún servicio confirmado próximamente.
        </Typography>
      )}
            {inProgressServices.length > 0 && (
        <>
          <Typography variant="h2" sx={{ mt: 4 }}>
            Servicios en ejecución
          </Typography>
          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            {inProgressServices.map((service) => (
              <Grid item key={service.id}>
                <ServiceCard service={service} viewLocation={true} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {userLog.tipo === 'client' && (
        pendingServices[0] ? (
          <>
            <Typography variant='h2'>
              Servicios pendientes.
            </Typography>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              {pendingServices.map((service) => (
                <Grid item key={service.id}>
                  <ServiceCard service={service} onDelete={() => handleDeleteService(service)} />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No hay servicios pendientes.
          </Typography>
        )
      )}
      {mensaje && <p>{mensaje}</p>}
    </Box>
  );
}

export default ServicesList;
