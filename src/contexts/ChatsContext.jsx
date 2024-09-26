import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';
import { useWebSocket } from '../contexts/WebSocketContext';

const ChatsContext = createContext();

export const useChatsContext = () => useContext(ChatsContext);

export const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [unreadChats, setUnreadChats] = useState(0);
  const { userLog } = useUser();
  const socket = useWebSocket();
  
  useEffect(() => {
    if (userLog) {
      const fetchChats = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/v1/contacts/${userLog.id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setChats(data.body);
        } catch (error) {
          console.error('Error al obtener los clientes:', error);
        }
      };
      fetchChats();

      const fetchUnreadChats = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/v1/unread/${userLog.id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
  
          if (data.body.length > 0) {
            // Crea un conjunto para almacenar senderId únicos
            const uniqueSenderIds = new Set();
      
            // Recorre los mensajes y agrega los senderId al conjunto
            data.body.forEach(message => {
              uniqueSenderIds.add(message.senderId);
            });
      
            // La cantidad de senderId distintos es el tamaño del conjunto
            const distinctSenderCount = uniqueSenderIds.size;
      
            setUnreadChats(distinctSenderCount);
          }
        } catch (error) {
          console.error('Error al obtener los clientes:', error);
        }        
      }
      fetchUnreadChats();

    
    };


    
  }, [userLog]);

  const addChat = async (chat) => {
    // agrego el chat recibido al estado
    setChats((prevChats) => [...prevChats, chat]);
  }

  const handleNewMessage = async (newMessage) => {
    console.log('newMessage:', newMessage);
    // chequeo si el senderId que viene en el mensaje, ya existe en el estado
    const existingChat = chats.find((chat) => chat.id === newMessage.senderId);

    console.log('existingChat:', existingChat);

    // si no existe, busco el cliente con el senderId que me llega con el mensaje y lo agrego al estado
    if (!existingChat) {
      let response;
      let user;

      // hago un fetch para obtener el usuario que envia con el senderId
      response = await fetch(`http://localhost:3001/api/v1/clients/${newMessage.senderId}`);
      user = await response.json();
      if (!user.body) {
        response = await fetch(`http://localhost:3001/api/v1/walkers/${newMessage.senderId}`);
        user = await response.json();
      }
      console.log('client:', client);
      console.log('client.body:', client.body);
      // agrego el cliente al estado
      addChat(user.body);
    }//si existe el cliente genera marca de mensajes no leidos
}

  // cuando llega un nuevo mensaje, actualizo el estado
  useEffect(() => {
    if (!socket) return;
    socket.on('receiveMessage', handleNewMessage);
    return () => socket.off('receiveMessage', handleNewMessage);
  }, [socket]);


  return (
    <ChatsContext.Provider
      value={{  chats, addChat, unreadChats, setUnreadChats }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
