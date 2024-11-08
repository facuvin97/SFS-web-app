import React, { createContext, useContext, useState, useEffect } from 'react';

const ClientImageContext = createContext();

export const useClientImageContext = () => useContext(ClientImageContext);

export const ClientImageContextProvider = ({ children }) => {
  const [clientImages, setClientImages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const getClientImages = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if(!token) {
          throw new Error('No hay token');
        }
        if (selectedUserId) {
          const response = await fetch(`http://localhost:3001/api/v1/image/single/${selectedUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const clientImagesData = await response.json();
            setClientImages(clientImagesData);
          } else {
            console.error('Error al obtener las imágenes de los clientes:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error al obtener las imágenes de los clientes:', error);
      }
    };

    if (selectedUserId) {
      getClientImages();
    }
  }, [selectedUserId]);

  return (
    <ClientImageContext.Provider value={{ clientImages, setSelectedUserId }}>
      {children}
    </ClientImageContext.Provider>
  );
};
