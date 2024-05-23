import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

function ServiceCard({ service, onDelete }) {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleClick = () => {
    navigate('/service-details', { state: { service } });
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete();
  };

  const handleModifyClick = (event) => {
    event.stopPropagation();
    navigate('/service-modify', { state: { service } });
  };

  return (
    <Card
      sx={{ maxWidth: 345 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {service.direccionPickUp}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Fecha:</strong> {new Date(service.fecha).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Nota:</strong> {service.nota}
        </Typography>
        {isActive && (
          <div>
            <Typography variant="body2" color="text.secondary">
              <strong>Cantidad de mascotas:</strong> {service.cantidad_mascotas}
            </Typography>
            <Tooltip title='Editar servicio' arrow>
              <IconButton aria-label="editar" onClick={handleModifyClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Eliminar servicio' arrow>
              <IconButton aria-label="eliminar" onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ServiceCard;
