import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;


function BillCard() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const billToPay = JSON.parse(localStorage.getItem('selectedBill'));
  const [mercadopagoDisponible, setMercadopagoDisponible] = useState(null); // Estado para mercadopagoDisponible
  const token = localStorage.getItem('userToken')
  const navigate = useNavigate()
  const [efectivoDisponible, setEfectivoDisponible] = useState(null); // Estado para efectivoDisponible
  const today =new Date(billToPay.fecha);

  today.setHours(today.getHours() +3);
  const fecha= today.toISOString().split('T')[0];

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);


  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`${baseUrl}/bills/pay` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          
        },
        body: JSON.stringify({
          billId: billToPay.id // Pasar el ID de la factura al backend
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPreferenceId(data.id); // Guardar el ID de la preferencia
      setPublicKey(data.publicKey); // Guardar la public key del paseador

      // Inicializar MercadoPago con la public key del paseador
      initMercadoPago(data.publicKey, { locale: "es-UY" });
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    }
  };

  const verificarMercadoPago = async () => {
    try {
      const response = await fetch(`${baseUrl}/walkers/byBill/${billToPay.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('data',data);
      return data.body;
    } catch (error) {
      console.error('Failed to fetch walker data:', error);
    }
  };

  const handlePendingPayment = async () => {
    try {
      const response = await fetch(`${baseUrl}/bills/${billToPay.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`          
        },
        body: JSON.stringify({
          pagado: false,
          pendiente: true
        })
      });   
      const data = await response.json();
      
      console.log('data',data);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      navigate(-1);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    }
  };


  useEffect(() => {
    async function fetchData() {
      if (billToPay) {
        const walker = await verificarMercadoPago();
        setMercadopagoDisponible(walker.mercadopago); // Actualizar el estado
        setEfectivoDisponible(walker.efectivo); // Actualizar el estado
        console.log('walker',walker);

        if (walker.mercadopago) {
          fetchPaymentData();
        }
      }
    }

    fetchData(); // Llamar a la función async inmediatamente
  }, []);

  return (
    <Card
      sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
    >
      <CardContent >
        <Typography gutterBottom variant="h6" component="div">
          Factura ID: {billToPay.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Fecha:</strong> {fecha}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Monto: $</strong> {billToPay.monto}
        </Typography>
        {billToPay.Service.comenzado ? (
          !billToPay.pendiente ? (
            <>
              {preferenceId && mercadopagoDisponible && <Wallet initialization={{ preferenceId: preferenceId }} />}
              {efectivoDisponible && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePendingPayment}
                  sx={{ marginTop: 2 }}
                >
                  Pagar en efectivo
                </Button>
              )}
            </>
          ) : <Typography variant="body2" color="text.secondary" marginTop={3}>
            <strong>El pago sera confirmado por el paseador <br />
               al momento de abonar el servicio.</strong>
              </Typography>
        ) : (
          <Tooltip title="El pago será habilitado cuando el servicio esté en curso." arrow>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={null}
                sx={{ marginTop: 2 }}
                disabled={true}
              >
                Pagar
              </Button>
            </span>
          </Tooltip>
        )}

      </CardContent>
    </Card>
  );
}

export default BillCard;
