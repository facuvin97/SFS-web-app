import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useUser } from '../contexts/UserLogContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { AttachFile, Send } from '@mui/icons-material';
import '../styles/Chat.css';
import { useChatsContext } from '../contexts/ChatsContext';


const ChatComponent = () => {
  const socket = useWebSocket();
  const { userLog } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const [receiver, setReceiver] = useState(location.state?.receiver || null); // se llama receiver, pero es el "otro" usuario
  const navigate = useNavigate();
  const [currentChatUserId, setCurrentChatUserId] = useState(null);
  const messageContainerRef = useRef(null);
  const token = localStorage.getItem('userToken');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const usuario = userLog?.tipo === 'client' ? 'Paseador' : 'Cliente';
  const nombreUsuario = receiver?.nombre_usuario || 'Usuario desconocido';
  const { unreadChats, setUnreadChats, removeUnreadChat, usersChats, setUsersChats } = useChatsContext();


  useEffect(() => {
    // Limpiar el chat activo de unreadChats
    if (receiver && unreadChats.has(receiver.id)) {
      // Eliminar el ID del chat activo de unreadChats en ChatsContext
      removeUnreadChat(receiver.id);
    }
  }, [receiver, unreadChats]);
  


  // Función para hacer scroll hasta el final
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  // Función para emitir eventos de WebSocket
  const emitSocketEvent = (eventName, data) => {
    if (socket) socket.emit(eventName, data);
  };

  useEffect(() => {
    if (location.state?.receiver) {
      setReceiver({ ...location.state.receiver }); // Forzar una nueva referencia
    }
  }, [location.state?.receiver]);

  // Cargar mensajes desde la API al cargar el componente
  useEffect(() => {
    if (!userLog || !receiver) return;


    const cargarMensajes = async () => {
      try {
        const response = await fetch(`${baseUrl}/messages/${userLog.id}/${receiver.id}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        const data = await response.json();
        if (!response.ok) throw new Error('Error del servidor');
        setMessages(data.body);
      } catch (error) {
        console.error('Error al obtener los mensajes.', error);
      }
    };
    
    cargarMensajes();
  }, [receiver, navigate, userLog]);

  // Solicitar mensajes no leídos
  useEffect(() => {
    if (!socket || !receiver || !userLog) return;

    emitSocketEvent('getUnreadMessages', { receiverId: userLog.id, senderId: receiver.id });

    socket.on('unreadMessages', (unreadMessages) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...unreadMessages.filter((msg) => !prevMessages.some((m) => m.id === msg.id)),
      ]);
      unreadMessages.forEach((msg) => emitSocketEvent('messageRead', { messageId: msg.id }));


      if (unreadChats.length > 0) {
      // actualizo el estado unreadChats para quitar el chat con id = msg.senderId
      setUnreadChats((prevUnreadChats) => prevUnreadChats.filter((c) => c.id !== receiver.id));}
      
    });

    return () => socket.off('unreadMessages');
  }, [socket, receiver, userLog]);

  //nuevo useEffect para actualizar el estado de messages cuando recibe un mensaje
  useEffect(() => {
    if (!socket || !receiver || !userLog) return;
  
    const handleNewMessage = (newMessage) => {
  
      // guardo el mensaje en el estado, solo si es un mensaje entre los dos usuarios de este chat
      if ((newMessage.receiverId === userLog.id && newMessage.senderId === receiver.id) || 
          (newMessage.receiverId === receiver.id && newMessage.senderId === userLog.id)) {
        setMessages((prevMessages) => {
          return [...prevMessages, newMessage];
        });
      }      
      if (newMessage.receiverId === userLog.id && newMessage.senderId === receiver.id){
          emitSocketEvent('messageRead', { messageId: newMessage.id });
      }
    };
  
    socket.on('receiveMessage', handleNewMessage);
  
    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [socket, receiver, userLog]); // Agrega receiver como dependencia
  

  // Actualizar mensajes como leídos
  useEffect(() => {
    if (!socket || !receiver) return;
    socket.on('messageRead', ({ messageId, read }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, read } : msg))
      );

      // Actualizar el estado unreadChats para quitar el chat con id = msg.senderId
      setUnreadChats((prevUnreadChats) => {
        const newUnreadChats = new Set(prevUnreadChats); // Crea una copia del Set
        newUnreadChats.delete(receiver.id); // Elimina el id del receptor
        return newUnreadChats; // Retorna el nuevo Set
      });

    });
    return () => socket.off('messageRead');
  }, [socket, receiver]);

  // Desplazar scroll al final de los mensajes cuando cambian
  useEffect(scrollToBottom, [messages, receiver]);

  // Enviar un mensaje
  const sendMessage = () => {
    if (!userLog || !receiver) return;
    if (socket && message && userLog.id && receiver.id) {
      const newMessage = { senderId: userLog.id, receiverId: receiver.id, contenido: message };

      // cambio el orden del estado de usersChats, para que el chat con id receiver.id se muestre al principio
      setUsersChats((prevUsersChats) => {
        const updatedUserChats = [...prevUsersChats]; // Crear una copia de los chats existentes
        
        // Busco el chat con id receiver.id
        const chat = updatedUserChats.find((chat) => chat.id === receiver.id);

        // busco el index del chat
        const chatIndex = updatedUserChats.findIndex((chat) => chat.id === receiver.id);
        
        // Si el chat existe, muevo el chat a la posición 0 y lo añado al principio
        if (chatIndex > -1) {
          updatedUserChats.splice(chatIndex, 1); // Borra el chat
          updatedUserChats.unshift(chat); // Inserta el chat en la posición 0
        }

        return updatedUserChats;
      });

      emitSocketEvent('sendMessage', newMessage);
      setMessage('');
    }
  };

  const renderStatusIcon = (msg) => (
    msg.read ? <span className="status-icon"><h5>Leído✔✔</h5></span> :
    msg.sent ? <span className="status-icon-gray"><h6>Enviado✔</h6></span> :
    null
  );

  return (
    <div className="chat-container flex flex-col h-screen max-w-2xl mx-auto">
      <h2 className="chat-header">Chat</h2>
      <div className="chat-card">
        <h2>{usuario}: {nombreUsuario}</h2>
      </div>
      <Paper
        className="message-Container"
        ref={messageContainerRef}
        elevation={3}
        sx={{
          backgroundColor: '#cac5b3',
          borderRadius: 4, // Establece el color de fondo
          minHeight: '200px', // Establece un alto mínimo
          overflowY: 'auto', // Permitir desplazamiento vertical
        }}
      >
        {messages.map((msg, index) => (
          <li key={index} className={msg.senderId === userLog.id ? 'my-messages' : 'their-messages'}>
            <small className="message-username">{msg.senderId === userLog.id ? 'Tú' : `${nombreUsuario}`}</small>
            <p>{msg.contenido}</p>
            {msg.senderId === userLog.id && <div className="status-container">{renderStatusIcon(msg)}</div>}
          </li>
        ))}
      </Paper>

      <Box display="flex" mt={2} alignItems="center" className="input-container">
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje"
          variant="outlined"
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton component="label">
                  <AttachFile />
                  <input
                    type="file"
                    hidden
                    accept="image/*" // Solo acepta imágenes
                  />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={sendMessage}>
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </div>
  );
}

export default ChatComponent;
