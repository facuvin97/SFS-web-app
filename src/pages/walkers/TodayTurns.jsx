import React, { useContext, useEffect } from 'react';
import { useWalkerTurnsContext } from '../../contexts/TurnContext'; 
import TodayTurnCard from '../../components/TodayTurnCard';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TodayTurns = () => {
  const { turns } = useWalkerTurnsContext();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  // Obtener el día de hoy en español
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Meses comienzan desde 0, por lo que sumamos 1
  const day = hoy.getDate().toString().padStart(2, '0');
  const fechaHoy = `${year}-${month}-${day}`;
  
  const diaHoy = diasSemana[hoy.getDay()];
  const horaActual = hoy.getHours() * 60 + hoy.getMinutes(); // Convertir la hora actual a minutos desde las 00:00

  // Filtrar los turnos que aún están en curso o no han comenzado
  const turnosHoy = turns.filter(turn => {
    const [horaFin, minutoFin] = turn.hora_fin.split(':').map(Number);
    const fin = horaFin * 60 + minutoFin;
    const finTurno= fin + 60
    
    return turn.dias.includes(diaHoy) && (horaActual < finTurno);
  });

    // Ordenar los turnos de hoy por hora de inicio
    turnosHoy.sort((a, b) => {
      const [horaInicioA, minutoInicioA] = a.hora_inicio.split(':').map(Number);
      const [horaInicioB, minutoInicioB] = b.hora_inicio.split(':').map(Number);
      return (horaInicioA * 60 + minutoInicioA) - (horaInicioB * 60 + minutoInicioB);
    });

  // Si no quedan turnos hoy, buscar los próximos turnos en otros días
  let turnosProximos = turnosHoy;
  let diaProximo = diaHoy;
  let fechaProxima = fechaHoy;

  if (turnosHoy.length === 0) {
    let i = 1;
    while (turnosProximos.length === 0 && i <= 7) {
      const siguienteFecha = new Date(hoy);
      siguienteFecha.setDate(hoy.getDate() + i);
      const siguienteDia = diasSemana[siguienteFecha.getDay()];
      const year = siguienteFecha.getFullYear();
      const month = (siguienteFecha.getMonth() + 1).toString().padStart(2, '0'); // Meses comienzan desde 0, por lo que sumamos 1
      const day = siguienteFecha.getDate().toString().padStart(2, '0');
      const fechaSiguiente = `${year}-${month}-${day}`;

      turnosProximos = turns.filter(turn => turn.dias.includes(siguienteDia));
      diaProximo = siguienteDia;
      fechaProxima = fechaSiguiente;
      i++;
    }
    turnosProximos.sort((a, b) => {
      const [horaInicioA, minutoInicioA] = a.hora_inicio.split(':').map(Number);
      const [horaInicioB, minutoInicioB] = b.hora_inicio.split(':').map(Number);
      return (horaInicioA * 60 + minutoInicioA) - (horaInicioB * 60 + minutoInicioB);
    });
  }

  const formatearFecha = (fecha) => {
    const [año, mes, día] = fecha.split('-');
    return `${día}/${mes}/${año}`;
  };


  return (
    <div>
      <Container className='card'>
        <h2>
        {turnosHoy.length > 0
          ? `Turnos para hoy (${diaHoy}, ${formatearFecha(fechaHoy)})`
          : <>No hay turnos para el día de hoy.<br />Próximos turnos ({diaProximo}, {formatearFecha(fechaProxima)})</>
        }
      </h2>
      </Container>
      {turnosProximos.length > 0 ? (
        turnosProximos.map(turn => (
          <TodayTurnCard key={turn.id} turn={turn} fecha={turnosHoy.length > 0 ? fechaHoy : fechaProxima}
        />
        ))
      ) : (
        <strong>No hay turnos disponibles.</strong>
      )}
    </div>
  );
};

export default TodayTurns;
