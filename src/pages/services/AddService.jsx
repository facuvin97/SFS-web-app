import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO, getDay } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale';

function AddServiceForm({ userLog }) {
  const location = useLocation();
  const { turn } = location.state || {};

  console.log('Location state turn: ', turn)

  console.log(userLog)
  if (userLog.tipo === 'walker') {
    throw new Error('El paseador no puede ingresar servicios.');
  }

  const [fecha, setFecha] = useState(null);
  const [direccionPickUp, setDireccionPickUp] = useState('');
  const [cantidadMascotas, setCantidadMascotas] = useState('');
  const [nota, setNota] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  //pasamos los dias del turno a numeros
  const turnDays = turn.dias.map(day => {
    switch (day.toLowerCase()) {
      case 'lunes': return 1;
      case 'martes': return 2;
      case 'miercoles': return 3;
      case 'jueves': return 4;
      case 'viernes': return 5;
      case 'sabado': return 6;
      case 'domingo': return 0;
      default: return -1;
    }
  })

  const handleAddService = async () => {

    const selectedDay = getDay(fecha);
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];


    if (!turnDays.includes(selectedDay)) {
      setMensaje(`El día seleccionado (${dayNames[selectedDay]}) no coincide con los días permitidos del turno (${turn.dias.join(', ')}).`);
      return;
    }

    const serviceData = {
      fecha: format(fecha, 'yyyy-MM-dd'),
      direccionPickUp,
      cantidad_mascotas: parseInt(cantidadMascotas, 10),
      nota,
      TurnId: turn.id, // ID del turno seleccionado
      ClientId: userLog.id // El ID del usuario logeado se utiliza como el ClientId del servicio
    };

    try {
      const response = await fetch('http://localhost:3001/api/v1/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setFecha('');
        setDireccionPickUp('');
        setCantidadMascotas('');
        setNota('');
        navigate('/');
        alert('Servicio agregado correctamente');
      } else {
        console.error('Error al agregar el servicio:', response.statusText);
        setMensaje('Error al agregar el servicio');
        alert(mensaje);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor');
      alert(mensaje);
    }
  };

  // Función para deshabilitar días no incluidos en turnDays
  const disableDates = (date) => {
    const day = date.getDay();
    return !turnDays.includes(day);
  };

  return (
    <div className='account-container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Fecha"
              value={fecha}
              onChange={(newValue) => setFecha(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
              shouldDisableDate={disableDates}
            />
          </LocalizationProvider>
            {/* <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            /> */}

          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección de PickUp"
              value={direccionPickUp}
              onChange={(e) => setDireccionPickUp(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cantidad de Mascotas"
              type="number"
              value={cantidadMascotas}
              onChange={(e) => setCantidadMascotas(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.primary">
              <strong>Días:</strong> {turn ? turn.dias.join(', ') : ''}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.primary">
              <strong>Hora de inicio:</strong> {turn ? turn.hora_inicio : ''}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.primary">
              <strong>Hora de fin:</strong> {turn ? turn.hora_fin : ''}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddService}>
              Agregar Servicio
            </Button>
          </Grid>
        </Grid>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default AddServiceForm;
