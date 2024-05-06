import React, { useEffect, useState } from 'react';
import '../styles/Account.css';
import { useNavigate } from 'react-router-dom';
import useUserImage from '../hook/UseUserImage';

function ProfileImageUploader(props) { // Asegúrate de recibir props como parámetro
  const [image, setImage] = useState(null);

  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };



  const uploadImage = async () => {
    const formData = new FormData()
    formData.append('imagenPerfil', image)
    console.log(formData)
    
  
    try {
      const response = await fetch(`http://localhost:3001/api/v1/image/single/${props.userLog.nombre_usuario}`, { // Accede a userLog a través de props
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Imagen subida con éxito');
        // Aquí puedes hacer algo después de subir la imagen, como actualizar el estado de la imagen en tu aplicación
        //useUserImage(props.userLog.nombre_usuario)
        navigate(`/user/${props.userLog.id}`)
        //window.location.reload();
        
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