// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';

const ServicesContext = createContext();

export const useServicesContext = () => useContext(ServicesContext);

export const ServicesProvider = ({ children }) => {
  const [pendingServicesCount, setPendingServicesCount] = useState(0);
  const [pendingServices, setPendingServices] = useState([]);//inicializa como array vacio
  const { userLog } = useUser();

  const getPendingServicesCount = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/services/walker/${userLog.id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }
      const data = await response.json();
      const serviciosPendientes = data.body.filter(service => !service.aceptado);

      setPendingServices(serviciosPendientes);
      setPendingServicesCount(serviciosPendientes.length);

    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  


  useEffect(() => {
    if (userLog?.tipo === 'walker') {
      getPendingServicesCount();
    }
  }, [userLog]);

  const deleteService = async (service, execUserType) => {
    try {
      // Primero, intenta eliminar el servicio
      const deleteResponse = await fetch(`http://localhost:3001/api/v1/service/${service.id}`, {
        method: 'DELETE',
      });
  
      if (!deleteResponse.ok) {
        throw new Error('Error al eliminar el servicio');
      }
  
      await getPendingServicesCount(); // Actualizar el conteo después de eliminar
  
      if (execUserType === 'walker') {
        // Intentar enviar la notificación solo si la eliminación del servicio fue exitosa
        const notificationResponse = await fetch(`http://localhost:3001/api/v1/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "titulo": "Servicio Cancelado",
            "contenido": `Su servicio para el día ${new Date(service.fecha).toLocaleDateString()} con el paseador ${service.Turn.Walker.User.nombre_usuario} ha sido cancelado`,
            "leido": false,
            "userId": service.ClientId,
          }),
        });
  
        if (!notificationResponse.ok) {
          throw new Error('Error al enviar la notificación');
        }
  
        return "Servicio cancelado correctamente";
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error.message);
      return 'Error al cancelar servicio';
    }
  };
  

  const authorizeService = async (service) => {
    try {

      service.aceptado = true;

      const response = await fetch(`http://localhost:3001/api/v1/service/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(service)
      });

      if (!response.ok) {
        throw new Error('Error al autorizar el servicio');
      }
      await getPendingServicesCount(); // Actualizar el conteo después de autorizar
  
        if (!notificationResponse.ok) {
          throw new Error('Error al enviar la notificación');
        }
  
        return "Servicio aceptado correctamente";
    } catch (error) {
      console.error('Error al autorizar el servicio:', error);
    }
  };

  return (
    <ServicesContext.Provider value={{ 
      pendingServicesCount, 
      pendingServices, 
      getPendingServicesCount, 
      setPendingServices,
      deleteService, 
      authorizeService 
    }}>
      {children}
    </ServicesContext.Provider>
  );
};
