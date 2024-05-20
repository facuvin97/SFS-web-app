/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteUser({ userLog, onLogin }) {

  const [mensaje, setMensaje] = useState(null)

  const navigate = useNavigate();

  // Función para manejar cambios en los inputs del formulario
  const onDelete = async () => {
    try {
      var response;
      if (userLog.tipo == 'client') {
        response = await fetch(`http://localhost:3001/api/v1/clients/${userLog.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });
      } else {
        response = await fetch(`http://localhost:3001/api/v1/walkers/${userLog.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      }
      if (response.ok) {
        const responseData = await response.json()
        console.log('Cuenta eliminada correctamente');
        setMensaje(responseData.message)
        //Seteo en null el usuario logeado
        onLogin(null);
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

  const onCancel = () => {
    console.log("Cancelar eliminar")
  }


  return (
    <div>
      <p>Esta seguro de que desea eliminar su cuenta</p>
      <button onClick={onDelete}>Eliminar</button>
      <button onClick={onCancel}>Cancelar</button>
      <br />
        {mensaje && <p>{mensaje}</p>}
      <br />
    </div>
  );
}

export default DeleteUser;
