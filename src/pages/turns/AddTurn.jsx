import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Checkbox, FormControlLabel, FormHelperText, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SelectNeighborhood from '../../components/SelectZone';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function AddTurnForm({ userLog }) {
  const [dias, setDias] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [tarifa, setTarifa] = useState('');
  const [zona, setZona] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorHora, setErrorHora] = useState('');
  const [errorFecha, setErrorFecha] = useState('');
  const [errorTarifa, setErrorTarifa] = useState('');
  const [errorZona, setErrorZona] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [openNeighborhoodModal, setOpenNeighborhoodModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');



  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  
   // Abrir y cerrar el modal
   const handleOpenNeighborhoodModal = () => setOpenNeighborhoodModal(true);
   const handleCloseNeighborhoodModal = () => setOpenNeighborhoodModal(false);
 
   // Actualizar el barrio seleccionado en tiempo real
   const handleNeighborhoodSelect = (neighborhood) => {
     setSelectedNeighborhood(neighborhood);
     const neighborhoodName = neighborhood ? neighborhood.properties.nombre : '';
     setZona(neighborhoodName); // Actualizar el estado `zona` con el nombre del barrio seleccionado
   };

  const handleAddTurn = async () => {
    if (!token) return navigate('/')

    // Reiniciar mensajes de error
    setErrorHora('');
    setErrorTarifa('');
    setErrorZona('');
    setErrorFecha('');
    let valid = true;

    // Validar que haya seleccionado al menos un día
    if (!dias.length) {
      setErrorFecha('Debe seleccionar al menos un día');
      valid = false;
    }

    // Validar que horaInicio no sea mayor que horaFin
    if (horaInicio >= horaFin) {
      setErrorHora('La hora de inicio no puede ser mayor o igual a la hora de fin');
      valid = false; 
    }

    // Validar horaInicio y horaFin
    if (!horaInicio || !horaFin) {
      setErrorHora('La hora de inicio y la hora de fin son obligatorios');
      valid = false;
    }

    // Validar tarifa
    if (!tarifa || parseFloat(tarifa) <= 0) {
      setErrorTarifa('La tarifa debe ser un número positivo');
      valid = false; 
    }

    // Validar que zona no tenga espacios al principio o al final
    if (!/^[^\s].*[^\s]$|^[^\s]$/.test(zona)) {
      setErrorZona('La zona no debe tener espacios al principio ni al final');
      valid = false; 
    }

    // validar que la zona no sea vacia o "" (vacía)
    if (!zona || zona.trim() === '') {
      setErrorZona('La zona es obligatoria');
      valid = false; 
    }

    if (!valid) return; // Si hay errores, no continuar

    const turnoData = {
      dias,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      tarifa: parseFloat(tarifa),
      zona,
      WalkerId: userLog.id // El ID del usuario logeado se utiliza como el WalkerId del turno
    };

    try {
      if(!token){
        return navigate('/')

      }
      const response = await fetch(`${baseUrl}/turns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(turnoData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Turno agregado correctamente');
        setMensaje('Turno agregado correctamente');
        // Limpiar el formulario después de enviar los datos
        setDias([]);
        setHoraInicio('');
        setHoraFin('');
        setTarifa('');
        setZona('');
        alert('Turno agregado correctamente');
        navigate('/turns');
      } else {
        console.error('Error al agregar el turno:', response.statusText);
        setMensaje('Error al agregar el turno');
        alert(mensaje);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor');
      alert(mensaje);
    }
  }

  const handleDiaChange = (dia, checked) => {
    let nuevosDias;

    if (checked) {
      // Si se selecciona el día, se agrega a la lista
      nuevosDias = [...dias, dia];
    } else {
      // Si se deselecciona el día, se elimina de la lista
      nuevosDias = dias.filter(d => d !== dia);
    }

    // Ordenamos los días según el orden en 'diasSemana'
    nuevosDias.sort((a, b) => diasSemana.indexOf(a) - diasSemana.indexOf(b));
    setDias(nuevosDias);
  }

  return (
    <div className='account-container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <div>
              <label>Días:</label>
              <br />
              {diasSemana.map((dia) => (
                <FormControlLabel
                  key={dia}
                  control={
                    <Checkbox
                      checked={dias.includes(dia)}
                      onChange={(e) => handleDiaChange(dia, e.target.checked)}
                      name={dia}
                    />
                  }
                  label={dia}
                />
              ))}
              {errorFecha && 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FormHelperText error>{errorFecha}</FormHelperText>
                </div>
              }
            </div>
          </Grid>
          <Grid container spacing={2} padding={0} margin={0}>
            <Grid item xs={6} marginBottom={0} paddingBottom={0}>
              <TextField
                fullWidth
                label="Hora de inicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6} marginBottom={0} paddingBottom={0}>
              <TextField
                fullWidth
                label="Hora de fin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} padding={0} margin={0}>
              {errorHora && 
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                  <FormHelperText error style={{ margin: 0 }}>{errorHora}</FormHelperText>
                </div>
              }
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tarifa"
              type="number"
              value={tarifa}
              onChange={(e) => setTarifa(e.target.value)}
              variant="outlined"
              inputProps={{ min: 1 }}
              error={!!errorTarifa} // Muestra error si existe
              helperText={errorTarifa} // Muestra el mensaje de error
            />
          </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary" onClick={handleOpenNeighborhoodModal}>
                Seleccionar Barrio
              </Button>
              <TextField
                fullWidth
                label="Zona"
                value={zona}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
              {errorZona && <FormHelperText error>{errorZona}</FormHelperText>}
            </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddTurn}>
              Agregar Turno
            </Button>
          </Grid>
        </Grid>
          <Modal open={openNeighborhoodModal} onClose={handleCloseNeighborhoodModal}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: '80%', maxWidth: 600 }}>
              <SelectNeighborhood
                initialSelectedNeighborhood={selectedNeighborhood}
                onNeighborhoodSelect={handleNeighborhoodSelect}
              />
              <Button onClick={handleCloseNeighborhoodModal} variant="contained" color="secondary" style={{ marginTop: '20px' }}>
                Confirmar Selección
              </Button>
            </Box>
          </Modal>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default AddTurnForm;
