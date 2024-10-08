import React, { createContext, useState, useContext, useEffect, useCallback  } from 'react';
import { useUser } from './UserLogContext';
import { useWebSocket } from '../contexts/WebSocketContext';

const ChatsContext = createContext();

export const useChatsContext = () => useContext(ChatsContext);

export const ChatsProvider = ({ children }) => {
  const [usersChats, setUsersChats] = useState([]); // Estado para almacenar los chats del usuario
  const [unreadChats, setUnreadChats] = useState(new Set()); // Estado para almacenar los id de los usuarios con los que se tiene mensajes no leidos
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
     // console.log('data.body', data.body);
      //console.log('usersChats despues de body', usersChats);
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
    console.log('useEffect para actualizar el count en el context: ', unreadChats.size);
    console.log('unreadChats en el useEffect de la cuenta: ', unreadChats);
    setUnreadChatsCount(unreadChats.size);
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

  const addUnreadChat = (userId) => {
    setUnreadChats((prevChats) => {
      const newChats = new Set(prevChats); // Crea un nuevo Set basado en el anterior
      newChats.add(userId); // Agrega el nuevo userId
      return newChats; // Retorna el nuevo Set
    });
  };


//   const handleNewMessage = async (newMessage) => {

//     // ACA CUANDO HACE EL FIND USERScHATS ESTA VACIO, CHEQUEAR ESO
//     // chequeo si el senderId que viene en el mensaje, ya existe en el estado
//     console.log('usersChats al inicio del handlenewmessage: ', usersChats)
//     const existingChat = usersChats.find((chat) => {
//         // console.log('chat.id:', chat.id);
//         // console.log('newMessage.senderId:', newMessage.senderId);
//         return chat.id === newMessage.senderId.toString();
//     });



//     const existingUnreadChat = unreadChats.find((chat) => {
//         // console.log('chat:', chat);
//         // console.log('newMessage.senderId:', newMessage.senderId);
//         return chat === newMessage.senderId.toString();
//     });

//     console.log('existingUnreadChat:', existingUnreadChat);
//     console.log('existingChat:', existingChat);
//     // console.log('newMessage:', newMessage);

//     // si no existe el chat, busco el cliente con el senderId que me llega con el mensaje y lo agrego al estado
//     if (!existingChat) {
//       console.log('entrando al if !existingChat');
//       let response;
//       let user;

//       // hago un fetch para obtener el usuario que envia con el senderId
//       response = await fetch(`http://localhost:3001/api/v1/clients/body/${newMessage.senderId}`);
//       user = await response.json();
//       //console.log('user si es cliente: ', user);
//       if (!user.body) {
//         response = await fetch(`http://localhost:3001/api/v1/walkers/${newMessage.senderId}`);
//         user = await response.json();
//         //console.log('user si es paseador: ', user);
//       }
//       // agrego el usuario a los estados
//       addChat(user.body);
//       addUnreadChat(user.body.id);
//     } else if (existingChat && !existingUnreadChat) { // si existe el chat, pero no está en el estado de unreadChats, lo agrego
//       addUnreadChat(newMessage.senderId);
//     }
// }

useEffect(() => {
  // Definimos `handleNewMessage` dentro del useEffect para que siempre acceda a los valores más recientes de usersChats y unreadChats
  const handleNewMessage = async (newMessage) => {
    if (newMessage.senderId === userLog.id) return; // No se procesa el mensaje de mi mismo

    console.log('usersChats al inicio del handleNewMessage:', usersChats);
    
    // chequeo si el senderId que viene en el mensaje, ya existe en el estado
    const existingChat = usersChats.find((chat) => {
      console.log('chat.id:', chat.id);
      console.log('newMessage.senderId:', newMessage.senderId);
      return chat.id === newMessage.senderId;
    });

    let existingUnreadChat;

    if (unreadChats.size > 0) {
      // chequeo si el senderId ya está en el estado de unreadChats
       existingUnreadChat = unreadChats.has(newMessage.senderId);
    }


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
      console.log('user si es cliente:', user);
      
      // si no es cliente, busco si es paseador
      if (!user.body) {
        response = await fetch(`http://localhost:3001/api/v1/walkers/${newMessage.senderId}`);
        user = await response.json();
        console.log('user si es paseador:', user);
      }
      

      // agrego el usuario a los estados
      addChat(user.body);
      addUnreadChat(user.body.id);
    } else if (existingChat && !existingUnreadChat) { // si existe el chat, pero no está en el estado de unreadChats, lo agrego
      console.log('Agregando a unreadChats el senderId:', newMessage.senderId);
      addUnreadChat(newMessage.senderId);
    }
  };

  // Vinculamos el evento del socket dentro del useEffect
  if (!socket) return;
  socket.on('receiveMessage', handleNewMessage);

  // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
  return () => socket.off('receiveMessage', handleNewMessage);

}, [socket, usersChats, unreadChats]); // Dependencias para que el useEffect se actualice con los valores más recientes



  return (
    <ChatsContext.Provider
      value={{  usersChats, addChat, unreadChats, setUnreadChats, unreadChatsCount, setUnreadChatsCount }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
