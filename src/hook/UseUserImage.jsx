// UseUserImage.jsx

import React, { useState, useEffect } from 'react';
import { useUserImageContext } from '../contexts/UserImageContext';


function useUserImage(username) {
  const { setImageSrc } = useUserImageContext();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/image/single/${username}`);
        if (response.ok) {
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          setImageSrc(objectURL);
        } else {
          console.error('Error al obtener la imagen del usuario:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener la imagen del usuario:', error);
      }
    };

    fetchImage();

    // Limpiar el objectURL cuando el componente se desmonta para evitar fugas de memoria
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [username, setImageSrc]);

};

export default useUserImage;
