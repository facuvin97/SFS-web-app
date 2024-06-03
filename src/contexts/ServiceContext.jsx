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

  const deleteService = async (serviceId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/service/${serviceId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el servicio');
      }
      await getPendingServicesCount(); // Actualizar el conteo después de eliminar
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
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
