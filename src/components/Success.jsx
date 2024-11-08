import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



const Success = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  
  useEffect(() => {
    // Si no hay token, redirigir al inicio 
    if (!token) {
      navigate('/');
    } 
  }, [token, navigate]);
  
  return (
    <div>
      <h1>Pago exitoso!</h1>
      <p>Tu pago ha sido procesado exitosamente.</p>
    </div>
  );
};

export default Success;