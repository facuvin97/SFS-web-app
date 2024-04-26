import React from 'react';
import '../styles/Account.css'; // Importamos el archivo CSS para los estilos
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const Account = ({ user }) => {
  return (
    <div className="account-container">
      <span className='span'>
        <h2 className="account-title">Account Information</h2>
        <Link to={`/modify/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
      {/* Añade más secciones para información adicional de la cuenta */}
    </div>
  );
};

export default Account;
