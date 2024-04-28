import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();


      if (response.ok) {
        // Si el inicio de sesión es exitoso, llama a la función onLogin
        // pasando el usuario obtenido del servicio de inicio de sesión
        props.onLogin(data.logedUser);
        console.log('Inicio de sesión exitoso:', data.logedUser);
        
        // Redirige al usuario a la página principal "/"
        navigate('/')
      } else {
        // Si hay un error en el inicio de sesión, muestra el mensaje de error
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <div>
        <label>Nombre de Usuario:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default LoginPage;
