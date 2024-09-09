import { useState, useEffect } from 'react'
import { Table,TableBody,TableCell,TableContainer, TableHead,TableRow, Paper, Button, IconButton } from '@mui/material'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'

export default function CurrentTurnClientsList({ turn }) {
  const [services, setServices] = useState([])

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

  useEffect(() => {
    async function fetchData() {
      try {
        // Cargo los servicios del turno actual
        const response = await fetch(`http://localhost:3001/api/v1/services/turn/today/${turn.id}`);
        const data = await response.json();
        const services = data.body;
  
        // Filtra los servicios donde finalizado es false
        const filteredServices = services.filter((service) => !service.finalizado);
        
        setServices(filteredServices);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [turn]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Lista de Clientes</h1>
      <TableContainer component={Paper}>
        <Table aria-label="lista de clientes">
          <TableHead>
            <TableRow>
              <TableCell>Iniciado</TableCell>
              <TableCell>Dirección</TableCell>
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
                <TableCell align="right">
                  <Button
                    variant={service.comenzado ? "outlined" : "contained"}
                    color={service.comenzado ? "secondary" : "primary"}
                    onClick={() => toggleServiceStatus(service.id, service.comenzado)}
                    size="small"
                  >
                    {service.comenzado ? "Finalizar" : "Iniciar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}