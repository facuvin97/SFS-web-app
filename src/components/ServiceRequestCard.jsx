import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from '@mui/material';

function ServiceRequestCard({ service, onAccept, onReject }) {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const fechaFormateada = new Date(service.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });


  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleClick = () => {
    //MOSTRAR DETALLES DE ALGO
  };

  const handleAcceptClick = (event) => {
    event.stopPropagation();
    onAccept();
  };

  const handleRejectClick = (event) => {
    event.stopPropagation();
    onReject();
  };

  return (
    <Card
      sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {service.direccionPickUp}
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
            <Tooltip title='Aceptar servicio' arrow>
              <IconButton aria-label="aceptar" onClick={handleAcceptClick}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Rechazar servicio' arrow>
              <IconButton aria-label="rechazar" onClick={handleRejectClick}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ServiceRequestCard;