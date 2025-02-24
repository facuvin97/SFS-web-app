import { useState, useEffect } from 'react'
import { Table,TableBody,TableCell,TableContainer, TableHead,TableRow, Paper, Button, IconButton } from '@mui/material'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function CurrentTurnClientsList() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true);
  const location = useLocation()
  const { turn, fecha } = location.state || {};
  const now = new Date();
  const token = localStorage.getItem('userToken');
  const dateNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const navigate = useNavigate()

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const getCurrentTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Función para sumar minutos a una hora en formato HH:MM:SS
  const addMinutesToTime = (time, minutesToAdd) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;

  
    // Convertimos 23:59 a minutos (1439 minutos)
    const maxMinutesInDay = 23 * 60 + 59;
  
    // Si el total de minutos supera los 23:59, limitamos a 23:59
    const finalMinutes = Math.min(totalMinutes, maxMinutesInDay);
  
    const newHours = Math.floor(finalMinutes / 60); // Sin usar el módulo % 24 para evitar volver a 00:00
    const newMinutes = finalMinutes % 60;
  
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const toggleServiceStatus = async (id, comenzado) => {
    if (!comenzado) { // cambiar el estado a comenzado
      try {
        const response = await fetch(`${baseUrl}/services/started/${id}`, {
          method: 'PUT',
          headers: { 
              'Authorization': `Bearer ${token}` 
         }
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
        const response = await fetch(`${baseUrl}/services/finished/${id}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
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
    return getCurrentTime(now) >= turn.hora_inicio && getCurrentTime(now) <= horaFinConMargen && dateNow == fecha
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Cargo los servicios del turno actual
        const response = await fetch(`${baseUrl}/services/turn/today/${turn.id}/${fecha}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
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
                  disabled={!isWithinTurnHours() && !service.comenzado}  // Si isWithinTurnHours() es falso, el botón estará deshabilitado
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