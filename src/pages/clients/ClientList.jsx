import React, { useEffect, useState } from 'react';
import ClientCard from '../../components/ClientCard'; 
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { ClientImageContextProvider } from '../../contexts/ClientImageContext';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${baseUrl}/clients`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
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
