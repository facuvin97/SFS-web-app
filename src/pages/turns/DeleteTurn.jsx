import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function DeleteTurn({ turnId }) {
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onDelete = async () => {
    try {
      if(!token){
        return navigate('/')

      }
      const response = await fetch(`${baseUrl}/turns/${turnId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Turno eliminado correctamente');
        setMensaje(responseData.message);
        // Redirige al usuario a la página de inicio de turnos
        alert('Turno eliminado correctamente');
        navigate('/turns');
      } else {
        console.error('Error al eliminar turno:', response.statusText);
        const responseData = await response.json();
        setMensaje(responseData.message);
        // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onCancel = () => {
    console.log("Cancelar eliminar turno");
  };

  return (
    <div>
      <p>¿Estás seguro de que deseas eliminar este turno?</p>
      <button onClick={onDelete}>Eliminar</button>
      <button onClick={onCancel}>Cancelar</button>
      <br />
      {mensaje && <p>{mensaje}</p>}
      <br />
    </div>
  );
}

export default DeleteTurn;
