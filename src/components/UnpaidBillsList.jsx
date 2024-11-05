import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ButtonBase, Divider } from '@mui/material';
import { useUnpaidBillsContext } from '../contexts/BillContext';


function UnpaidBillsList() {
  const { unpaidBills, setBillToPay } = useUnpaidBillsContext(); // Estado para almacenar las facturas impagas
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función para manejar el clic en una factura
  const handleBillClick = async (bill) => {
    localStorage.setItem('selectedBill', JSON.stringify(bill));
    navigate('/payment', { state: { bill } }); // Navegar a la página de pago pasando la factura seleccionada
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h5" gutterBottom>
        Facturas
      </Typography>
      <List>
        {unpaidBills.map((bill) => (
          <React.Fragment key={bill.id}>
            <ButtonBase button onClick={() => handleBillClick(bill)}>
              {/* Mostrar el ID de la factura y la fecha en la lista */}
              <ListItemText
                primary={`Factura ID: ${bill.id}`}
                secondary={`Fecha: ${new Date(bill.fecha).toLocaleDateString()} - Monto: $${bill.monto}`}
              />              
            </ButtonBase>
            {bill.pendiente ? (<ListItemText
                primary={`Pago Pendiente`}
              />): <ListItemText
              primary={`Impaga`}
            />}
            <Divider /> {/* Separador entre elementos de la lista */}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UnpaidBillsList;
