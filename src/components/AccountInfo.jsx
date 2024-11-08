import React, { useState, useEffect } from 'react';
import '../styles/Account.css'; // Importamos el archivo CSS para los estilos
import EditIcon from '@mui/icons-material/Edit';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Link } from 'react-router-dom';
import DeleteUser from '../pages/users/DeleteUser';
import { Button, IconButton, MenuItem, Tooltip } from '@mui/material';
import { useUserImageContext } from '../contexts/UserImageContext';
import noImage from '../assets/no_image.png'
import { useUser } from '../contexts/UserLogContext'; 
import { useNavigate } from 'react-router-dom';


function Account () {
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const { imageSrc} = useUserImageContext();
  const { userLog } = useUser();
  const token = localStorage.getItem('userToken')
  const navigate = useNavigate()

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleDeleteUser = () => {
    setShowDeleteUser(true);
  };

  useEffect(() => {

  }, [userLog]);

  const onCancel = () => {
    setShowDeleteUser(false);
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
        <p><strong>Nombre de Usuario:</strong> {userLog.nombre_usuario}</p>
        <p><strong>Telefono:</strong> {userLog.telefono}</p>
        <p><strong>Fecha de Nacimiento:</strong>{userLog.fecha_nacimiento}</p>
        <p><strong>Email:</strong> {userLog.email}</p>
        <p><strong>Direccion:</strong> {userLog.direccion}</p>
        {/* Añade más campos de información del usuario según sea necesario */}
      </div>
      <div className="button-container">
        <Tooltip title="Editar Usuario" arrow>
          <Link to={`/modify-user`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <IconButton className="edit-icon">
              <EditIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Cambiar Imagen" arrow>
          <Link to={`/image/single/${userLog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
      {showDeleteUser && <DeleteUser onCancel={onCancel} />}
    </div>
  );
};

export default Account;
