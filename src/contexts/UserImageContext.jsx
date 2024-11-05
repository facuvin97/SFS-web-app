// UserImageContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const UserImageContext = createContext();

export const useUserImageContext = () => useContext(UserImageContext);

export const UserImageContextProvider = ({ children }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const token = localStorage.getItem('userToken');

   // Obtener la imagen de perfil del usuario logueado al cargar la aplicación
   useEffect(() => {
    const getUserImage = async () => {
      try {
        if(!token) {
          return alert('Usuario no autorizado');
        }
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          const response = await fetch(`http://localhost:3001/api/v1/image/single/${user.nombre_usuario}`, { 
              headers: { 
                'Authorization': `Bearer ${token}` 
              } 
          });
          if (response.ok) {
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            setImageSrc(objectURL);
          } else {
            console.error('Error al obtener la imagen del usuario:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error al obtener la imagen del usuario:', error);
      }
    };

    getUserImage();

    // Limpiar el objectURL cuando el componente se desmonta para evitar fugas de memoria
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, []);


  return (
    <UserImageContext.Provider value={{ imageSrc, setImageSrc }}>
      {children}
    </UserImageContext.Provider>
  );
};
