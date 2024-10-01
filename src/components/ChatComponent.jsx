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
  const messageContainerRef = useRef(null);
  let usuario = userLog.tipo === 'client' ? 'Paseador' : 'Cliente';
  const nombreUsuario = receiver?.nombre_usuario || 'Usuario desconocido';
  const receiverFromState = location.state?.receiver;
  const { unreadChats, setUnreadChats } = useChatsContext();


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

  // Si el receiver viene en el estado, lo establezco y redibujo
  useEffect(() => {
    if (receiverFromState) setReceiver(receiverFromState);
  }, [receiverFromState]);

  // Cargar mensajes desde la API al cargar el componente
  useEffect(() => {
    if (!receiver) navigate('/');
    const cargarMensajes = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/messages/${userLog.id}/${receiver.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error('Error del servidor');
        setMessages(data.body);
      } catch (error) {
        console.error('Error al obtener los mensajes.', error);
      }
    };
    cargarMensajes();
  }, [receiver, navigate, userLog.id]);

  // Solicitar mensajes no leídos
  useEffect(() => {
    if (!socket || !receiver) return;

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
  }, [socket, receiver, userLog.id]);

  // Manejo de recepción de mensajes
  const handleNewMessage = (newMessage) => {
    
    console.log('newMessage:', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    if (newMessage.receiverId === userLog.id ) {
      console.log('receiverId', receiver.id);
      emitSocketEvent('messageRead', { messageId: newMessage.id });
     
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('receiveMessage', handleNewMessage);
    return () => socket.off('receiveMessage', handleNewMessage);
  }, [socket]);

  // Actualizar mensajes como leídos
  useEffect(() => {
    if (!socket) return;
    socket.on('messageRead', ({ messageId, read }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, read } : msg))
      );
    });
    return () => socket.off('messageRead');
  }, [socket]);

  // Desplazar scroll al final de los mensajes cuando cambian
  useEffect(scrollToBottom, [messages]);

  // Enviar un mensaje
  const sendMessage = () => {
    if (socket && message && userLog?.id && receiver?.id) {
      const newMessage = { senderId: userLog.id, receiverId: receiver.id, contenido: message };
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
            <div className="status-container">{renderStatusIcon(msg)}</div>
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
