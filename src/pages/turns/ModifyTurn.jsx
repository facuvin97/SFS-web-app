import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';

function ModifyTurn() {
  const location = useLocation();
  const turn = location.state.turn;
  const navigate = useNavigate();

  // Estado para almacenar los datos del formulario
  const [turnData, setTurnData] = useState({
    dias: turn.dias || [],
    hora_inicio: turn.hora_inicio || '',
    hora_fin: turn.hora_fin || '',
    tarifa: turn.tarifa || 0,
    zona: turn.zona || ''
  });

  const [mensaje, setMensaje] = useState(null);

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTurnData({
      ...turnData,
      [name]: value
    });
  };

  // Función para manejar cambios en los checkboxes de días
  const handleDayChange = (e) => {
    const { name, checked } = e.target;
    setTurnData((prevData) => ({
      ...prevData,
      dias: checked ? [...prevData.dias, name] : prevData.dias.filter((d) => d !== name)
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/v1/turns/${turn.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(turnData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Turno modificado correctamente');
        setMensaje(responseData.message);
        navigate('/turns');
      } else {
        console.error('Error al modificar turno:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="account-container">
      <h2>Modificar Turno</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <div>
              <label>Días:</label>
              <br />
              {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado', 'domingo'].map((dia) => (
                <FormControlLabel
                  key={dia}
                  control={
                    <Checkbox
                      checked={turnData.dias.includes(dia)}
                      onChange={handleDayChange}
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
              label="Hora de Inicio"
              type="time"
              name="hora_inicio"
              value={turnData.hora_inicio}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Hora de Fin"
              type="time"
              name="hora_fin"
              value={turnData.hora_fin}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tarifa"
              type="number"
              name='tarifa'
              value={turnData.tarifa}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='text'
              label="Zona"
              name='zona'
              value={turnData.zona}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
              Modificar
            </Button>
          </Grid>
        </Grid>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default ModifyTurn;
