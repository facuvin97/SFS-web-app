import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useUser } from '../contexts/UserLogContext'; // Importar el contexto del usuario logueado
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Chat.css';

const ChatComponent = () => {
  const socket = useWebSocket(); // Acceder a la conexión WebSocket
  const { userLog } = useUser(); // Acceder al usuario logueado
  const [message, setMessage] = useState(''); // Mensaje a enviar
  const [messages, setMessages] = useState([]); // Lista de mensajes recibidos
  const location = useLocation();
  const [receiverId, setReceiverId] = useState(location.state?.receiverId || null); // ID del usuario destinatario
  const navigate = useNavigate();
  const messageContainerRef = useRef(null); // Crear una referencia para el contenedor de mensajes

  // useEffect que se ejecuta cada vez que se recibe un mensaje
  useEffect(() => {
    try {
      //verificar si el socket está conectado
    if (!socket) throw new Error('Error de conexion del socket');
  
    //agregar un listener para el evento 'receiveMessage'
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    // Limpiar el evento cuando el componente se desmonte
    return () => {
      socket.off('receiveMessage');
    };
  } catch (error) {
    console.error('Error al conectar al socket:', error);
  }
  }, [socket]);
  

  // useEffect que se ejecuta solo la primera vez que cargue la página
  useEffect(() => {
    // si no hay receiverId, redirigir a la página de inicio
    if (!receiverId) {
      navigate('/');
    }
    // setear el receiverId en el estado
    setReceiverId(receiverId);

    // funcion asincrona para cargar los mensajes
    const cargarMensajes = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/messages/${userLog.id}/${receiverId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Error del servidor');
        }

        console.log('mensajes de la bdd: ', data);
        setMessages(data.body);
      } catch (error) {
        throw new Error('Error al obtener los mensajes.', error);
      }
    };

    // llamar a la funcion
    cargarMensajes();
  }, [receiverId, navigate, userLog.id]);

  // useEffect para desplazar el scroll al final del contenedor de mensajes
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]); // Se ejecuta cada vez que 'messages' cambia

  // Función para enviar un mensaje al servidor
  const sendMessage = () => {
    if (socket && message && userLog && receiverId) {
      const newMessage = {
        senderId: userLog.id, // El usuario logueado es el remitente
        receiverId: receiverId, // El usuario destinatario
        contenido: message, // El contenido del mensaje
      };
  
      // Emitir el evento 'sendMessage' al servidor
      socket.emit('sendMessage', newMessage);

      setMessage(''); // Limpiar el campo de mensaje después de enviarlo
    }
  };
  
  console.log('messages: ', messages);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="mb-4">Usuario actual: {userLog ? userLog.nombre_usuario : 'No autenticado'}</div>
      <div className="message-Container" ref={messageContainerRef}>
        {messages.map((msg, index) => (
          <li key={index} className={msg.senderId === userLog.id ? 'my-messages' : 'their-messages'}>
            <small className="message-username">{msg.senderId === userLog.id ? 'Tú' : `Usuario ${msg.senderId}`}</small>
            <p>{msg.contenido}</p>
          </li>
        ))}
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje"
          className="flex-grow p-2 border rounded-l"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
