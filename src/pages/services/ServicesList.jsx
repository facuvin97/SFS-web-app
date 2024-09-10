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
  const { userLog } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      setFilteredServices(confirmedServices.filter(service => {
        const serviceDate = new Date(service.fecha);
        serviceDate.setHours(serviceDate.getHours() + 3);
        
        console.log('service.fecha: ', service.fecha);
        console.log('serviceDate: ', serviceDate);
        
        return (
          serviceDate.getFullYear() === selectedDate.getFullYear() &&
          serviceDate.getMonth() === selectedDate.getMonth() &&
          serviceDate.getDate() === selectedDate.getDate()
        );
      }));
    } else {
      setFilteredServices(confirmedServices);
    }
    setLoading(false);
  }, [confirmedServices, selectedDate]);

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
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {filteredServices.map((service) => (
            <Grid item key={service.id}>
              <ServiceCard service={service} onDelete={() => handleDeleteService(service)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Usted no tiene ningún servicio confirmado próximamente.
        </Typography>
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
