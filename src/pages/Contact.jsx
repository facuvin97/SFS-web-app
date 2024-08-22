import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AboutMe() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container sx={{ marginTop: 4, padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h3" gutterBottom align="center">
        Bienvenido a TePaseamos.com
      </Typography>
      <Typography variant="h6" paragraph align="center">
        La mejor plataforma para encontrar paseadores de perros confiables y profesionales en tu área. Ofrecemos un servicio personalizado para que tu mascota reciba el mejor cuidado mientras estás fuera.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
            <CardMedia
              component="img"
              alt="Servicio de Paseo de Perros"
              image="/dogwalker_client.jpeg"
              sx={{ width: '100%', height: 300, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" component="div" align="center">
                ¿Cómo Funciona?
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                1. Regístrate y crea un perfil para tu perro.<br />
                2. Encuentra paseadores disponibles en tu área.<br />
                3. Reserva un turno y sigue el progreso de tu paseo en tiempo real.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
            <CardMedia
              component="img"
              image="/dogwalker.jpeg"
              alt="Seguridad y Confianza"
              sx={{ width: '100%', height: 300, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" component="div" align="center">
                Seguridad y Confianza
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Todos nuestros paseadores están verificados y capacitados para ofrecer el mejor cuidado a tu mascota. Tu seguridad y la de tu perro son nuestra prioridad.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Únete Ahora
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem component={Link} to="/register/walker" onClick={handleClose}>
            Como Paseador
          </MenuItem>
          <MenuItem component={Link} to="/register/client" onClick={handleClose}>
            Como Cliente
          </MenuItem>
        </Menu>
      </Typography>
    </Container>
  );
}
