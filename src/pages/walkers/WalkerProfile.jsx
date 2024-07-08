import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Avatar, Grid, Box, Button } from '@mui/material';
import { useWalkersImageContext } from '../../contexts/WalkersImageContext';

const WalkerProfile = () => {
  const { walkerId } = useParams();
  const navigate = useNavigate();
  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [turns, setTurns] = useState([]);
  const { walkerImages } = useWalkersImageContext();

  useEffect(() => {
    const fetchWalker = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/walkers/${walkerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWalker(data.body);

        const turnsResponse = await fetch(`http://localhost:3001/api/v1/turns/walker/${walkerId}`);
        if (!turnsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const turnsData = await turnsResponse.json();
        setTurns(turnsData.body);

        const images = await Promise.all(data.body.fotos.map(async (foto) => {
          const imageResponse = await fetch(`http://localhost:3001/api/v1/image/walkers/${foto.url}`);
          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            const objectURL = URL.createObjectURL(blob);
            return { imageSrc: objectURL };
          } else {
            console.error('Error al obtener la imagen del paseador:', imageResponse.statusText);
            return { imageSrc: null };
          }
        }));
        setImages(images);
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

  const handleAddService = (turn) => {
    navigate('/add-service', { state: { turn } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!walker) return <p>No walker found</p>;

  const walkerImage = walkerImages.find(img => img.nombre_usuario === walker.User.nombre_usuario);
  const imageUrl = walkerImage ? walkerImage.imageSrc : 'url_de_no_profile_image'; // URL de imagen por defecto

  return (
    <Card sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt={walker.User.nombre_usuario} src={imageUrl} sx={{ width: 100, height: 100 }} />
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
          <Typography variant="body1"><strong>Email:</strong> {walker.User.email}</Typography>
          <Typography variant="body1"><strong>Teléfono:</strong> {walker.User.telefono}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Fotos</Typography>
          <Grid container spacing={2}>
            {walker.fotos.map((foto, index) => {
              const imageUrl = images[index] ? images[index].imageSrc : 'url_de_no_profile_image'; // URL de imagen por defecto
              return (
                <Grid item key={index}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={imageUrl}
                    alt={`Foto ${index + 1}`}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
        {turns && turns.length > 0 ? (
          turns.map((turn, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body1" color="text.primary">
                <strong>Zona:</strong> {turn.zona}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Días:</strong> {turn.dias.join(', ')}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Hora de inicio:</strong> {turn.hora_inicio}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Hora de fin:</strong> {turn.hora_fin}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleAddService(turn)}>
                Solicitar Servicio
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No hay turnos disponibles.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WalkerProfile;
