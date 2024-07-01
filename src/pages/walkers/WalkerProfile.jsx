import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Avatar, Grid, Box } from '@mui/material';

const WalkerProfile = () => {
  const { walkerId } = useParams();
  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalker = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/walkers/${walkerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWalker(data.body);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalker();
  }, [walkerId]);

  const formatFechaNacimiento = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!walker) return <p>No walker found</p>;

  return (
    <Card sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={walker.User.foto}
        alt={`Foto de ${walker.User.nombre_usuario}`}
      />
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt={walker.User.nombre_usuario} src={walker.User.foto} sx={{ width: 100, height: 100 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {walker.User.nombre_usuario}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {walker.User.direccion}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="body1"><strong>Fecha de Nacimiento:</strong> {formatFechaNacimiento(walker.User.fecha_nacimiento)}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {walker.email}</Typography>
          <Typography variant="body1"><strong>Teléfono:</strong> {walker.telefono}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Fotos</Typography>
          <Grid container spacing={2}>
            {walker.fotos.map((foto, index) => (
              <Grid item key={index}>
                <CardMedia
                  component="img"
                  height="100"
                  image={foto.url}
                  alt={`Foto ${index + 1}`}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalkerProfile;
