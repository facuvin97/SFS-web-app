import { useState, useEffect } from 'react'
import { Table,TableBody,TableCell,TableContainer, TableHead,TableRow, Paper, Button, IconButton } from '@mui/material'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useLocation } from 'react-router-dom';

export default function CurrentTurnClientsList() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true);
  const location = useLocation()
  const { turn, fecha } = location.state || {};
  const now = new Date();
  //restar 3 horas a new Date()
  //now.setHours(now.getHours() - 3);
  const dateNow = now.toISOString().split('T')[0];

  const getCurrentTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  // Función para sumar minutos a una hora en formato HH:MM:SS
  const addMinutesToTime = (time, minutesToAdd) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
  
    // Convertimos 23:59 a minutos (1439 minutos)
    const maxMinutesInDay = 23 * 60 + 59;
  
    // Si el total de minutos supera los 23:59, limitamos a 23:59
    const finalMinutes = Math.min(totalMinutes, maxMinutesInDay);
  
    const newHours = Math.floor(finalMinutes / 60); // Sin usar el módulo % 24 para evitar volver a 00:00
    const newMinutes = finalMinutes % 60;
  
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };
  const toggleServiceStatus = async (id, comenzado) => {
    if (!comenzado) { // cambiar el estado a comenzado
      try {
        const response = await fetch(`http://localhost:3001/api/v1/services/started/${id}`, {
          method: 'PUT',
        })


        if (!response.ok) {
          throw new Error("Error al actualizar el estado del servicio");
        }

        // Actualiza el estado localmente
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === id ? { ...service, comenzado: true } : service
          )
        );
      } catch (error) {
        console.log(error)
      }
    } else { //cambiar el estado a finalizado
      try {
        const response = await fetch(`http://localhost:3001/api/v1/services/finished/${id}`, {
          method: 'PUT',
        })

        if (!response.ok) {
          throw new Error("Error al actualizar el estado del servicio");
        }

        // Actualiza el estado localmente (quito el servicio de la lista)
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== id)
        );

      } catch (error) {
        console.log(error)
      }
    }
  }
  const isWithinTurnHours = () => {
    
    const horaFinConMargen = addMinutesToTime(turn.hora_fin, 60);
    console.log(turn.hora_inicio, turn.hora_fin, horaFinConMargen)
    console.log(getCurrentTime(now), dateNow)   
    console.log( getCurrentTime(now) >= turn.hora_inicio && getCurrentTime(now) <= horaFinConMargen && dateNow === fecha)
    return getCurrentTime(now) >= turn.hora_inicio && getCurrentTime(now) <= horaFinConMargen && dateNow == fecha
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Cargo los servicios del turno actual
        const response = await fetch(`http://localhost:3001/api/v1/services/turn/today/${turn.id}/${fecha}`);
        const data = await response.json();
        const services = data.body;
  
        // Filtra los servicios donde finalizado es false
        const filteredServices = services.filter((service) => !service.finalizado);
        
        setServices(filteredServices);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [turn]);
  

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Lista de Clientes</h1>
      {services.length > 0 ? (<TableContainer component={Paper}>
        <Table aria-label="lista de clientes">
          <TableHead>
            <TableRow>
              <TableCell>Iniciado</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Mascotas</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell align="right">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <IconButton 
                    color={service.comenzado ? "primary" : "default"}
                    aria-label={service.comenzado ? "iniciado" : "no iniciado"}
                    style={{ pointerEvents: 'none' }}
                  >
                    {service.comenzado ? <CheckCircle /> : <RadioButtonUnchecked />}
                  </IconButton>
                </TableCell>
                <TableCell>{service.direccionPickUp}</TableCell>
                <TableCell>{service.cantidad_mascotas}</TableCell>
                <TableCell>{service.nota}</TableCell>
                <TableCell align="right">
                <Button
                  variant={service.comenzado ? "outlined" : "contained"}
                  color={service.comenzado ? "secondary" : "primary"}
                  onClick={() => toggleServiceStatus(service.id, service.comenzado)}
                  size="small"
                  disabled={!isWithinTurnHours()}  // Si isWithinTurnHours() es falso, el botón estará deshabilitado
                >
                  {service.comenzado ? "Finalizar" : "Iniciar"}
                </Button>
                
                </TableCell>              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>) :
      (<p>No hay servicios para este turno</p>)}
    </div>
  )
}
//TODO:
//mostrar y parar fecha de turno para ver botones si es hoy