import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const SuccessAsociationMP = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userLog, setUserLog } = useUser();
  const token = localStorage.getItem('userToken');

  
  useEffect(() => {
    // Si no hay token, redirigir al inicio 
    if (!token) {
      navigate('/');
    } 
  }, [token, navigate]);

  const successAsociation = async (code) => {
    try {
      const response = await fetch(`${baseUrl}/walkers/mercadopago/${userLog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code,
        }),
      });

      if (response.ok) {
        // Actualiza campo mercadopago en userLog
        setUserLog((prevUserLog) => ({
          ...prevUserLog,
          code: code,
        }));

        setLoading(false);
        navigate(`/profile/${userLog.id}`);
      } else {
        console.error('Error al actualizar mercadopago');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);

    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    console.log('code:', code)

    if (code === null) {
      // navigate('/'); // No hay parámetro `code`, redirige al inicio
      console.log('no hay code en la url')
    } else {
      successAsociation(code); // Hay parámetro `code`, realiza la asociación
    }
  }, []);

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {loading ? (
        <>
          <CircularProgress />
          <Typography variant="h6" style={{ marginTop: '16px' }}>
            Cargando...
          </Typography>
        </>
      ) : (
        <Typography variant="h6">¡Carga completa! Lo estamos redireccionando...</Typography>
      )}
    </Container>
  );
};

export default SuccessAsociationMP;
