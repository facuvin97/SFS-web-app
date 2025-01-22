import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, Typography, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useNotificationsContext } from '../contexts/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import '../styles/Notification.css';
import { useUser } from '../contexts/UserLogContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { notifications, markAsRead } = useNotificationsContext(); // Obtiene notificaciones y función para marcarlas como leídas del contexto
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el elemento de anclaje del popover
  const [unreadCount, setUnreadCount] = useState(0); // Estado para el conteo de notificaciones no leídas
  const { userLog } = useUser();
  const navigate = useNavigate(); 
  const token = localStorage.getItem('userToken');  
  
  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    // Actualiza el conteo de notificaciones no leídas cada vez que cambian las notificaciones
    setUnreadCount(notifications.filter((notification) => !notification.leido).length);
  }, [notifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Establece el elemento de anclaje cuando se hace clic en el icono de notificaciones
  };

  const handleClose = async () => {
    // Marca todas las notificaciones como leídas
    const unreadNotifications = notifications.filter(notification => !notification.leido);
    await Promise.all(unreadNotifications.map(notification => markAsRead(notification.id)));
    setAnchorEl(null); // Cierra el popover estableciendo el elemento de anclaje a null
  };

  const open = Boolean(anchorEl); // Determina si el popover está abierto
  const id = open ? 'simple-popover' : undefined; // Asigna un id al popover si está abierto

  return (
    <div className="notifications-container">
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List className="notification-list">
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No hay notificaciones disponibles" />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem 
                key={notification.id} 
                className={`notification-list-item ${notification.leido ? 'notification-read' : 'notification-unread'}`} 
                onMouseEnter={(e) => e.currentTarget.classList.add('notification-hover')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('notification-hover')}
                style={{ cursor: 'pointer' }}
              >
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" component="span" className="notification-title">
                      {notification.titulo}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" className="notification-subtitle">
                        {notification.contenido}
                      </Typography>
                      <Typography variant="caption" component="span" align="right" display="block" className="notification-time">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </div>
  );
};

export default Notifications;
