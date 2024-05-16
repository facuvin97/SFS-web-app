import React, { useState } from 'react';
import { TextField, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';

export default function AddTurnForm({ userLog }) {
  const [dias, setDias] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [tarifa, setTarifa] = useState('');
  const [zona, setZona] = useState('');

  const handleAddTurn = () => {
    // Aquí podrías enviar los datos del turno a tu API para guardarlo en la base de datos
    console.log({
      dias,
      horaInicio,
      horaFin,
      tarifa,
      zona,
      WalkerId: userLog.id // El ID del usuario logeado se utiliza como el WalkerId del turno
    });

    // Aquí podrías realizar la lógica para enviar los datos del turno a tu servidor

    // Después de enviar los datos, podrías limpiar el formulario
    setDias([]);
    setHoraInicio('');
    setHoraFin('');
    setTarifa('');
    setZona('');
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControlLabel
            fullWidth
            label="Días"
            control={
              <div>
                {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map((dia) => (
                  <FormControlLabel
                    key={dia}
                    control={
                      <Checkbox
                        checked={dias.includes(dia)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setDias(prevDias => checked ? [...prevDias, dia] : prevDias.filter(d => d !== dia));
                        }}
                        name={dia}
                      />
                    }
                    label={dia}
                  />
                ))}
              </div>
            }
          />
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
    </form>
  );
}
