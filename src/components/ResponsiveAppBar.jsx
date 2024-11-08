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
import { useConfirmedServicesContext } from '../contexts/ServicesContext';
import { useChatsContext } from '../contexts/ChatsContext';
import Notifications from './Notifications';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';


const pagesWalker = ['Turnos', 'Solicitudes', 'Servicios', 'Historial'];
const pagesClient = ['Servicios', 'Historial', 'Facturas'];

function ResponsiveAppBar({ loggedInUser, onLogout }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElChat, setAnchorElChat] = useState(null); // Para manejar el menú de chats
  const {pendingServicesCount} = useConfirmedServicesContext();
  const navigate = useNavigate();
  const { chats, unreadChats, setUnreadChats } = useChatsContext();

  
   // Rutas para los paseadores
   const routesWalker = {
    Turnos: '/turns',
    Servicios: `/services`,
    Solicitudes: `/walker-service-request/${loggedInUser?.id}`,
    Historial: `/service-history`,
  };
  
  // Rutas para los clientes
  const routesClient = {
    Servicios: '/services',
    Historial: '/service-history',
    Facturas: '/payment-list',
  };

  useEffect(() => {
  }, [unreadChats]);



  const handleChatClick = (event) => {
    setAnchorElChat(null);
    // busco en chats el chat con el id que me pasa
    const chat = chats.find((chat) =>  chat.id.toString() === event.currentTarget.id);
    

    // Verificar si se encontró el chat
    if (chat) {
      // Navegar a la página de chat
      navigate(`/chat`, { state: { receiver: chat.User } });
    }
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
                  {page === 'Solicitudes' && loggedInUser?.tipo === 'walker' ? (
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
            <>
              <Box sx={{ flexGrow: 0, margin: '10px' }}>
                <Notifications />
              </Box>
              <Box sx={{ flexGrow: 0, margin: '10px' }}>
                <ChatList />
              </Box>
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
                  <Link
                    to={loggedInUser.tipo === 'walker' ? `/profile/${loggedInUser.id}` : `/account-info`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
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
            </>
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
  
          {/* Menú desplegable para pantallas pequeñas */}
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
                <MenuItem
                  key={page}
                  component={Link}
                  to={routes[page]}
                  onClick={handleCloseNavMenu}
                >
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