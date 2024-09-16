/* import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';




function BillCard({ }) {
  const navigate = useNavigate(); // Obtener la función de navegación programática



  const [preferenceId, setPreferenceId] = useState(null)
  const [bill, setBill] = useState({
    "id": 33,
    "fecha": "2024-08-12 11:38:06",
    "monto": "1100.00",
    "pagado": false,
    "createdAt": "2024-08-12 11:38:06",
    "updatedAt": "2024-08-12 11:38:06",
    "ServiceId": 92
  }); 
  
  //INICIALIZA MERCADOPAGO
  useEffect(() => {
    initMercadoPago('APP_USR-b2734bc4-7547-4b95-a294-f0fb2c93baba', {
      locale: "es-UY"
  });//public key paseador
  if (bill && bill.Service && bill.Service.Turn && bill.Service.Turn.Walker) {
    console.log("public de paseador",bill.Service.Turn.Walker);
  }
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
 */
import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import { useUnpaidBillsContext } from '../contexts/BillContext';


function BillCard() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const billToPay = JSON.parse(localStorage.getItem('selectedBill'));
  const [mercadopagoDisponible, setMercadopagoDisponible] = useState(null); // Estado para mercadopagoDisponible

  const fetchPaymentData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/bills/pay", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      const response = await fetch(`http://localhost:3001/api/v1/walkers/byBill/${billToPay.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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
        console.log('mercadopago disponible', mercadopago);
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
