// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const ServicesContext = createContext();

export const useServicesContext = () => useContext(ServicesContext);

export const ServicesProvider = ({ children, loggedInUser }) => {
  const [pendingServicesCount, setPendingServicesCount] = useState(0);

  const getPendingServicesCount = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/services/walker/${loggedInUser.id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }
      const data = await response.json();
      const pendingServices = data.body.filter(service => !service.aceptado);
      setPendingServicesCount(pendingServices.length);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  useEffect(() => {
    if (loggedInUser?.tipo === 'walker') {
      getPendingServicesCount();
    }
  }, [loggedInUser]);

  const deleteService = async (serviceId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/services/${serviceId}`, {
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

  const authorizeService = async (serviceId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/services/authorize/${serviceId}`, {
        method: 'POST'
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
    <ServicesContext.Provider value={{ pendingServicesCount, getPendingServicesCount, deleteService, authorizeService }}>
      {children}
    </ServicesContext.Provider>
  );
};
