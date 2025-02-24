import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Grid, Paper, Rating, CircularProgress, Button } from '@mui/material';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ReviewList() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  useEffect(() => {
    // Fetch usuario de la base de datos
    const fetchUser = async () => {
      try {

        let response = await fetch(`${baseUrl}/walkers/${userId}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        let data = await response.json();
    
        if (data.body === null) {
          console.log('Walker no encontrado, buscando en clientes...');
          response = await fetch(`${baseUrl}/clients/body/${userId}`, { 
            headers: { 
              'Authorization': `Bearer ${token}` 
            } 
        });
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
        
        const response = await fetch(`${baseUrl}/review/receiver/${user.id}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        
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
