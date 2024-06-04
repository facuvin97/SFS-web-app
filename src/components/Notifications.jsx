// components/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Typography, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotificationsContext } from '../contexts/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import DraftsIcon from '@mui/icons-material/Drafts';
import '../styles/Notification.css'

const Notifications = () => {
  const { notifications, markAsRead } = useNotificationsContext(); // Obtiene notificaciones y función para marcarlas como leídas del contexto
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el elemento de anclaje del popover
  const [forceRender, setForceRender] = useState(false); // Estado adicional para forzar el renderizado
  const [ unreadCount, setUnreadCount] = useState((notifications.filter((notification) => !notification.leido).length))

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Establece el elemento de anclaje cuando se hace clic en el icono de notificaciones
  };

  const handleClose = () => {
    // Marca todas las notificaciones como leídas
    notifications.forEach(notification => {
      if (!notification.leido) {
        markAsRead(notification.id);
      }
    });

    setForceRender(true)

    setAnchorEl(null); // Cierra el popover estableciendo el elemento de anclaje a null
  };

  const open = Boolean(anchorEl); // Determina si el popover está abierto
  const id = open ? 'simple-popover' : undefined; // Asigna un id al popover si está abierto

  useEffect(() => {
    console.log('Ejecutando useEffect: ', notifications)

    setUnreadCount(notifications.filter((notification) => !notification.leido).length)
    // Aquí subscribir el componente a los cambios en el contexto de notificaciones
    // Esto hará que el componente se actualice cada vez que las notificaciones cambien en el contexto
  }, [notifications]);

  return (
    <div className="notifications-container"> {/* Aplica la clase del contenedor */}
      <IconButton aria-describedby={id} onClick={handleClick}> {/* Botón de icono para abrir el popover */}
        <Badge badgeContent={unreadCount} color="secondary"> {/* Muestra el conteo de notificaciones no leídas */}
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
        <List className="notification-list"> {/* Aplica la clase de la lista */}
          {notifications.length === 0 ? ( // Muestra un mensaje si no hay notificaciones
            <ListItem>
              <ListItemText primary="No hay notificaciones disponibles" />
            </ListItem>
          ) : (
            notifications.map((notification) => ( // Mapea las notificaciones y las muestra en una lista
              <ListItem key={notification.id} className={`notification-list-item ${notification.leido ? 'notification-read' : 'notification-unread'}`}> {/* Aplica la clase del ListItem */}
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" className="notification-title"> {/* Aplica la clase del título */}
                      {notification.titulo}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body3" className="notification-subtitle"> {/* Aplica la clase del subtítulo */}
                        {notification.contenido}
                      </Typography>
                      <Typography variant="caption" align="right" display="block" className="notification-time"> {/* Aplica la clase del tiempo */}
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    </>
                  }
                />
                {!notification.leido && ( // Muestra un botón para marcar como leída si la notificación no está leída
                  <div className="notification-actions"> {/* Contenedor para el botón */}
                    <Tooltip title="Marcar como leído" arrow>
                      <IconButton onClick={() => markAsRead(notification.id)}>
                        <DraftsIcon></DraftsIcon>
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </div>
  );
};

export default Notifications;
