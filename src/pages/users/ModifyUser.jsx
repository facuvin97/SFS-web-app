/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserLogContext'; 

const baseUrl = import.meta.env.VITE_API_BASE_URL;


function ModifyUser() {
  const { userLog, setUserLog } = useUser();
  const [userData, setUserData] = useState(userLog);
  const [mensaje, setMensaje] = useState(null)
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

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

      let response;
      if (userLog.tipo == 'client') {
        response = await fetch(`${baseUrl}/clients/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });
      } else {
        response = await fetch(`${baseUrl}/walkers/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });
      }
      

      if (response.ok) {
        const responseData = await response.json()
        console.log('Cliente modificado correctamente');
        setMensaje(responseData.message)
        localStorage.setItem('userData', JSON.stringify(userData))
        setUserLog(userData)
        alert('Cuenta modificada correctamente')
        navigate(-1)
      } else {
        const responseData = await response.json();
        console.error('Error al modificar cliente:', responseData);
        setMensaje(responseData.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // Reiniciar el estado del formulario
    setUserData(userLog);
  };

  return (
    <div className="account-container">
      { userLog.tipo == 'client' ? (<h2>Modificar Cliente</h2>) : (<h2>Modificar Paseador</h2>) }
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de Usuario: &nbsp;
          <span>{userData.nombre_usuario}</span>
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            name="contraseña"
            value={userData.contraseña}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Dirección:
          <input
            type="text"
            name="direccion"
            value={userData.direccion}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Teléfono:
          <input
            type="tel"
            name="telefono"
            value={userData.telefono}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Fecha de Nacimiento: &nbsp;
          <span>{new Date(userData.fecha_nacimiento).toLocaleDateString()}</span>
        </label>
        <br />
        {mensaje && <p>{mensaje}</p>}
        <br />
        <button type="submit">Modificar</button>
      </form>
    </div>
  );
}

export default ModifyUser;
