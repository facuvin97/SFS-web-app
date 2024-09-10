import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación programática
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Tooltip } from '@mui/material';


function TodayTurnCard({ turn }) {
  const navigate = useNavigate();
  const todayTurnServices = turn.Services.filter(service => {
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha de hoy en formato 'YYYY-MM-DD'
    const fechaServicio = service.fecha.split('T')[0];
    // console.log('today:', today)
    // console.log('new date:', new Date())
    // console.log('service.fecha:', service.fecha)
    return fechaServicio === today && !service.finalizado;
  });


  const handleClick = () => {
    navigate('/current-turn-clients', { state: { turn } });
  };

  return (
    <Card
      sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {turn.zona}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          <strong>Hora de inicio:</strong> {turn.hora_inicio} - <strong>Hora de fin:</strong> {turn.hora_fin}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Días:</strong> {turn.dias.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Servicios agendados pendientes: {todayTurnServices.length}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TodayTurnCard
