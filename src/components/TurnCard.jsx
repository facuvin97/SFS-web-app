import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación programática
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Tooltip } from '@mui/material';


function TurnCard({ turn, onDelete }) {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate(); // Obtener la función de navegación programática
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

  const handleClick = () => {
    //setIsActive(!isActive);
    // Navegar a la página de detalles del turno cuando se hace clic en la tarjeta
    navigate('/turn-details', { state: { turn} });
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Evita la propagación del evento click al componente Card
    onDelete();
   }
   
  const handleModifyClick = (event) => {
    event.stopPropagation(); // Evita la propagación del evento click al componente Card
    navigate('/turn-modify', { state: { turn } });
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
          {turn.zona}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Tarifa:</strong> {turn.tarifa}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Días:</strong> {turn.dias.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Hora de inicio:</strong> {turn.hora_inicio} - <strong>Hora de fin:</strong> {turn.hora_fin}
        </Typography>
        {isActive && (
          <div>
            {/* Aquí puedes agregar la información adicional, como los servicios agendados */}
            <Typography variant="body2" color="text.secondary">
              Servicios agendados:
            </Typography>
            {/* Aquí puedes colocar los iconos de editar y eliminar */}
            <Tooltip title='Editar turno' arrow>
              <IconButton aria-label="editar" onClick={handleModifyClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Eliminar turno' arrow>
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

export default TurnCard
