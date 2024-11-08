import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useWalkersImageContext } from '../contexts/WalkersImageContext';

const WalkerCard = ({ walker }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { walkerImages, getWalkerTurns } = useWalkersImageContext();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleMouseEnter = async () => {
    setIsExpanded(true);
    if (!turns.length) {
      setLoading(true);
      try {
        const fetchedTurns = await getWalkerTurns(walker.id);
        setTurns(fetchedTurns);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleClick = () => {
    navigate(`/profile/${walker.id}`)
  };

  const calificacion = walker.User.calificacion || 0;
  const percentage = (calificacion / 5) * 100;

  const walkerImage = walkerImages.find(img => img.nombre_usuario === walker.User.nombre_usuario);
  const imageUrl = walkerImage ? walkerImage.imageSrc : '';

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        maxWidth: 'none',
        minWidth: '250px',
        maxHeight: 'none',
        height: '100%',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Avatar alt={walker.User.nombre_usuario} src={imageUrl} sx={{ width: 56, height: 56, m: 2 }} />
      <CardContent sx={{ flex: '1 0 auto', paddingLeft: 0 }}>
        <Typography gutterBottom variant="h6" component="div">
          {walker.User.nombre_usuario}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          Calificación: {' '}
          {[...Array(5)].map((_, index) => (
            <span key={index}>
              {index < (percentage / 20) ? <StarIcon /> : <StarOutlineIcon />}
            </span>
          ))}
        </Typography>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <strong>Turnos:</strong>
          </Typography>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Cargando turnos...
            </Typography>
          ) : error ? (
            <Typography variant="body2" color="text.secondary">
              Error al cargar turnos: {error}
            </Typography>
          ) : turns.length > 0 ? (
            turns.map((turn, index) => (
              <div key={index}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Zona:</strong> {turn.zona}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Días:</strong> {turn.dias.join(', ')}
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay turnos disponibles.
            </Typography>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default WalkerCard;
