import React, { useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import { useUserImageContext } from '../contexts/UserImageContext'
import { useNavigate } from 'react-router-dom';

function ImageProfile ({ username }){
  const { imageSrc} = useUserImageContext();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  return (
    <Avatar alt="avatar" src={imageSrc || '/no_image.png'} />    
  )
}

export default ImageProfile
