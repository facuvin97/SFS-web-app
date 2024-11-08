import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUnpaidBillsContext } from '../../contexts/BillContext';

const SuccessPayment = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUnpaidBills } = useUnpaidBillsContext()
  const billToPay = JSON.parse(localStorage.getItem('selectedBill'));
  const token = localStorage.getItem('userToken');


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  const successPay = async () => {
    try {

      const response = await fetch(`http://localhost:3001/api/v1/bills/${billToPay.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pagado: true,
          pendiente: false
        })
      });
      if (response.ok) {
        setUnpaidBills((prevBills) => prevBills.filter(bill => bill.id !== billToPay.id)); // Saco la factura pagada de la lista de no pagas
        localStorage.removeItem('selectedBill');
        setLoading(false);
        setTimeout(() => {
          navigate('/payment-list'); // Redirige a una página de éxito
        }, 4000); // 4000 milisegundos = 4 segundos
      } else {
        console.error('Error al pagar');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);

    }
  };

  useEffect(() => {
    successPay()
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
        <Typography variant="h6">¡Pago realizado con exito! Lo estamos redireccionando...</Typography>
      )}
    </Container>
  );
};

export default SuccessPayment;
