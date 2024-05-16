import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TurnCard({ turn }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/detalle-turno'); // Reemplaza '/detalle-turno' con la ruta real del componente DetalleTurno
  };

  return (
    <Card sx={{ maxWidth: 345 }} onClick={handleClick}>
      <CardActionArea>
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
}