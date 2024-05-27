import React, { createContext, useContext, useState, useEffect } from 'react';

const WalkersImageContext = createContext();

export const useWalkersImageContext = () => useContext(WalkersImageContext);

export const WalkersImageContextProvider = ({ children }) => {
  const [walkerImages, setWalkerImages] = useState([]);
  const [walkerTurns, setWalkerTurns] = useState({});

  useEffect(() => {
    const getWalkerImages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/image/walkers');
        if (response.ok) {
          const walkers = await response.json();
          const images = await Promise.all(walkers.map(async (walker) => {
            const imageResponse = await fetch(`http://localhost:3001/api/v1/image/single/${walker.nombre_usuario}`);
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

    getWalkerImages();

    return () => {
      walkerImages.forEach(walker => {
        if (walker.imageSrc) {
          URL.revokeObjectURL(walker.imageSrc);
        }
      });
    };
  }, []);

  const getWalkerTurns = async (walkerId) => {
    if (walkerTurns[walkerId]) {
      return walkerTurns[walkerId];
    }
    try {
      const response = await fetch(`http://localhost:3001/api/v1/turns/walker/${walkerId}`);
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
    <WalkersImageContext.Provider value={{ walkerImages, getWalkerTurns }}>
      {children}
    </WalkersImageContext.Provider>
  );
};
