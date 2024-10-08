import React, { useState } from 'react';
import { TextField, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function AddTurnForm({ userLog }) {
  const [dias, setDias] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [tarifa, setTarifa] = useState('');
  const [zona, setZona] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];


  const handleAddTurn = async () => {
    const turnoData = {
      dias,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      tarifa: parseFloat(tarifa),
      zona,
      WalkerId: userLog.id // El ID del usuario logeado se utiliza como el WalkerId del turno
    };

    try {
      const response = await fetch('http://localhost:3001/api/v1/turns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
        alert('Turno agregado correctamente')
        navigate('/turns')
      } else {
        console.error('Error al agregar el turno:', response.statusText);
        setMensaje('Error al agregar el turno');
        alert(mensaje)
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor');
      alert(mensaje)
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
              <br/>
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
            </div>
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tarifa"
              type="number"
              value={tarifa}
              onChange={(e) => setTarifa(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddTurn}>
              Agregar Turno
            </Button>
          </Grid>
        </Grid>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default AddTurnForm