// UserImageContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const UserImageContext = createContext();

export const useUserImageContext = () => useContext(UserImageContext);

export const UserImageContextProvider = ({ children }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();
  const { userLog } = useUser();

   // Obtener la imagen de perfil del usuario logueado al cargar la aplicación
   useEffect(() => {
    const getUserImage = async () => {
      try {
        if(!token) {
          return navigate('/');
        }
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          const response = await fetch(`${baseUrl}/image/single/${user.nombre_usuario}`, { 
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

    if (userLog) {
      getUserImage();
    }

    // Limpiar el objectURL cuando el componente se desmonta para evitar fugas de memoria
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [token, navigate, userLog]);


  return (
    <UserImageContext.Provider value={{ imageSrc, setImageSrc }}>
      {children}
    </UserImageContext.Provider>
  );
};
