// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';

const ConfirmedServicesContext = createContext();

export const useConfirmedServicesContext = () => useContext(ConfirmedServicesContext);

export const ConfirmedServicesProvider = ({ children }) => {
  const [confirmedServices, setConfirmedServices] = useState([]);//inicializa como array vacio
  const { userLog } = useUser();
  const today = new Date();

  const getConfirmedServices = async () => {
    try {
      let response;

      if (userLog.tipo === 'walker') {
        response = await fetch(`http://localhost:3001/api/v1/services/walker/${userLog.id}`);
      } else if (userLog.tipo === 'client') {
        response = await fetch(`http://localhost:3001/api/v1/services/client/${userLog.id}`);
      } else {
        throw new Error('Tipo de usuario invalido')
      }


      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }

      const data = await response.json();
      const serviciosConfirmados = data.body.filter(service => {
        const serviceDate = new Date(service.fecha); // Convierte service.fecha a un objeto Date
        return service.aceptado && serviceDate >= today; // Verifica si aceptado es true y la fecha es igual o mayor a hoy
      });

      setConfirmedServices(serviciosConfirmados);

    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  
  useEffect(() => {
    getConfirmedServices();
  }, [userLog]);

  const deleteService = async (service) => {
    try {
      let data;
      if (userLog.tipo === 'walker') {
        data = {
          execUserType: userLog.tipo,
          userId: service.ClientId,
          fecha: service.fecha
        }
      } else if (userLog.tipo === 'client') {
        const turnResponse = await fetch(`http://localhost:3001/api/v1/turn/${service.TurnId}`)
        const turn = await turnResponse.json();
        console.log('Turn en service context:', turn)

        data = {
          execUserType: userLog.tipo,
          userId: turn.body.WalkerId,
          fecha: service.fecha,
          nombreCliente: userLog.nombre_usuario
        }
      } else {
        data = null;
        throw new Error('Tipo de usuario invalido')
      }

      
      // Intenta eliminar el servicio
      const deleteResponse = await fetch(`http://localhost:3001/api/v1/service/${service.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!deleteResponse.ok) {
        throw new Error('Error al eliminar el servicio');
      }
  
      // Actualizar la lista de servicios guardada en el estado
      setConfirmedServices(prevServices =>
        prevServices.filter(s => s.id !== service.id)
      );
   
      return "Servicio cancelado correctamente";
      
    } catch (error) {
      console.error('Error al procesar la solicitud:', error.message);
      return 'Error al cancelar servicio';
    }
  };


  return (
    <ConfirmedServicesContext.Provider value={{ 
      confirmedServices, 
      setConfirmedServices, 
      deleteService, 
    }}>
      {children}
    </ConfirmedServicesContext.Provider>
  );
};
