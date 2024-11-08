'use client'

import React, { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton 
} from '@mui/material'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function CurrentTurnClientsList() {
  const [clients, setClients] = useState([])
  const token = localStorage.getItem('userToken')
  const navigate = useNavigate()

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const toggleServiceStatus = (id) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, serviceStarted: !client.serviceStarted } : client
    ))
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Lista de Clientes</h1>
      <TableContainer component={Paper}>
        <Table aria-label="lista de clientes">
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <IconButton 
                    color={client.serviceStarted ? "primary" : "default"}
                    aria-label={client.serviceStarted ? "servicio iniciado" : "servicio no iniciado"}
                  >
                    {client.serviceStarted ? <CheckCircle /> : <RadioButtonUnchecked />}
                  </IconButton>
                </TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell align="right">
                  <Button
                    variant={client.serviceStarted ? "outlined" : "contained"}
                    color={client.serviceStarted ? "secondary" : "primary"}
                    onClick={() => toggleServiceStatus(client.id)}
                    size="small"
                  >
                    {client.serviceStarted ? "Marcar como No Iniciado" : "Marcar como Iniciado"}
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