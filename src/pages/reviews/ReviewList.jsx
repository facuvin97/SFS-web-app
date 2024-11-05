import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Grid, Paper, Rating, CircularProgress, Button } from '@mui/material';

function ReviewList() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch usuario de la base de datos
    const fetchUser = async () => {
      try {
        let response = await fetch(`http://localhost:3001/api/v1/walkers/${userId}`);
        let data = await response.json();
    
        if (data.body === null) {
          console.log('Walker no encontrado, buscando en clientes...');
          response = await fetch(`http://localhost:3001/api/v1/clients/body/${userId}`);
          data = await response.json();
          console.log("data: ", data)
        }
    
        if (response.ok) {
          setUser(data.body);
        } else {
          setError('Error al obtener el usuario');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error al conectar con el servidor');
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    // Fetch reseñas cuando `user` ya está disponible
    const fetchReviews = async () => {
      try {
        if (!user) return; // Asegurarse de que `user` esté definido

        setLoading(true);
        setError('');
        
        const response = await fetch(`http://localhost:3001/api/v1/review/receiver/${user.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setReviews(data.body);
        } else {
          setError('Error al obtener las reseñas');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="review-list-container">
      {user ? (
        <>
          <Typography variant="h5" gutterBottom>
            Reseñas de {user.nombre_usuario}
          </Typography>
          <Grid container spacing={2}>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Grid item xs={12} key={review.id}>
                  <Paper elevation={2} style={{ padding: '16px' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Valoración:
                    </Typography>
                    <Rating value={review.valoracion} readOnly max={5} />
                    <Typography variant="body1" gutterBottom>
                      {review.descripcion}
                    </Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hay reseñas disponibles.
              </Typography>
            )}
          </Grid>
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Cargando usuario...
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>Volver</Button>
    </div>
  );
}

export default ReviewList;
