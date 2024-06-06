import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useUserImageContext } from '../contexts/UserImageContext';

const ClientCard = ({ client }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { clientImages } = useUserImageContext();

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleClick = () => {
    navigate('/client-details', { state: { client: { ...client, imageSrc: imageUrl } } });
  };

  const calificacion = client.calificacion || 0;
  const percentage = (calificacion / 5) * 100;

  const clientImage = clientImages.find(img => img.nombre_usuario === client.nombre_usuario);
  const imageUrl = clientImage ? clientImage.imageSrc : '';

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
      <Avatar alt={client.nombre_usuario} src={imageUrl} sx={{ width: 56, height: 56, m: 2 }} />
      <CardContent sx={{ flex: '1 0 auto', paddingLeft: 0 }}>
        <Typography gutterBottom variant="h6" component="div">
          {client.nombre_usuario}
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
            <strong>Cantidad de mascotas:</strong> {client.cantidad_mascotas}
          </Typography>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
