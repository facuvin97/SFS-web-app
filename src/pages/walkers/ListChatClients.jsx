import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación programática
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useUser } from '../../contexts/UserLogContext'; // Asegúrate de tener un contexto para obtener el usuario logueado
import ClientCard from '../../components/ClientCard'; // Componente para mostrar la tarjeta del cliente

const ListChatClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const { userLog } = useUser();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/contacts/${userLog.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClients(data.body);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClients();
  }, [userLog.id]);

  const handleChatClientClick = (client) => {
    navigate('/chat', { state: { receiver: client } });
  };

  return (
    <div>
      <h2>Clientes</h2>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {clients.map((client) => (
            <Grid item key={client.id} onClick={() => handleChatClientClick(client)}>
              <ClientCard client={client} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default ListChatClients;
