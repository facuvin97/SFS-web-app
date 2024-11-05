import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnpaidBillsContext } from '../../contexts/BillContext';


const PaymentPending = () => {
  const navigate = useNavigate();
  const { setUnpaidBills } = useUnpaidBillsContext()
  const billToPay = JSON.parse(localStorage.getItem('selectedBill'));
  const token = localStorage.getItem('userToken');

  const pendingPay = async () => {
    if (!billToPay) {
        console.error('No se encontró la factura seleccionada.');
        return;
      }
    try {
      if (!token) {
        return alert('Usuario no autorizado');
      }
      const response = await fetch(`http://localhost:3001/api/v1/bills/${billToPay.id}`, {
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
      if (response.ok) {
        //setUnpaidBills((prevBills) => prevBills.filter(bill => bill.id !== billToPay.id)); // Saco la factura pagada de la lista de no pagas
        //localStorage.removeItem('selectedBill');
        setTimeout(() => {
            navigate('/payment-list'); // Redirige a una página de lista de pagos después de 4 segundos
          }, 4000) // 4000 milisegundos = 4 segundos
      } else {
        console.error('Error al pagar');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);

    }
  };

  useEffect(() => {
   pendingPay()
  }, []);

  return (
    <div className = "card">
      <h1>Pago pendiente</h1>
      <p>Su pago quedo pendiente hasta que sea confirmado.
         Serás redirigido a tus facturas en unos momentos.</p>
    </div>
  );
};

export default PaymentPending;
