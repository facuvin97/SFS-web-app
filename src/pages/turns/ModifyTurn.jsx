import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControlLabel, Checkbox, Button, FormHelperText } from '@mui/material';

function ModifyTurn() {
  const location = useLocation();
  const turn = location.state.turn;
  const navigate = useNavigate();
  const [errorHora, setErrorHora] = useState('');
  const [errorFecha, setErrorFecha] = useState('');
  const [errorTarifa, setErrorTarifa] = useState('');
  const [errorZona, setErrorZona] = useState('');
  const token = localStorage.getItem('userToken');
  

  // Estado para almacenar los datos del formulario
  const [turnData, setTurnData] = useState({
    dias: turn.dias || [],
    hora_inicio: turn.hora_inicio || '',
    hora_fin: turn.hora_fin || '',
    tarifa: turn.tarifa || 0,
    zona: turn.zona || ''
  });

  const [mensaje, setMensaje] = useState(null);

  const diasOrdenados = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];


  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTurnData({
      ...turnData,
      [name]: value
    });
  };

  // Función para manejar cambios en los checkboxes de días
    // Función para manejar cambios en los checkboxes de días
    const handleDayChange = (e) => {
      const { name, checked } = e.target;
      let updatedDias = checked
        ? [...turnData.dias, name]
        : turnData.dias.filter((d) => d !== name);
      
      // Ordenar los días según el array de referencia
      updatedDias = updatedDias.sort((a, b) => diasOrdenados.indexOf(a) - diasOrdenados.indexOf(b));
  
      setTurnData((prevData) => ({
        ...prevData,
        dias: updatedDias
      }));
    };
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reiniciar mensajes de error
    setErrorHora('');
    setErrorTarifa('');
    setErrorZona('');
    setErrorFecha('');

    let valid = true;

    // Validar que haya seleccionado al menos un día
    if (!turnData.dias.length) {
      setErrorFecha('Debe seleccionar al menos un día');
      valid = false;
    }

    // Validar que horaInicio no sea mayor que horaFin
    if (turnData.hora_inicio >= turnData.hora_fin) {
      setErrorHora('La hora de inicio no puede ser mayor o igual a la hora de fin');
      valid = false; 
    }

    // Validar horaInicio y horaFin
    if (!turnData.hora_inicio || !turnData.hora_fin) {
      setErrorHora('La hora de inicio y la hora de fin son obligatorios');
      valid = false;
    }

    // Validar tarifa
    if (!turnData.tarifa || parseFloat(turnData.tarifa) <= 0) {
      setErrorTarifa('La tarifa debe ser un número positivo');
      valid = false; 
    }

    // Validar que zona no tenga espacios al principio o al final
    if (!/^[^\s].*[^\s]$|^[^\s]$/.test(turnData.zona)) {
      setErrorZona('La zona no debe tener espacios al principio ni al final');
      valid = false; 
    }

    // validar que la zona no sea vacia o "" (vacía)
    if (!turnData.zona || turnData.zona.trim() === '') {
      setErrorZona('La zona es obligatoria');
      valid = false; 
    }

    if (!valid) return; // Si hay errores, no continuar

    

    try {
      if(!token){
        return alert('Usuario no autorizado')
      }
      const response = await fetch(`http://localhost:3001/api/v1/turns/${turn.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(turnData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setMensaje(responseData.message);
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
              {diasOrdenados.map((dia) => (
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
              {errorFecha && 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FormHelperText error>{errorFecha}</FormHelperText>
                </div>
              }
            </div>
          </Grid>
          <Grid container spacing={2} padding={0} margin={0}>
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
              name='tarifa'
              value={turnData.tarifa}
              onChange={handleInputChange}
              variant="outlined"
              inputProps={{ min: 1 }}
              error={!!errorTarifa} // Muestra error si existe
              helperText={errorTarifa} // Muestra el mensaje de error
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
              error={!!errorZona} // Muestra error si existe
              helperText={errorZona} // Muestra el mensaje de error
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
