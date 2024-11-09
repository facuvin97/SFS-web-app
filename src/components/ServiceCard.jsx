import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useUser } from '../contexts/UserLogContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ServiceCard({ service, onDelete, onReview, viewLocation }) {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const fechaFormateada = new Date(service.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  const { userLog } = useUser()
  const token = localStorage.getItem('userToken');
  
  
  useEffect(() => {
    // Si no hay token, redirigir al inicio 
    if (!token) {
      navigate('/');
    } 
  }, [token, navigate]);

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete();
  };

  const handleReviewClick = (event) =>{
    event.stopPropagation();
    onReview();
  }

  const handleLocationClick = (event) => {
    event.stopPropagation();
    navigate('/map', {state:{service}});
  };

  return (
    <Card
      sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        <strong>Dirección: </strong> {service.direccionPickUp}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Fecha:</strong> {fechaFormateada}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Nota:</strong> {service.nota}
        </Typography>
        {onReview && (
          (userLog.tipo === 'client' && !service.calificado_x_cliente) ||
          (userLog.tipo === 'walker' && !service.calificado_x_paseador)
        ) && (
          <Tooltip title="Ingresar Reseña" arrow>
            <IconButton aria-label="ingresar" onClick={handleReviewClick}>
              <RateReviewOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
        {isActive && (
          <div>
            <Typography variant="body2" color="text.secondary">
              <strong>Cantidad de mascotas:</strong> {service.cantidad_mascotas}
            </Typography>
            {onDelete && <Tooltip title='Eliminar servicio' arrow>
              <IconButton aria-label="eliminar" onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>}
            {viewLocation && (
              userLog.tipo === 'client'
            ) && (
              <div className="button-group">
                <Tooltip title="Ver ubicación del paseador" arrow>
                  <IconButton aria-label="ver ubicación" onClick={handleLocationClick}>
                    <LocationOnIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ServiceCard;
