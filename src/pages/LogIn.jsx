import React, { useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { useUser } from '../contexts/UserLogContext';
import { useEffect } from 'react';


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { userLog, setUserLog } = useUser();

  const navigate = useNavigate();

 

  useEffect(() => {
    if (userLog) {
      navigate('/');
    } 
  }, []);


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
        // props.onLogin(data.logedUser);

        //si el inicio de sesion es exitoso, guardo el usuario loggeado en el contexto
        setUserLog(data.logedUser)
        localStorage.setItem('userData', JSON.stringify(data.logedUser))
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
      <div className="account-container">
        <h2>Iniciar Sesión</h2>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button className="login-button" onClick={handleLogin}>
            Iniciar Sesión
          </button>
        </div>
      </div>
  );
}

export default LoginPage;
