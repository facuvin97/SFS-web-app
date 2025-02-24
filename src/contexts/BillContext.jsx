// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const UnpaidBillsContext = createContext();

export const useUnpaidBillsContext = () => useContext(UnpaidBillsContext);

export const UnpaidBillsProvider = ({ children }) => {
  const [unpaidBills, setUnpaidBills] = useState([]);
  const { userLog } = useUser();
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();

  const getUnpaidBills = async () => {
    try {
      
      if (!token) {
        return navigate('/');
      }
      const response = await fetch(`${baseUrl}/bills/client/${userLog.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
