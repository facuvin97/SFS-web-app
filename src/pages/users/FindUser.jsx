/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function UserDetails({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const response = await fetch(`${baseUrl}/clients/${userId}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        if (!response.ok) {
          throw new Error('No se pudo obtener los datos del usuario');
        }
        const userData = await response.json();
        setUserData(userData);
        setLoading(false);
        console.log(JSON.stringify(userData))
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <p>Cargando datos del usuario...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!userData) {
    return <p>No se encontraron datos para el usuario.</p>;
  }

  return (
    <div>
      <h2>Detalles del Usuario</h2>
      <p><strong>Nombre de Usuario:</strong> {userData.body.User.nombre_usuario}</p>
      <p><strong>Dirección:</strong> {userData.body.direccion}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Teléfono:</strong> {userData.telefono}</p>
    </div>
  );
}

export default UserDetails;
