import { useState, } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/AccountForm.css'

function Register() {
  const navigate = useNavigate();
  // Estado para almacenar los datos del formulario
  const [userData, setUserData] = useState({
    nombre_usuario: '',
    contraseña: '',
    direccion: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    calificacion: null
  });
  const [mensaje, setMensaje] = useState(null)
  let { typeUser } = useParams(); 
  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a un servidor, almacenarlos en localStorage, etc.
    // console.log(JSON.stringify(userData))
    try {
      var response;

      if (typeUser == 'client') {
        response = await fetch('http://localhost:3001/api/v1/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      } else {
        response = await fetch('http://localhost:3001/api/v1/walkers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      }
      
    

      if (response.ok) {
        const responseData = await response.json()
        console.log('Usuario registrado correctamente');
        setMensaje(responseData.message)
        alert('Cuenta creada correctamente')
        navigate('/')
      } else {
        console.error('Error al registrar cliente:', response.statusText);
        alert('Error al registrar cliente:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // Reiniciar el estado del formulario
    setUserData({
      foto: null,
      nombre_usuario: '',
      contraseña: '',
      direccion: '',
      fecha_nacimiento: '',
      email: '',
      telefono: '',
      calificacion: null
    });
  };
    

  return (
    <div className="account-container">
      <h2>{typeUser === 'client' ? 'Registro de Cliente' : 'Registro de Paseador'}</h2>
      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            name="nombre_usuario"
            value={userData.nombre_usuario}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="contraseña"
            value={userData.contraseña}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={userData.direccion}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={userData.telefono}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={userData.fecha_nacimiento}
            onChange={handleInputChange}
          />
        </div>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
