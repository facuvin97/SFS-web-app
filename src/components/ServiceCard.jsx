import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useUser } from '../contexts/UserLogContext';

function ServiceCard({ service, onDelete, onReview }) {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const fechaFormateada = new Date(service.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  const { userLog } = useUser()


  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleClick = () => {
    console.log('service: ', service);
    navigate('/service-details', { state: { service} });
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete();
  };

  const handleReviewClick = (event) =>{
    event.stopPropagation();
    onReview();
  }

  return (
    <Card
      sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ServiceCard;
