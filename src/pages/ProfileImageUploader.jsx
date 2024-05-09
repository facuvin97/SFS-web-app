import React, { useEffect, useState } from 'react';
import '../styles/Account.css';
import { useNavigate } from 'react-router-dom';
import useUserImage from '../hook/UseUserImage';
import { useUserImageContext } from '../contexts/UserImageContext'; // Importa el contexto

function ProfileImageUploader(props) { // Asegúrate de recibir props como parámetro
  const [image, setImage] = useState(null);
  const { setImageSrc } = useUserImageContext(); // Obtiene setImageSrc del contexto
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };



  const uploadImage = async () => {
    const formData = new FormData()
    formData.append('imagenPerfil', image)
    
  
    try {
      const response = await fetch(`http://localhost:3001/api/v1/image/single/${props.userLog.nombre_usuario}`, { // Accede a userLog a través de props
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) { //si se cargo bien
        console.log('Imagen subida con éxito');

        //traigo la imagen que recien subi
          try {
            const userData = localStorage.getItem('userData');
            if (userData) {
              const user = JSON.parse(userData);
              const response = await fetch(`http://localhost:3001/api/v1/image/single/${user.nombre_usuario}`);
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

        navigate(`/user/${props.userLog.id}`)

        
      } else {
        console.error('Error al subir la imagen:', response.statusText);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error)
    }
  };

  return (
    <div>
      <h2>Subir imagen de perfil</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={uploadImage}>Subir imagen</button>
      {image && (
        <div className="profile-image-container">
          <img className="profile-image" src={URL.createObjectURL(image)} alt="Profile" />
        </div>
      )}
    </div>
  );
}

export default ProfileImageUploader;