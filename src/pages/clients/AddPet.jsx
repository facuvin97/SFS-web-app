import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AccountForm.css';

function AddPet() {
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  
  // Estado para los datos del formulario y los errores
  const [petData, setPetData] = useState({
    name: '',
    breed: '',
    size: '',
    age: '',
    image: '',
    clientId: '' // Este campo debe ser el ID del cliente que está agregando la mascota
  });
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState(null);


  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData({
      ...petData,
      [name]: value
    });
    validateField(name, value);
  };

  // Función para validar cada campo individualmente
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'El nombre de la mascota es obligatorio';
        break;

      case 'breed':
        if (!value.trim()) error = 'La raza de la mascota es obligatoria';
        break;

      case 'size':
        if (!value.trim()) error = 'El tamaño de la mascota es obligatorio';
        break;

      case 'age':
        if (!value.trim()) error = 'La edad de la mascota es obligatoria';
        break;

      case 'clientId':
        if (!value.trim()) error = 'El ID del cliente es obligatorio';
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    let valid = true;
    Object.keys(petData).forEach((field) => {
      validateField(field, petData[field]);
      if (errors[field]) valid = false;
    });

    if (!valid) {
      console.log('Errores en el formulario');
      return;
    }

    try {
       
      const response = await fetch('http://localhost:3001/api/v1/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(petData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setMensaje(responseData.message);
        alert('Mascota creada correctamente');
        navigate('/');
      } else {
        const responseData = await response.json();
        console.error('Error al registrar mascota:', responseData);
        setMensaje(responseData.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="account-container">
      <h2>Agregar Mascota</h2>
      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Nombre de la mascota"
            value={petData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="breed"
            placeholder="Raza"
            value={petData.breed}
            onChange={handleInputChange}
          />
          {errors.breed && <p className="error">{errors.breed}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="size"
            placeholder="Tamaño"
            value={petData.size}
            onChange={handleInputChange}
          />
          {errors.size && <p className="error">{errors.size}</p>}
        </div>

        <div className="form-group">
          <input
            type="number"
            name="age"
            placeholder="Edad"
            value={petData.age}
            onChange={handleInputChange}
          />
          {errors.age && <p className="error">{errors.age}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="image"
            placeholder="URL de la imagen"
            value={petData.image}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="clientId"
            placeholder="ID del Cliente"
            value={petData.clientId}
            onChange={handleInputChange}
          />
          {errors.clientId && <p className="error">{errors.clientId}</p>}
        </div>

        {mensaje && <p className="mensaje">{mensaje}</p>}
        <button type="submit">Agregar Mascota</button>
      </form>
    </div>
  );
}

export default AddPet;
