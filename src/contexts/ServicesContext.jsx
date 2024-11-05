// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';

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
      let response;

      if (userLog?.tipo === 'walker') {
        response = await fetch(`http://localhost:3001/api/v1/services/walker/${userLog.id}`);
      } else if (userLog?.tipo === 'client') {
        response = await fetch(`http://localhost:3001/api/v1/services/client/${userLog.id}`);
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
        

        return (
          !service.aceptado &&
          serviceDate.getFullYear() >= today.getFullYear() &&
          serviceDate.getMonth() >= today.getMonth() &&
          serviceDate.getDate() >= today.getDate()
        );     

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
      const serviciosConcretados = data.body.filter(service => {
        const serviceDate = new Date(service.fecha); // Convierte service.fecha a un objeto Date
        serviceDate.setHours(serviceDate.getHours() + 3);

        // Verifica si el servicio está aceptado y si la fecha es igual o menor a hoy
        if (service.aceptado && serviceDate <= today) {
          // Si la fecha es hoy, verifica si service.Turn.hora_fin es menor a la hora actual
          if (isSameDay(serviceDate, today) && service.Turn.hora_fin) {
    
            const horaActual = new Date(); // Hora actual 
            const horaFinString = `1970-01-01T${service.Turn.hora_fin}`;
            const horaFin = new Date(horaFinString);
            horaFin.setHours(horaFin.getHours() + 3);
            horaFin.setFullYear(horaActual.getFullYear());
            horaFin.setMonth(horaActual.getMonth());
            horaFin.setDate(horaActual.getDate());

            // Compara la hora especificada (horaFin) con la hora actual (horaActual)
            if (horaFin <= horaActual) {
              return true; // Si la hora final es antes o igual a la hora actual, el servicio está concretado
            }
          } else {
            return true; // Si no es hoy, el servicio está concretado sin importar la hora
          }
        }
        
        return false; // Si no está aceptado o la fecha es futura, el servicio no está concretado
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
      let data;
      if (userLog?.tipo === 'walker') {
        data = {
          execUserType: userLog.tipo,
          userId: service.ClientId,
          fecha: service.fecha
        }
      } else if (userLog?.tipo === 'client') {
        const turnResponse = await fetch(`http://localhost:3001/api/v1/turns/${service.TurnId}`)
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
      const deleteResponse = await fetch(`http://localhost:3001/api/v1/services/${service.id}`, {
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

  const authorizeService = async (service) => {
    try {

      service.aceptado = true;

      const response = await fetch(`http://localhost:3001/api/v1/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
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
