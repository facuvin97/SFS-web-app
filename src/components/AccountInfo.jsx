import React, { useState } from 'react';
import '../styles/Account.css'; // Importamos el archivo CSS para los estilos
import EditIcon from '@mui/icons-material/Edit';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Link } from 'react-router-dom';
import DeleteUser from '../pages/users/DeleteUser';
import { Button, IconButton, MenuItem, Tooltip } from '@mui/material';
import { useUserImageContext } from '../contexts/UserImageContext';
import noImage from '../assets/no_image.png'


// Método que fuerza la actualización del componente  


function Account ({ user, onLogin }) {
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const { imageSrc} = useUserImageContext();

  const handleDeleteUser = () => {
    setShowDeleteUser(true);
  };


  return (
    <div className="account-container">
      <span className='span'>
        <h2 className="account-title">Account Information</h2>
      </span>
      <div className="profile-image-container">
        <img src={imageSrc || noImage} alt="User Avatar" className='profile-image' />
      </div>
      
      <div className="user-info">
        <p><strong>Nombre de Usuario:</strong> {user.nombre_usuario}</p>
        <p><strong>Telefono:</strong> {user.telefono}</p>
        <p><strong>Fecha de Nacimiento:</strong>{new Date(user.fecha_nacimiento).toLocaleDateString()}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Direccion:</strong> {user.direccion}</p>
        {/* Añade más campos de información del usuario según sea necesario */}
      </div>
      <div className="button-container">
        <Tooltip title="Editar Usuario" arrow>
          <Link to={`/modify-user/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <IconButton className="edit-icon">
              <EditIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Cambiar Imagen" arrow>
          <Link to={`/image/single/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <IconButton className="edit-icon">
              <InsertPhotoIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Eliminar Usuario" arrow>
          <IconButton className="edit-icon" onClick={handleDeleteUser}>
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </div>
      {showDeleteUser && <DeleteUser userLog={user} onLogin={onLogin} />}
    </div>
  );
};

export default Account;
