// contexts/NotificationsContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';

const NotificationsContext = createContext();

export const useNotificationsContext = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { userLog } = useUser();
  const token = localStorage.getItem('userToken');
  
  // Función para cargar notificaciones del usuario
  const loadNotifications = async () => {
    try {
      if(!token) {
        return alert('Usuario no autorizado');
      }
      const response = await fetch(`http://localhost:3001/api/v1/notifications/${userLog.id}`, {
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
        return alert('Usuario no autorizado');
      }
      const response = await fetch('http://localhost:3001/api/v1/notifications', {
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
        const response = await fetch(`http://localhost:3001/api/v1/notifications/${notificationId}`, {
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
