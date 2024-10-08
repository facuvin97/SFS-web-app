import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación programática
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useUser } from '../../contexts/UserLogContext'; // Asegúrate de tener un contexto para obtener el usuario logueado
import ClientCard from '../../components/ClientCard'; // Componente para mostrar la tarjeta del cliente
import { IconButton, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';


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

  return (
    <div>
      <h2>Clientes</h2>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {clients.map((client) => (
            <Grid>
              <ClientCard client={client.User} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default ListChatClients;
