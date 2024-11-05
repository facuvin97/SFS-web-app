import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useUser } from '../contexts/UserLogContext';
import { useConfirmedServicesContext } from '../contexts/ServicesContext';


function ServiceDetails() {
  const location = useLocation();
  const {deleteService} = useConfirmedServicesContext();
  const service = location.state?.service;  // Obtener el servicio desde location.state
  const onReview = location.state?.onReview;  // Obtener la función onReview
  const navigate = useNavigate();
  const { userLog } = useUser();
  const token = localStorage.getItem('userToken');
  let serviceComenzado;
  let serviceFinalizado;


  const handleDeleteService = async () => {
    const msg = await deleteService(service);
    navigate(-1)
  };

  const handleReview = async () => {
    try {
      if (!token) {
        return alert('Usuario no autorizado');
      }
      const serviceId = service.id;
  
      if (userLog.tipo === 'walker') {
        // Si la reseña la escribe un paseador
        navigate(`/add-review/${service.ClientId}`, { state: { serviceId } });
      } else {
        // Si la reseña la escribe un cliente
        const response = await fetch(`http://localhost:3001/api/v1/turns/${service.TurnId}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
  
        if (!response.ok) {
          throw new Error('Error al obtener el turno');
        }
  
        const turnData = await response.json();
  
        if (!turnData || !turnData.body || !turnData.body.WalkerId) {
          throw new Error('No se encontró el WalkerId en la respuesta');
        }
  
        navigate(`/add-review/${turnData.body.WalkerId}`, { state: { serviceId } });
      }
    } catch (error) {
      console.error('Error en handleReview:', error.message);
      // Puedes mostrar un mensaje de error al usuario
    }
  };

  const handleLocationClick = (event) => {
    event.stopPropagation();
    navigate('/map', {state:{service}});
  };

  // Comprueba que el servicio esté disponible antes de renderizar
  if (!service) {
    return <Typography variant="h6">No se pudo cargar el servicio</Typography>;
  }else{
    if(service.comenzado && !service.finalizado){
      serviceComenzado= true
      serviceFinalizado= false
    } else if(service.finalizado) {
      serviceComenzado=true
      serviceFinalizado= true
    }else{
      serviceComenzado=false;
      serviceFinalizado=false;
    }
  }

  const fechaFormateada = new Date(service.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });

  return (
    <Card
      className="account-container"
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
        <Typography variant="body2" color="text.secondary">
          <strong>Cantidad de mascotas:</strong> {service.cantidad_mascotas}
        </Typography>
        {serviceComenzado && serviceFinalizado ? (
          <div className="card-actions" >            
            <div className="button-group">
              <Tooltip title="Ingresar Reseña" arrow>
                <IconButton aria-label="ingresar" onClick={handleReview}>
                  <RateReviewOutlinedIcon />
                </IconButton>
              </Tooltip>
              </div>
          </div>
        ):serviceComenzado && !serviceFinalizado ? (<div className="card-actions">            
          <div className="button-group">
            <Tooltip title="Ver ubicación del paseador" arrow>
              <IconButton aria-label="ver ubicación" onClick={handleLocationClick}>
                <LocationOnIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>):(<div className="card-actions">            
            <div className="button-group">
              <Tooltip title="Eliminar servicio" arrow>
                <IconButton aria-label="eliminar" onClick={handleDeleteService}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ServiceDetails;
