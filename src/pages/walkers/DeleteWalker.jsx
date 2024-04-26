/* eslint-disable react/prop-types */
import { useState } from 'react';

function DeleteWalker({ userLog }) {
  // Estado para almacenar los datos del formulario
  const [userData, setUserData] = useState(userLog);

  const [mensaje, setMensaje] = useState(null)

  // Función para manejar cambios en los inputs del formulario
  const onDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/walkers/${userData.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const responseData = await response.json()
        console.log(responseData)
        console.log('Cuenta eliminada correctamente');
        setMensaje(responseData.message)
        // Aquí puedes redirigir a otra página, mostrar un mensaje de éxito, etc.
      } else {
        console.error('Error al eliminar cuenta:', response.statusText);
        // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje de error al usuario
        const responseData = await response.json()
        setMensaje(responseData.message)
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

export default DeleteWalker;
