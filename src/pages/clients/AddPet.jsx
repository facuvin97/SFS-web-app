import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, FormHelperText, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function AddPet() {
  const { userLog } = useUser();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState('');
  const [age, setAge] = useState('');
  const [image, setImage] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);

  const handleAddPet = async () => {
    // Reiniciar errores
    setError({});
    let valid = true;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
      valid = false;
    }
    if (!breed.trim()) {
      newErrors.breed = 'La raza es obligatoria';
      valid = false;
    }
    if (!size.trim()) {
      newErrors.size = 'El tamaño es obligatorio';
      valid = false;
    }
    if (!age || isNaN(age) || age <= 0) {
      newErrors.age = 'La edad debe ser un número positivo';
      valid = false;
    }
    
    if (!valid) {
      setError(newErrors);
      return;
    }

    const petData = {
      name,
      breed,
      size,
      age: parseInt(age),
      image,
      clientId: userLog.id
    };

    try {
      const response = await fetch(`${baseUrl}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(petData)
      });

      if (response.ok) {
        setMensaje('Mascota agregada correctamente');
        alert('Mascota agregada correctamente');
        navigate('/pets');
      } else {
        const errorData = await response.json();
        setMensaje(errorData.message || 'Error al agregar la mascota');
        alert(mensaje);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div className='account-container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              error={!!error.name}
              helperText={error.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Raza"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              variant="outlined"
              error={!!error.breed}
              helperText={error.breed}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tamaño"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              variant="outlined"
              error={!!error.size}
              helperText={error.size}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Edad"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              variant="outlined"
              error={!!error.age}
              helperText={error.age}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL de Imagen"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddPet}>
              Agregar Mascota
            </Button>
          </Grid>
        </Grid>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default AddPet;
