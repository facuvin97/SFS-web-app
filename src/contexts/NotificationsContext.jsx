// contexts/NotificationsContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../contexts/WebSocketContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const NotificationsContext = createContext();

export const useNotificationsContext = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { userLog } = useUser();
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();
  const socket = useWebSocket();

  useEffect(() => {
    const agregarNotification = async (notification) => {
      if (notification.userId !== userLog.id) return;
      setNotifications((prevNotifications) => [ notification,...prevNotifications ]);
    };
    // Vinculamos el evento del socket dentro del useEffect
    if (!socket) return;
    socket.on('notification', agregarNotification);

    // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
    return () => socket.off('notification', agregarNotification);
  }, [socket]);

  
  // Función para cargar notificaciones del usuario
  const loadNotifications = async () => {
    try {
      if(!token) {
        return navigate('/');
      }
      const response = await fetch(`${baseUrl}/notifications/${userLog.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener las notificaciones');
      }
      const data = await response.json();

      // Ordenar las notificaciones por fecha, las más recientes primero
      const sortedNotifications = data.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error al cargar las notificaciones:', error);
    }
  };

  useEffect(() => {
    if (userLog?.id) {
      loadNotifications();
    }
  }, [userLog]);

  // Función para agregar una notificación
  const addNotification = async (notification) => {
    try {
      if(!token) {
        return navigate('/');
      }
      const response = await fetch(`${baseUrl}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(notification),
      });
      const newNotification = await response.json();
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    } catch (error) {
      console.error('Error al agregar la notificación:', error);
    }
  };

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    if(!token) {
      return alert('Usuario no autorizado');
    }
    try {
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification) {
        const response = await fetch(`${baseUrl}/notifications/${notificationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...notification, leido: true }),
        });
        if (response.ok) {
          setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n.id === notificationId ? { ...n, leido: true } : n
            )
          );
        }
      }
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, markAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
