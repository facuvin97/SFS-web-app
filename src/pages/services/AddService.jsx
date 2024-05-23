import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddServiceForm({ userLog }) {
  if(userLog.tipo === 'walker'){
    throw error('El paseador no puede ingresar servicios.')
  }
  const [fecha, setFecha] = useState('');
  const [direccionPickUp, setDireccionPickUp] = useState('');
  const [cantidadMascotas, setCantidadMascotas] = useState('');
  const [nota, setNota] = useState('');
  const [turnId, setTurnId] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const handleAddService = async () => {
    const serviceData = {
      fecha,
      direccionPickUp,
      cantidad_mascotas: parseInt(cantidadMascotas, 10),
      nota,
      TurnId: parseInt(turnId, 10),//falta manejar el turno seleccionado
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
        //console.log('Servicio agregado correctamente');
        //setMensaje('Servicio agregado correctamente');
        setFecha('');
        setDireccionPickUp('');
        setCantidadMascotas('');
        setNota('');
        setTurnId('');
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
            <TextField
              fullWidth
              label="ID del Turno"
              type="number"
              value={turnId}
              onChange={(e) => setTurnId(e.target.value)}
              variant="outlined"
            />
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

export default AddServiceForm