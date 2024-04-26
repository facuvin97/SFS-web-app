/* eslint-disable react/prop-types */
import { useState } from 'react';

function ModifyClient({ userLog }) {

  const getUserBD = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/clients/${userLog.id}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener los datos del usuario');
      }
      const userData = await response.json();
      setUserData(userData.body.User);
      console.log(JSON.stringify(userData))
    } catch (error) {
      console.log(error)
    }
  };
  

  // Estado para almacenar los datos del formulario
  const [userData, setUserData] = useState(getUserBD);

  const [mensaje, setMensaje] = useState(null)

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  // Función para convertir los bytes en una URL de datos (data URL)
  const bytesToDataURL = (bytes) => {
    // Convertir el array de bytes a un objeto Uint8Array
    const uint8Array = new Uint8Array(bytes.data);
    // Crear una Blob a partir del Uint8Array
    const blob = new Blob([uint8Array], { type: userData.body.User.foto.type });
    // Crear una URL de datos a partir del Blob
    const dataURL = URL.createObjectURL(blob);
    return dataURL;
  };

  // Función para convertir el BLOB en una URL de datos (data URL)
  const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      console.log("Blob:", blob)
      reader.readAsDataURL(blob);
    });
  };

  // Función para mostrar la imagen en un elemento img
  const displayImage = async () => {
    try {
      console.log(JSON.stringify(userData))
      const fotoBlob = bytesToDataURL(userData.body.User.foto.data)
      const imageDataURL = await blobToDataURL(fotoBlob); // Convertir el BLOB en una URL de datos
      return imageDataURL;
    } catch (error) {
      console.error('Error al mostrar la imagen:', error);
    }
  };


  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a un servidor, almacenarlos en localStorage, etc.
    // console.log(JSON.stringify(userData))
    try {
      const response = await fetch(`http://localhost:3001/api/v1/clients/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const responseData = await response.json()
        console.log('Cliente modificado correctamente');
        setMensaje(responseData.message)
        // Aquí puedes redirigir a otra página, mostrar un mensaje de éxito, etc.
      } else {
        console.error('Error al modificar cliente:', response.statusText);
        // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // Reiniciar el estado del formulario
    setUserData(userLog);
  };

  return (
    <div>
      <h2>Modificar Usuario</h2>
      <div>
        <img src={displayImage()} alt="Imagen de usuario" />
    </div>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de Usuario:
          <input
            type="text"
            name="nombre_usuario"
            value={userData.nombre_usuario}
            onChange={handleInputChange}
          />
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
          Fecha de Nacimiento:
          <input
            type="date"
            name="fecha_nacimiento"
            value={userData.fecha_nacimiento}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {mensaje && <p>{mensaje}</p>}
        <br />
        <button type="submit">Modificar</button>
      </form>
    </div>
  );
}

export default ModifyClient;
