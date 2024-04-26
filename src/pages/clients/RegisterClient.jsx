import { useState } from 'react';

function RegisterClient() {
  // Estado para almacenar los datos del formulario
  const [userData, setUserData] = useState({
    foto: null,
    nombre_usuario: '',
    contraseña: '',
    direccion: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    calificacion: null
  });
  const [mensaje, setMensaje] = useState(null)

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      // Una vez que la lectura del archivo se completa, obtén el resultado como un ArrayBuffer
      const arrayBuffer = reader.result;
  
      // Ahora puedes hacer lo que necesites con el ArrayBuffer, como enviarlo al servidor
      //Guardarlo en el userData
      setUserData({
        ...userData,
        foto: arrayBuffer
      });

    };
  
    // Leer el archivo como ArrayBuffer
    reader.readAsArrayBuffer(file);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a un servidor, almacenarlos en localStorage, etc.
    // console.log(JSON.stringify(userData))
    try {
      const response = await fetch('http://localhost:3001/api/v1/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const responseData = await response.json()
        console.log('Cliente registrado correctamente');
        setMensaje(responseData.message)
        // Aquí puedes redirigir a otra página, mostrar un mensaje de éxito, etc.
      } else {
        console.error('Error al registrar cliente:', response.statusText);
        // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje de error al usuario
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
    <div>
      <h2>Registro de Usuario</h2>
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
        <label>
          Foto de Perfil:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <br />
        {mensaje && <p>{mensaje}</p>}
        <br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterClient;
