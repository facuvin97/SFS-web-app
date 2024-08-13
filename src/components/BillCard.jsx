import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';




function BillCard({ bill }) {
  const navigate = useNavigate(); // Obtener la función de navegación programática



  const [preferenceId, setPreferenceId] = useState(null)
  
  //INICIALIZA MERCADOPAGO
  useEffect(() => {
    initMercadoPago('APP_USR-f19648fa-7bf4-4904-a041-0c9abafeb0c7', {locale: "es-UY"});//public key paseador
  }, []);

  //creo la preferencia cuando se monta el componente
  useEffect(() => {
    const fetchPreferenceId = async () => {
      try {
        const id = await createPreference();
        console.log('Preference ID:', id);  // Añadir este log para verificar el ID
        setPreferenceId(id);
      } catch (error) {
        console.error('Failed to fetch preference ID:', error);
      }
    };
    fetchPreferenceId();
  }, []);
  


  //funcion para crear la preferencia
  const createPreference = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/bills/pay", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `Servicio Nº: ${bill.ServiceId}`,
          quantity: 1,
          price: bill.monto,
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const { id } = data; // Asegúrate de que la respuesta tenga una propiedad `id`
      return id;
    } catch (error) {
      console.error('Error creating preference:', error);
      throw error; // Re-lanzar el error para manejarlo en el useEffect
    }
  };

  const handleClick = () => {

  };  

  return (
    <Card
      sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          Factura ID: {bill.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Fecha:</strong> {new Date(bill.fecha).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Monto: $</strong> ${bill.monto}
        </Typography>
        <Tooltip title='Pagar factura' arrow>
        {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }}/>}
          <Button
            variant="contained"
            color="primary"
            onClick={null}
            sx={{ marginTop: 2 }}
          >
            Pagar en efectivo
          </Button>
        </Tooltip>
      </CardContent>
    </Card>
  );
}

export default BillCard;
