/* eslint-disable react/prop-types */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ImageProfile from './ImageProfile';
import { useUserImageContext } from '../contexts/UserImageContext';

const pagesWalker = ['Turno', 'Servicios', 'Blog'];
const pagesClient = ['Servicio', 'Pricing', 'Blog'];

function ResponsiveAppBar({ loggedInUser, onLogout }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [pendingServicesCount, setPendingServicesCount] = useState(0);

  // Rutas para los paseadores
  const routesWalker = {
    Turno: '/agregar-turno',
    Servicios: `/walker-service-request/${loggedInUser?.id}`,
    Blog: '/walker/blog',
  };
  
  // Rutas para los clientes
  const routesClient = {
    Servicio: '/add-service',
    Pricing: '/client/pricing',
    Blog: '/client/blog',
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { imageSrc } = useUserImageContext();
  const pages = loggedInUser?.tipo === 'walker' ? pagesWalker : pagesClient;
  const routes = loggedInUser?.tipo === 'walker' ? routesWalker : routesClient;

  // Función para obtener la cantidad de servicios pendientes
  const getPendingServicesCount = async () => {
    try {
      // Realizar la llamada a la API para obtener todos los servicios del paseador
      const response = await fetch(`http://localhost:3001/api/v1/services/walker/${loggedInUser.id}`);
      
      
      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }
      
      // Obtener los datos de la respuesta
      const data = await response.json();
  
      // Filtrar solo los servicios pendientes de autorización
      const pendingServices = data.body.filter(service => !service.aceptado);
      console.log(pendingServices)
      // Establecer el contador de servicios pendientes
      setPendingServicesCount(pendingServices.length);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  }

  useEffect(() => {
    if (loggedInUser?.tipo === 'walker') {
      getPendingServicesCount();
    }
  }, [loggedInUser]);

  return (
    <AppBar position="fixed" className="AppBar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              SFS
            </Typography>
          </Link>

          {loggedInUser ? (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  component={Link}
                  to={routes[page]}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page === 'Servicios' && loggedInUser?.tipo === 'walker' ? (
                    <Badge badgeContent={pendingServicesCount} color="error">
                      {page}
                    </Badge>
                  ) : (
                    page
                  )}
                </Button>
              ))}
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          {loggedInUser ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <ImageProfile username={loggedInUser.nombre_usuario} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Link to={`/user/${loggedInUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Account</Typography>
                  </MenuItem>
                </Link>
                <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MenuItem onClick={() => { onLogout(); handleCloseUserMenu(); }}>
                    <Typography textAlign="center">Deslogueo</Typography>
                  </MenuItem>                 
                </Link>
              </Menu>
            </Box>
          ) : (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Registrarse">
                  <MenuItem onClick={handleOpenUserMenu}>
                    <Typography textAlign="center">Registrarse</Typography>
                  </MenuItem>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Link to={`/register/walker`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Como Paseador</Typography>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link to={`/register/client`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">Como Cliente</Typography>
                    </Link>
                  </MenuItem>                 
                </Menu>
              </Box>
              <Link to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">LogIn</Typography>
                </MenuItem>
              </Link>
            </>
          )}

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;


