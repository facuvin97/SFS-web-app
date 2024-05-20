import React from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

function SelectedTurnCard() {
    const location = useLocation();
    const turn = location.state.turn;

  if (!turn) {
    return <div>Error: No se encontró información del turno.</div>;
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Turno
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Días:</strong> {turn.dias.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Hora de inicio:</strong> {turn.hora_inicio} - <strong>Hora de fin:</strong> {turn.hora_fin}
        </Typography>
        {/* Aquí puedes agregar los detalles adicionales del turno */}
        <Typography variant="body2" color="text.secondary">
          Servicios agendados:
        </Typography>
        {/* Aquí puedes colocar los iconos de editar y eliminar */}
        <Tooltip title="Editar" arrow>
          <IconButton aria-label="editar">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar" arrow>
          <IconButton aria-label="eliminar">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardContent>
    </Card>
  )
}

export default SelectedTurnCard;
