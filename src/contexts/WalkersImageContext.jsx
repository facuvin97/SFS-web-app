import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const WalkersImageContext = createContext();

export const useWalkersImageContext = () => useContext(WalkersImageContext);

export const WalkersImageContextProvider = ({ children }) => {
  const [walkerImages, setWalkerImages] = useState([]);
  const [walkerTurns, setWalkerTurns] = useState({});
  const { userLog } = useUser();

  useEffect(() => {
    const getWalkerImages = async () => {
      try {
        const token = localStorage.getItem('userToken');

        if (!userLog || !token) {
          return;
        }
        const response = await fetch(`${baseUrl}/image/walkers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const walkers = await response.json();
          const images = await Promise.all(walkers.map(async (walker) => {
            const imageResponse = await fetch(`${baseUrl}/image/single/${walker.nombre_usuario}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              const objectURL = URL.createObjectURL(blob);
              return { ...walker, imageSrc: objectURL };
            } else {
              console.error('Error al obtener la imagen del paseador:', imageResponse.statusText);
              return { ...walker, imageSrc: null };
            }
          }));
          setWalkerImages(images);
        } else {
          console.error('Error al obtener los datos de los paseadores:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener los datos de los paseadores:', error);
      }
    };

    if (userLog) {
      getWalkerImages();
    }

    return () => {
      walkerImages.forEach(walker => {
        if (walker.imageSrc) {
          URL.revokeObjectURL(walker.imageSrc);
        }
      });
    };
  }, [userLog]);

  const getWalkerTurns = async (walkerId) => {
    const token = localStorage.getItem('userToken');

        if (!userLog || !token) {
          return;
        }
    if (walkerTurns[walkerId]) {
      return walkerTurns[walkerId];
    }
    try {
      const response = await fetch(`${baseUrl}/turns/walker/${walkerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWalkerTurns((prev) => ({ ...prev, [walkerId]: data.body }));
        return data.body;
      } else {
        console.error('Error al obtener los turnos del paseador:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener los turnos del paseador:', error);
    }
  };

  return (
    <WalkersImageContext.Provider value={{ walkerImages, getWalkerTurns, setWalkerImages }}>
      {children}
    </WalkersImageContext.Provider>
  );
};
