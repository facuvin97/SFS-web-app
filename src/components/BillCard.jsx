import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';


function BillCard() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const billToPay = JSON.parse(localStorage.getItem('selectedBill'));
  const [mercadopagoDisponible, setMercadopagoDisponible] = useState(null); // Estado para mercadopagoDisponible
  const token = localStorage.getItem('userToken')


  const fetchPaymentData = async () => {
    try {
      if(!token){
        return alert('Usuario no autorizado')
      }
      const response = await fetch("http://localhost:3001/api/v1/bills/pay", {
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
      if(!token){
        return alert('Usuario no autorizado')
      }
      const response = await fetch(`http://localhost:3001/api/v1/walkers/byBill/${billToPay.id}`, {
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

      return data.body;
    } catch (error) {
      console.error('Failed to fetch walker data:', error);
    }
  };


  useEffect(() => {
    async function fetchData() {
      if (billToPay) {
        const mercadopago = await verificarMercadoPago();
        setMercadopagoDisponible(mercadopago); // Actualizar el estado

        if (mercadopago) {
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
          <strong>Fecha:</strong> {new Date(billToPay.fecha).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Monto: $</strong> {billToPay.monto}
        </Typography>
        {billToPay.Service.comenzado ? <Tooltip>
          {preferenceId && mercadopagoDisponible && <Wallet initialization={{ preferenceId: preferenceId }} />}
          <Button
            variant="contained"
            color="primary"
            onClick={null}
            sx={{ marginTop: 2 }}
          >
            Pagar en efectivo
          </Button>
        </Tooltip>
        : <Tooltip title='El pago sera habilitado cuando el servicio este en curso.' arrow>
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
          </Tooltip>}
      </CardContent>
    </Card>
  );
}

export default BillCard;
