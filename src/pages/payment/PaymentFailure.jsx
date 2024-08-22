import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Failure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la página anterior después de 5 segundos
    const timer = setTimeout(() => {
      navigate('/payments-list'); // navega hacia la página anterior
    }, 5000);

    // Limpiar el temporizador en caso de que el componente se desmonte
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className = "card">
      <h1>Pago fallido</h1>
      <p>Hubo un problema al procesar tu pago. Serás redirigido a tus facturas en unos momentos.</p>
    </div>
  );
};

export default Failure;
