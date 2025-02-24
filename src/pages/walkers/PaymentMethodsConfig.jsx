import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch, Button, Typography, Box } from '@mui/material';
import { useUser } from '../../contexts/UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const mpBaseUrl = import.meta.env.VITE_API_MP_BASE_URL;
const mpClientId = import.meta.env.VITE_API_MP_CLIENT_ID;
const mpRedirectUri = import.meta.env.VITE_API_MP_REDIRECT_URI;

const PaymentMethodsConfig = () => {
  const { userLog, setUserLog } = useUser();
  const [efectivo, setEfectivo] = useState(userLog.efectivo || false);
  const [mercadoPago, setMercadoPago] = useState(userLog.mercadopago || false);
  const [refresh_token, setRefresh_token] = useState(userLog.refresh_token || '' )
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');  


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  useEffect(() => {
    const fetchWalker = async () => {
      try {

        const response = await fetch(`${baseUrl}/walkers/${userLog.id}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        if (response.ok) {
          const data = await response.json();
          setEfectivo(data.body.efectivo);
          setMercadoPago(data.body.mercadopago);
          setRefresh_token(data.body.refresh_token || '')
        } else {
          console.error("Error fetching walker data:", await response.text());
        }
      } catch (error) {
        console.error('Error fetching walker data:', error);
      }
    };

    fetchWalker();
  }, [userLog.id]);

  const handleSaveClick = async () => {
    if (!efectivo && !mercadoPago) {
      setError('Debes seleccionar al menos un método de pago.');
      return;
    }
    if(!refresh_token && mercadoPago){
      setError('Primero debes asociar una cuenta de MercadoPago.');
      return;
    }

    const updatedUserLog = {
      ...userLog,
      efectivo,
      mercadopago: mercadoPago,
    };
    

    try {

      const response = await fetch(`${baseUrl}/payments/manage/${userLog.id}`, {
        method: 'PUT',
        headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
           },
        body: JSON.stringify({
          efectivo: efectivo,
          mercadopago: mercadoPago,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserLog(updatedUserLog);
        setError(null);
        navigate(-1);
      } else {
        const errorText = await response.text();
        setError(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Ocurrió un error al intentar guardar la configuración.');
    }
  };

  return (
    <Box className="card" sx={{ padding: 2 }}>
      <Typography variant="h6">Configurar Métodos de Pago</Typography>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1">Efectivo</Typography>
        <Switch
          checked={efectivo}
          onChange={(e) => setEfectivo(e.target.checked)}
        />
      </Box>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1">Mercado Pago</Typography>
        <Switch
          checked={mercadoPago}
          onChange={(e) => setMercadoPago(e.target.checked)}
        />
      </Box>

      {!refresh_token ? (
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = `${mpBaseUrl}client_id=${mpClientId}&response_type=code&platform_id=mp&state=${userLog.nombre_usuario}&redirect_uri=${mpRedirectUri}`}
          >
            Asociar Mercado Pago
          </Button>
        </Box>
      ): null}

      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleSaveClick}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentMethodsConfig;
