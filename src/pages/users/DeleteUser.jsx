/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;  

function DeleteUser({onCancel}) {

  const [mensaje, setMensaje] = useState(null)
  const { userLog, setUserLog } = useUser();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  // Función para manejar cambios en los inputs del formulario
  const onDelete = async (onCancel) => {
    try {
      
      var response;
      if (userLog.tipo == 'client') {
        response = await fetch(`${baseUrl}/clients/${userLog.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } else {
        response = await fetch(`${baseUrl}/walkers/${userLog.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      }
      if (response.ok) {
        const responseData = await response.json()
        console.log('Cuenta eliminada correctamente');
        setMensaje(responseData.message)
        //Seteo en null el usuario logeado
        setUserLog(null);
        // Redirige al usuario a la página principal "/"
        alert('Cuenta eliminada correctamente')
        navigate('/')

      } else {
        console.error('Error al eliminar cuenta:', response.statusText);
        const responseData = await response.json()
        setMensaje(responseData.message)
        // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    onCancel(false);
  };



  return (
    <div>
      <p>Esta seguro de que desea eliminar su cuenta</p>
      <button onClick={onDelete}>Eliminar</button>
      <button onClick={handleCancel}>Cancelar</button>
      <br />
        {mensaje && <p>{mensaje}</p>}
      <br />
    </div>
  );
}

export default DeleteUser;
