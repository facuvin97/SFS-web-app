import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { useUser } from '../contexts/UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { userLog, setUserLog } = useUser();
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda el usuario logueado en el contexto
        setUserLog(data.logedUser);
        localStorage.setItem('userData', JSON.stringify(data.logedUser));

        // Guarda el token en localStorage
        localStorage.setItem('userToken', data.token);
        
        // Redirige al usuario a la página principal
        navigate('/');
      } else {
        // Muestra el mensaje de error si el inicio de sesión falla
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
