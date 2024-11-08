import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useClientImageContext } from '../contexts/ClientImageContext';
import { Button, IconButton, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ClientCard = ({ client }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { clientImages } = useClientImageContext();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Función para manejar la expansión de la tarjeta al pasar el mouse
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  // Función para colapsar la tarjeta al retirar el mouse
  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // Función para navegar a la página de detalles del cliente
  const handleClick = () => {
    navigate('/client-details', { state: { client: { ...client, imageSrc: imageUrl } } });
  };

  const handleChatClientClick = (e) => {
    e.stopPropagation();
    navigate('/chat', { state: { receiver: client } });
  };

  // Cálculo de la calificación del cliente en porcentaje
  const calificacion = client.calificacion || 0;
  const percentage = (calificacion / 5) * 100;

  // Obtener la imagen del cliente desde el contexto
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
        cursor: 'pointer', // Para mostrar que es clicable
      }}
      onClick={handleClick} // Navegar a detalles al hacer clic en toda la tarjeta
      onMouseEnter={handleMouseEnter} // Expandir al pasar el mouse
      onMouseLeave={handleMouseLeave} // Colapsar al retirar el mouse
    >
      {/* Imagen del cliente */}
      <Avatar alt={client.nombre_usuario} src={imageUrl} sx={{ width: 56, height: 56, m: 2 }} />
      
      {/* Contenido de la tarjeta */}
      <CardContent sx={{ flex: '1 0 auto', paddingLeft: 0 }}>
        {/* Nombre del cliente */}
        <Typography gutterBottom variant="h6" component="div">
          {client.nombre_usuario}
        </Typography>

        {/* Calificación del cliente en estrellas */}
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          Calificación:{' '}
          {[...Array(5)].map((_, index) => (
            <span key={index}>
              {index < (percentage / 20) ? <StarIcon /> : <StarOutlineIcon />}
            </span>
          ))}
        </Typography>

        {/* Botón para chatear */}
        <Tooltip title='Chatear'>
          <IconButton aria-label="chatear" onClick={handleChatClientClick}>
            <ChatIcon />
          </IconButton>
        </Tooltip>

        {/* Información adicional que se muestra al expandir */}
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
