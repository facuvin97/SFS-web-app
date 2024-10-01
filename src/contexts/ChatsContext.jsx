import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserLogContext';
import { useWebSocket } from '../contexts/WebSocketContext';

const ChatsContext = createContext();

export const useChatsContext = () => useContext(ChatsContext);

export const ChatsProvider = ({ children }) => {
  const [usersChats, setUsersChats] = useState([]); // Estado para almacenar los chats del usuario
  const [unreadChats, setUnreadChats] = useState([]); // Estado para almacenar los id de los usuarios con los que se tiene mensajes no leidos
  const [unreadChatsCount, setUnreadChatsCount] = useState(0); // Estado para almacenar el número de chats con mensajes no leídos
  const { userLog } = useUser();
  const socket = useWebSocket();

  const fetchUsersChats = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/contacts/${userLog.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsersChats(data.body);
      console.log('data.body', data.body);
      console.log('usersChats despues de body', usersChats);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

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
  
        setUnreadChats(uniqueSenderIds);
      }
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }        
  }

  //useEffect que actualiza el contador cada vez que cambia el estado de unreadChats
  useEffect(() => {
    setUnreadChatsCount(unreadChats.length);
  }, [unreadChats]);
  
  // useEffect que carga los estados de los chats del usuario logueado
  useEffect(() => {
    if (userLog) {
      fetchUsersChats(); 
      fetchUnreadChats();
    } else { // si no hay usuario logueado, limpia el estado de chats
      setUsersChats([]);
      setUnreadChats([]);
      setUnreadChatsCount(0);
    }
  }, [userLog]);

  const addChat = async (userChat) => {
    // agrego el chat recibido al estado
    setUsersChats((prevChats) => [...prevChats, userChat]);
  }

  const addUnreadChat = async (userId) => {
    // agrego el id recibido al estado
    setUnreadChats((prevChats) => [...prevChats, userId]);
  }


  const handleNewMessage = async (newMessage) => {

    // ACA CUANDO HACE EL FIND USERScHATS ESTA VACIO, CHEQUEAR ESO
    // chequeo si el senderId que viene en el mensaje, ya existe en el estado
    console.log('usersChats safadfew: ', usersChats)
    const existingChat = usersChats.find((chat) => {
        console.log('chat.id:', chat.id);
        console.log('newMessage.senderId:', newMessage.senderId);
        return chat.id === newMessage.senderId.toString();
    });

    const existingUnreadChat = unreadChats.find((chat) => {
        console.log('chat:', chat);
        console.log('newMessage.senderId:', newMessage.senderId);
        return chat === newMessage.senderId.toString();
    });

    // console.log('existingUnreadChat:', existingUnreadChat);
    // console.log('existingChat:', existingChat);
    // console.log('newMessage:', newMessage);

    // si no existe el chat, busco el cliente con el senderId que me llega con el mensaje y lo agrego al estado
    if (!existingChat) {
      console.log('entrando al if !existingChat');
      let response;
      let user;

      // hago un fetch para obtener el usuario que envia con el senderId
      response = await fetch(`http://localhost:3001/api/v1/clients/body/${newMessage.senderId}`);
      user = await response.json();
      console.log('user si es cliente: ', user);
      if (!user.body) {
        response = await fetch(`http://localhost:3001/api/v1/walkers/${newMessage.senderId}`);
        user = await response.json();
        console.log('user si es paseador: ', user);
      }
      // agrego el usuario a los estados
      addChat(user.body);
      addUnreadChat(user.body.id);
    } else if (existingChat && !existingUnreadChat) { // si existe el chat, pero no está en el estado de unreadChats, lo agrego
      addUnreadChat(newMessage.senderId);
    }
}

  // cuando llega un nuevo mensaje, actualizo el estado
  useEffect(() => {
    if (!socket) return;
    socket.on('receiveMessage', handleNewMessage);
    return () => socket.off('receiveMessage', handleNewMessage);
  }, [socket]);


  return (
    <ChatsContext.Provider
      value={{  usersChats, addChat, unreadChats, setUnreadChats, unreadChatsCount, setUnreadChatsCount }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
