import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


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
        <Typography variant="body2" color="text.secondary">
          Servicios agendados:
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SelectedTurnCard;
