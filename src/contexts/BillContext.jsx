// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';

const UnpaidBillsContext = createContext();

export const useUnpaidBillsContext = () => useContext(UnpaidBillsContext);

export const UnpaidBillsProvider = ({ children }) => {
  const [unpaidBills, setUnpaidBills] = useState([]);
  const { userLog } = useUser();


  const getUnpaidBills = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/bills/client/${userLog.id}`);
      if (!response.ok) {
        throw new Error('Error al obtener las facturas');
      }
      const data = await response.json();
      const unpaidBills = data.body.filter(bill => !bill.pagado);
      setUnpaidBills(unpaidBills); // Guardar las facturas impagas en el estado
    } catch (error) {
      console.error('Error fetching unpaid bills:', error);
    }};


  useEffect(() => {
    if (userLog?.tipo === 'client') {
        getUnpaidBills();
    }
  }, [userLog]);

  
  return (
    <UnpaidBillsContext.Provider value={{ 
      unpaidBills, 
      setUnpaidBills
    }}>
      {children}
    </UnpaidBillsContext.Provider>
  );
};
