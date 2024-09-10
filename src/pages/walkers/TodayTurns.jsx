import React, { useContext } from 'react';
import { useWalkerTurnsContext } from '../../contexts/TurnContext'; 
import TodayTurnCard from '../../components/TodayTurnCard';

const TodayTurns = () => {

  const { turns } = useWalkerTurnsContext();

  // Obtener el día de hoy en español
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaHoy = diasSemana[new Date().getDay()];
  // console.log("new date:", new Date())

  // Filtrar los turnos para el día de hoy
  const turnosHoy = turns.filter(turn => turn.dias.includes(diaHoy));


  return (
    <div>
      <h2>Turnos de Hoy ({diaHoy})</h2>
        {turnosHoy.length > 0 ? (
          turnosHoy.map(turn => (
            <TodayTurnCard key={turn.id} turn={turn} />
          ))
        ) : (
          <strong>No hay turnos para hoy.</strong>
        )}
    </div>
  );
};

export default TodayTurns;
