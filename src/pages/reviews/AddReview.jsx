import React, { useState } from 'react';
import { TextField, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserLogContext';
import { useConfirmedServicesContext } from '../../contexts/ServicesContext'


function AddReviewForm() {
  const [valoracion, setValoracion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const { userLog } = useUser()
  const { receiverId } = useParams()
  const location = useLocation();
  const { serviceId } = location.state || 15;
  const { getConfirmedServices } = useConfirmedServicesContext()


  const handleAddReview = async () => {
    const reviewData = {
      valoracion: valoracion,
      descripcion: descripcion,
      writerId: userLog.id,
      receiverId: parseInt(receiverId),
      serviceId: serviceId
    };

    console.log('reviewData: ', reviewData)
    try {
      const response = await fetch('http://localhost:3001/api/v1/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Reseña agregada correctamente');
        setMensaje('Reseña agregada correctamente');
        // Limpiar el formulario después de enviar los datos
        setValoracion('');
        setDescripcion('');
        alert('Reseña agregada correctamente')
        getConfirmedServices() //actualizo la lista de servicios en el context
        navigate('/service-history')
      } else {
        console.error('Error al agregar la reseña:', response.statusText);
        setMensaje('Error al agregar la reseña');
        alert(mensaje)
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor');
      alert(mensaje)
    }
  };

  return (
    <div className='account-container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Valoracion"
              type="number"
              value={valoracion}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value >= 1 && value <= 5) {
                  setValoracion(value);
                } else if (e.target.value === '') {
                  setValoracion('');
                }
              }}
              variant="outlined"
              inputProps={{
                min: 1,
                max: 5,
                step: 1,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddReview}>
              EnviarReseña
            </Button>
          </Grid>
        </Grid>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default AddReviewForm