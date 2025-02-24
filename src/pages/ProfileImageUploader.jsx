import React, { useEffect, useRef, useState } from 'react';
import '../styles/Account.css';
import { useNavigate } from 'react-router-dom';
import { useUserImageContext } from '../contexts/UserImageContext'; // Importa el contexto
import { Save } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useUser } from '../contexts/UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ProfileImageUploader() { 
  const [image, setImage] = useState(null);
  const { setImageSrc } = useUserImageContext(); // Obtiene setImageSrc del contexto
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { userLog } = useUser()
  const token = localStorage.getItem('userToken');
  

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click(); // Simula un clic en el input de tipo file
  };

  const uploadImage = async () => {
    const formData = new FormData()
    formData.append('imagenPerfil', image)
    
  
    try {

      const response = await fetch(`${baseUrl}/image/single/${userLog.nombre_usuario}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) { //si se cargo bien
        console.log('Imagen subida con éxito');

        //traigo la imagen que recien subi
          try {
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

          if (userLog.tipo === 'client') {
            navigate(`/user/${userLog.id}`)
          } else {
            navigate(`/profile/${userLog.id}`)
          }


        
      } else {
        console.error('Error al subir la imagen:', response.statusText);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error)
    }
  };

  return (
    <div className="account-container">
      <h2>Subir imagen de perfil</h2>
      <input type="file" accept="image/*" ref={fileInputRef} // Asigna la referencia al input de tipo file
        onChange={handleImageChange}
        style={{ display: 'none' }} // Oculta visualmente el input de tipo file
      />
      <button onClick={handleUploadButtonClick}>Seleccionar imagen</button>
      {image && (
        <div>      
            <div className="profile-image-container">
              <img className="profile-image" src={URL.createObjectURL(image)} alt="Profile" />
            </div>
            <Tooltip title="Guardar Imagen" arrow>
              <IconButton className="edit-icon" onClick={uploadImage}>
                <Save />
              </IconButton>
            </Tooltip>   
        </div>
      )}
    </div>
  );
}

export default ProfileImageUploader;