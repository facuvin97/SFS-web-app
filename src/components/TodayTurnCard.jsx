import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación programática
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



function TodayTurnCard({ turn, fecha}) {
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  // Filtrar los servicios del turno que coincidan con el día especificado y estén aceptados
  const filteredServices = turn.Services.filter(service => {
    const fechaServicio = service.fecha.split('T')[0]; // Obtener solo la fecha (sin la hora)

    // Filtrar por el día pasado y que el servicio esté aceptado
    return fechaServicio === fecha && !service.finalizado && service.aceptado;
  });

  
  useEffect(() => {
    // Si no hay token, redirigir al inicio 
    if (!token) {
      navigate('/');
    } 
  }, [token, navigate]);

  const handleClick = () => {
    navigate('/current-turn-clients', { state: { turn, fecha } });
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
          Servicios agendados pendientes: {filteredServices.length}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TodayTurnCard
