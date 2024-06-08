import React, { useEffect, useState } from 'react';
import ClientCard from '../../components/ClientCard'; 
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { ClientImageContextProvider } from '../../contexts/ClientImageContext';

function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/clients`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClients(data.body);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ClientImageContextProvider>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {clients.map((client) => (
            <Grid item key={client.id}>
              <ClientCard client={client} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ClientImageContextProvider>
  );
}

export default ClientsList;
