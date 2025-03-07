// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const ConfirmedServicesContext = createContext();

export const useConfirmedServicesContext = () => useContext(ConfirmedServicesContext);

export const ConfirmedServicesProvider = ({ children }) => {
  const [confirmedServices, setConfirmedServices] = useState([]); //servicios aceptados que no han sucedido
  const [pendingServices, setPendingServices] = useState([]) //servicios sin aceptar que no han sucedido
  const [oldServices, setOldServices] = useState([]) //servicios aceptados que ya sucedieron
  const [pendingServicesCount, setPendingServicesCount] = useState(0);
  const { userLog } = useUser();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();
  

  // Función auxiliar para verificar si dos fechas son del mismo día
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const getConfirmedServices = async () => {
    try {
      if(!token) {
        return navigate('/');
      }
      let response;

      if (userLog?.tipo === 'walker') {
        response = await fetch(`${baseUrl}/services/walker/${userLog.id}`,
          { headers: { 'Authorization': `Bearer ${token}` } 
        });
      } else if (userLog?.tipo === 'client') {
        response = await fetch(`${baseUrl}/services/client/${userLog.id}`,
          { headers: { 'Authorization': `Bearer ${token}` } 
        });
      } else {
        throw new Error('Tipo de usuario invalido')
      }
      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }

      const data = await response.json();

      // filtro la lista de servicios pendientes 
      const serviciosPendientes = data.body.filter(service => {
        const serviceDate = new Date(service.fecha); // Convierte service.fecha a un objeto Date
        serviceDate.setHours(serviceDate.getHours() + 3);
      
        // Obtiene la fecha de hoy sin horas/minutos/segundos
        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        return !service.aceptado && serviceDate >= today;
      });

      // cargo la lista de servicios pendientes
      setPendingServices(serviciosPendientes);
      setPendingServicesCount(serviciosPendientes.length);



      // obtengo solo los servicios confirmados en el futuro
      const serviciosConfirmados = data.body.filter(service => {
        const serviceDate = new Date(service.fecha); // Convierte service.fecha a un objeto Date
        serviceDate.setHours(serviceDate.getHours() + 3);
        return service.aceptado && serviceDate >= today; // Verifica si aceptado es true y la fecha es igual o mayor a hoy
      });

      //cargo la lista de servicios confirmados
      setConfirmedServices(serviciosConfirmados);
      


      // Obtengo solo los servicios concretados
      console.log('data.body', data.body);
      const serviciosConcretados = data.body.filter(service => {
        // Convertimos la fecha del servicio y ajustamos la diferencia horaria
        const serviceDate = new Date(service.fecha);
        serviceDate.setHours(serviceDate.getHours() + 3);
      
        // Validamos si el servicio fue aceptado y la fecha es hoy o pasada
        if (!service.aceptado || serviceDate > today) {
          return false;
        }
      
        return service.finalizado;
      
        // // Si el servicio es hoy y tiene hora de finalización, la comparamos con la hora actual
        // if (isSameDay(serviceDate, today) && service.Turn?.hora_fin) {
        //   const horaActual = new Date();
        //   const horaFin = new Date(`1970-01-01T${service.Turn.hora_fin}`);
          
        //   // Ajustamos la hora fin a hoy y sumamos la diferencia horaria
        //   horaFin.setHours(horaFin.getHours() + 3);
        //   horaFin.setFullYear(horaActual.getFullYear(), horaActual.getMonth(), horaActual.getDate());
      
        //   return horaFin <= horaActual; // Si la hora de finalización ya pasó, el servicio está concretado
        // }
      
        // // Si no es hoy, el servicio está concretado sin importar la hora
        // return true;
      });
      
      

      // Ordena los servicios concretados por fecha, del más reciente al más antiguo
      serviciosConcretados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      //cargo la lista de servicios concretados
      setOldServices(serviciosConcretados);

    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

    //cargo todos los estados de servicio cada vez que cambia el userLog
  useEffect(() => {
    if (userLog) {
      getConfirmedServices();
    }
  }, [userLog]);

  const deleteService = async (service) => {
    try {
      if(!token) {
        return navigate('/');
      }
      let data;
      if (userLog?.tipo === 'walker') {
        data = {
          execUserType: userLog.tipo,
          userId: service.ClientId,
          fecha: service.fecha
        }
      } else if (userLog?.tipo === 'client') {
        const turnResponse = await fetch(`${baseUrl}/turns/${service.TurnId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const turn = await turnResponse.json();

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
      const deleteResponse = await fetch(`${baseUrl}/services/${service.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

      // Actualizar la lista de servicios guardada en el estado
      setPendingServices(prevServices =>
        prevServices.filter(s => s.id !== service.id)
      );
   
      return "Servicio cancelado correctamente";
      
    } catch (error) {
      console.error('Error al procesar la solicitud:', error.message);
      return 'Error al cancelar servicio';
    }
  };

  const authorizeService = async (service) => {
    try {
      if(!token) {
        return navigate('/');
      }
      service.aceptado = true;

      const response = await fetch(`${baseUrl}/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(service)
      });

      if (!response.ok) {
        throw new Error('Error al autorizar el servicio');
      }
      await getConfirmedServices(); // Actualizar el conteo después de autorizar
      return "Servicio aceptado correctamente";
    } catch (error) {
      console.error('Error al autorizar el servicio:', error);
    }
  };

  
  return (
    <ConfirmedServicesContext.Provider value={{ 
      confirmedServices, 
      pendingServices,
      pendingServicesCount,
      oldServices,
      deleteService, 
      authorizeService,
      setPendingServices,
      setOldServices,
      getConfirmedServices
    }}>
      {children}
    </ConfirmedServicesContext.Provider>
  );
};
