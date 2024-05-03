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
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ModifyClient from '../pages/clients/ModifyClient';

const pages = ['Products', 'Pricing', 'Blog'];


function ResponsiveAppBar({ loggedInUser, onLogout }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [typeUser, setTypeUser] = React.useState(null);

  


  

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
  
  return (
    <AppBar position="fixed">
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
            LOGO
          </Typography>
          </Link>

          {loggedInUser ? (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
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
                  <Avatar alt={'avatar'} src={'../assets/no_image.png'} />
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
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to={`/client/${loggedInUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">Cuenta</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={onLogout}>
                    <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">Deslogueo</Typography>
                    </Link>
                  </MenuItem>                 
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to={`/image/single/${loggedInUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">Imagen de Perfil</Typography>
                    </Link>
                  </MenuItem>                
              </Menu>
            </Box>
          ) : (
            <>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
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
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link to={`/register/walker`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">Como Paseador</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link to={`/register/client`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">Como Cliente</Typography>
                    </Link>
                  </MenuItem>                 
              </Menu>
            </Box>
            <MenuItem onClick={handleCloseNavMenu}>
            <Link to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography textAlign="center">LogIn</Typography>
            </Link>
            </MenuItem>
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
