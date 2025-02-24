import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/AccountForm.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const navigate = useNavigate();
  let { typeUser } = useParams();
  
  // Estado para los datos del formulario y los errores
  const [userData, setUserData] = useState({
    nombre_usuario: '',
    contraseña: '',
    direccion: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    calificacion: null
  });
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState(null);

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    validateField(name, value);
  };

  // Función para validar cada campo individualmente
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nombre_usuario':
        if (!value.trim()) error = 'El nombre de usuario es obligatorio';
        else if (value.trim().length <3 || value.trim().length > 20) error = 'El nombre de usuario debe tener entre 3 y 20 caracteres';
        else if (/\s/.test(value)) error = 'El nombre de usuario no debe contener espacios';
        break;
        
      case 'contraseña':
        if (!value.trim()) error = 'La contraseña es obligatoria';
        else if (value.trim().length < 7 || value.trim().length > 30) error = 'La contraseña ebe tener entre 7 y 30 caracteres';
        else if (/\s/.test(value)) error = 'La contraseñ no debe contener espacios';
        break;
        
      case 'email':
        if (!value.trim()) error = 'El email es obligatorio';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'El email no es válido';
        break;
        
      case 'telefono':
        if (!value.trim()) error = 'El teléfono es obligatorio';
        else if (!/^\d{5,20}$/.test(value.trim())) error = 'El teléfono debe tener entre 5 y 20 dígitos (sin espacios)';
        else if (!/^[^\s].*[^\s]$|^[^\s]$/.test(value)) error = 'El telefono no debe contener espacios al principio o final';
        break;
        
      case 'fecha_nacimiento':
        if (!value.trim()) error = 'La fecha de nacimiento es obligatoria';
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) error = 'La fecha de nacimiento debe tener el formato AAAA-MM-DD';
        break;

      case 'direccion':
      if (!value.trim()) error = 'La dirección es obligatoria';
      else if (value.trim().length < 1 || value.trim().length > 100) error = 'La dirección debe tener minimo un caracrter y un máximo de 100 caracteres';
      else if (!/^[^\s].*[^\s]$|^[^\s]$/.test(value)) error = 'La dirección no debe contener espacios al principio o final';
      break;
        
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    let valid = true;
    Object.keys(userData).forEach((field) => {
      validateField(field, userData[field]);
      if (errors[field]) valid = false;
    });

    if (!valid) {
      console.log('Errores en el formulario');
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/${typeUser === 'client' ? 'clients' : 'walkers'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setMensaje(responseData.message);
        alert('Cuenta creada correctamente');
        navigate('/');
      } else {
        const responseData = await response.json();
        console.error('Error al registrar:', responseData);
        setMensaje(responseData.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="account-container">
      <h2>{typeUser === 'client' ? 'Registro de Cliente' : 'Registro de Paseador'}</h2>
      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="nombre_usuario"
            placeholder='Nombre de Usuario'
            value={userData.nombre_usuario}
            onChange={handleInputChange}
          />
          {errors.nombre_usuario && <p className="error">{errors.nombre_usuario}</p>}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder='Contraseña'
            name="contraseña"
            value={userData.contraseña}
            onChange={handleInputChange}
          />
          {errors.contraseña && <p className="error">{errors.contraseña}</p>}
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder='Dirección'
            name="direccion"
            value={userData.direccion}
            onChange={handleInputChange}
          />
          {errors.direccion && <p className="error">{errors.direccion}</p>}
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder='Email (xxxxx@xxx.xx)'
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <input
            type="tel"
            placeholder='Telefono'
            name="telefono"
            value={userData.telefono}
            onChange={handleInputChange}
          />
          {errors.telefono && <p className="error">{errors.telefono}</p>}
        </div>
        
        <div className="form-group">
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            placeholder='Fecha de Nacimiento (YYYY-MM-DD)'
            name="fecha_nacimiento"
            value={userData.fecha_nacimiento}
            onChange={handleInputChange}
          />
          {errors.fecha_nacimiento && <p className="error">{errors.fecha_nacimiento}</p>}
        </div>
        
        {mensaje && <p className="mensaje">{mensaje}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
