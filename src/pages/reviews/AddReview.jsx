import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserLogContext';
import { useConfirmedServicesContext } from '../../contexts/ServicesContext'

const baseUrl = import.meta.env.VITE_API_BASE_URL;


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
  const [errorDescripcion, setErrorDescripcion] = useState('');
  const [errorValoracion, setErrorValoracion] = useState('');
  const token = localStorage.getItem('userToken');


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleAddReview = async () => {

    // reinicio el estado de error
    setErrorDescripcion('')
    setErrorValoracion('')

    let valid = true;

    // Validar tarifa
    if (!valoracion || parseFloat(valoracion) <= 0) {
      setErrorValoracion('La valoracion debe ser un número positivo');
      valid = false; 
    }
    // Validar que descripcion no tenga espacios al principio o al final
    if (!/^[^\s].*[^\s]$|^[^\s]$/.test(descripcion)) {
      setErrorDescripcion('La descripcion no debe tener espacios al principio ni al final');
      valid = false; 
    }
  
    // validar que la descripcion no sea vacia o "" (vacía)
    if (!descripcion || descripcion.trim() === '') {
      setErrorDescripcion('La descripcion es obligatoria');
      valid = false; 
    }

    if (!valid) return; // Si hay errores, no continuar

    const reviewData = {
      valoracion: valoracion,
      descripcion: descripcion,
      writerId: userLog.id,
      receiverId: parseInt(receiverId),
      serviceId: serviceId
    };


    try {
 
      const response = await fetch(`${baseUrl}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setMensaje('Reseña agregada correctamente');
        // Limpiar el formulario después de enviar los datos
        setValoracion('');
        setDescripcion('');
        alert('Reseña agregada correctamente')
        getConfirmedServices() //actualizo la lista de servicios en el context
        navigate('/service-history')
      } else {
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
              label="Valoracion (entre 1 y 5)"
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
              error={!!errorValoracion} // Muestra error si existe
              helperText={errorValoracion} // Muestra el mensaje de error
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              variant="outlined"
              error={!!errorDescripcion} // Muestra error si existe
              helperText={errorDescripcion} // Muestra el mensaje de error
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddReview}>
              Enviar Reseña
            </Button>
          </Grid>
        </Grid>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default AddReviewForm