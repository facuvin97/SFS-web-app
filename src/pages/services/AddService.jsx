import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function AddServiceForm({ userLog }) {
  const location = useLocation();
  const { turn } = location.state || {};

  if (userLog.tipo === 'walker') {
    throw new Error('El paseador no puede ingresar servicios.');
  }

  const [fecha, setFecha] = useState('');
  const [direccionPickUp, setDireccionPickUp] = useState('');
  const [cantidadMascotas, setCantidadMascotas] = useState('');
  const [nota, setNota] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const handleAddService = async () => {
    const serviceData = {
      fecha,
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

  return (
    <div className='account-container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
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
