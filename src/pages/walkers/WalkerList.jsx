import React, { useEffect, useState } from 'react';
import WalkerCard from '../../components/WalkerCard'; 
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { WalkersImageContextProvider } from '../../contexts/WalkersImageContext';

function WalkersList() {
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalkers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/walkers`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWalkers(data.body);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalkers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <WalkersImageContextProvider>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {walkers.map((walker) => (
            <Grid item key={walker.id}>
              <WalkerCard walker={walker} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </WalkersImageContextProvider>
  );
}

export default WalkersList;
