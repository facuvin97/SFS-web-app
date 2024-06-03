// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';

const ServicesContext = createContext();

export const useServicesContext = () => useContext(ServicesContext);

export const ServicesProvider = ({ children }) => {
  const [pendingServicesCount, setPendingServicesCount] = useState(0);
  const [pendingServices, setPendingServices] = useState(null);
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

      // if (serviciosPendientes) {
      //   localStorage.setItem('pendingServices', serviciosPendientes)
      // }


    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

    //Verificar si hay datos de servicios pendientes en localStorage al cargar la aplicación
    // useEffect(() => {
    //   const serviciosPendientes = localStorage.getItem('pendingServices');
    //   if (serviciosPendientes) {
    //     console.log('En el useEffect: ', serviciosPendientes)
    //     setPendingServices(JSON.parse(serviciosPendientes));
    //     setPendingServicesCount((JSON.parse(serviciosPendientes)).length);
    //   }
    // }, []);

  useEffect(() => {
    console.log('Cantidad de servicios pendientes: ', pendingServicesCount);
  }, [pendingServicesCount]);
  
  


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
      // const response = await fetch(`http://localhost:3001/api/v1/service/${serviceId}`, {
      //   method: 'POST'
      // });

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
