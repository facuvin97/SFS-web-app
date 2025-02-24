import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, FormHelperText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO, getDay } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale';
import { useConfirmedServicesContext } from '../../contexts/ServicesContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function AddServiceForm({ userLog }) {
  const location = useLocation();
  const { turn } = location.state || {};
  const token = localStorage.getItem('userToken');

  if (userLog?.tipo === 'walker') {
    throw new Error('El paseador no puede ingresar servicios.');
  }

  const [fecha, setFecha] = useState(null);
  const [direccionPickUp, setDireccionPickUp] = useState('');
  const [cantidadMascotas, setCantidadMascotas] = useState('');
  const [nota, setNota] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const {setPendingServices} = useConfirmedServicesContext()
  const [errorFecha, setErrorFecha] = useState('');
  const [errorDireccion, setErrorDireccion] = useState('');
  const [errorMascotas, setErrorMascotas] = useState('');
  const [errorNota, setErrorNota] = useState('');


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
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
    // Reiniciar mensajes de error
    setErrorDireccion('');
    setErrorMascotas('');
    setErrorNota('');
    setErrorFecha('');
    let valid = true;
      
    // Validar que direccion no tenga espacios al principio o al final
    if (!/^[^\s].*[^\s]$|^[^\s]$/.test(direccionPickUp)) {
      setErrorDireccion('La zona no debe tener espacios al principio ni al final');
      valid = false; 
    }

    // validar que la direccion no sea vacia o "" (vacía)
    if (!direccionPickUp || direccionPickUp.trim() === '') {
      setErrorDireccion('La direccion es obligatoria');
      valid = false; 
    }


    // Validar que la cantidad de mascotas sea positiva
    if (!cantidadMascotas || parseFloat(cantidadMascotas) <= 0) {
      setErrorMascotas('La cantidad de mascotas debe ser un número positivo');
      valid = false; 
    }

    //validar que la nota no sea mayor a 255 caracteres
    if(nota.length > 255){
      setErrorNota('La nota no puede tener mas de 255 caracteres');
      valid = false;
    }

    const selectedDay = getDay(fecha);
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];


    // Validar que la fecha esté en un día permitido y no esté vacía
    if (!fecha) {
      setErrorFecha('La fecha no puede estar vacía');
      valid = false;
    } else if (selectedDay < 0 || selectedDay > 6) {
      setErrorFecha('Debe seleccionar un día válido');
      valid = false;
    } else if (!turnDays.includes(selectedDay)) {
      setErrorFecha(`El día seleccionado (${dayNames[selectedDay]}) no coincide con los días permitidos del turno (${turn.dias.join(', ')}).`);
      valid = false;
    }

    // Validar que la fecha no sea anterior a hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00 para comparar solo las fechas
    if (fecha < today) {
      setErrorFecha('La fecha no puede ser anterior a hoy');
      valid = false;
    }
    
    // si fecha seleccionada es la fecha de hoy
    if (fecha.getDate() === today.getDate()) {
      //comprobar que la hora actual, no sea mayor a la hora de fin que viene en formato string
      const horaFin = new Date();
      horaFin.setHours(parseInt(turn.hora_fin.split(':')[0]), parseInt(turn.hora_fin.split(':')[1]), 0, 0);
      if(horaFin < new Date()){
        setErrorFecha('No puede solicitar un servicio para hoy, porque ya se ha terminado el turno');
        valid = false;
      }
    }

    if (!valid) return; // Si hay errores, no continuar

    const serviceData = {
      fecha: format(fecha, 'yyyy-MM-dd'),
      direccionPickUp,
      cantidad_mascotas: parseInt(cantidadMascotas, 10),
      nota,
      TurnId: turn.id, // ID del turno seleccionado
      ClientId: userLog.id // El ID del usuario logeado se utiliza como el ClientId del servicio
    };
    try {

      const response = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
        
      });

      if (response.ok) {
        const responseData = await response.json();

        setPendingServices((prevPendingServices) => [...prevPendingServices, responseData.data]);

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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00 para comparar solo las fechas
  
    // Deshabilitar días no permitidos y fechas anteriores a hoy
    return !turnDays.includes(day) || date < today;
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
            {errorFecha && 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FormHelperText error>{errorFecha}</FormHelperText>
                </div>
              }
          </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección de PickUp"
              value={direccionPickUp}
              onChange={(e) => setDireccionPickUp(e.target.value)}
              variant="outlined"
              error={!!errorDireccion} // Muestra error si existe
              helperText={errorDireccion} // Muestra el mensaje de error
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
              inputProps={{ min: 1 }}
              error={!!errorMascotas} // Muestra error si existe
              helperText={errorMascotas} // Muestra el mensaje de error
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              variant="outlined"
              error={!!errorNota} // Muestra error si existe
              helperText={errorNota} // Muestra el mensaje de error
            />
          </Grid>
          <Grid item xs={12}>
          <Typography variant="body1" color="text.primary">
              <strong>Tarifa:</strong> ${turn.tarifa}
          </Typography>
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
          <Typography variant="body1" color="text.primary">
              <strong>Total:</strong> ${turn.tarifa * cantidadMascotas}
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
