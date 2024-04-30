import React, { useState } from 'react';
import '../styles/Account.css'; // Importamos el archivo CSS para los estilos
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import DeleteUser from '../pages/DeleteUser';

const Account = ({ user, onLogin }) => {
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  const handleDeleteUser = () => {
    setShowDeleteUser(true);
  };

  return (
    <div className="account-container">
      <span className='span'>
        <h2 className="account-title">Account Information</h2>
        <Link to={`/modify-user/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <EditIcon className='edit-icon'></EditIcon>
        </Link>
      </span>
      
      <div className="user-info">
        <p><strong>UserName:</strong> {user.nombre_usuario}</p>
        <p><strong>Telefono:</strong> {user.telefono}</p>
        <p><strong>Fecha de Nacimiento:</strong> {user.fecha_nacimiento}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Direccion:</strong> {user.direccion}</p>
        {/* Añade más campos de información del usuario según sea necesario */}
      </div>
      
      <button onClick={handleDeleteUser}>Eliminar usuario</button>

      {showDeleteUser && <DeleteUser userLog={user} onLogin={onLogin} />}
    </div>
  );
};

export default Account;
