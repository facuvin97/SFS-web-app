import React, { createContext, useState, useContext, useEffect, useCallback  } from 'react';
import { useUser } from './UserLogContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const ChatsContext = createContext();

export const useChatsContext = () => useContext(ChatsContext);

export const ChatsProvider = ({ children }) => {
  const [usersChats, setUsersChats] = useState([]); // Estado para almacenar los chats del usuario
  const [unreadChats, setUnreadChats] = useState(new Set()); // Estado para almacenar los id de los usuarios con los que se tiene mensajes no leidos
  const [unreadChatsCount, setUnreadChatsCount] = useState(0); // Estado para almacenar el número de chats con mensajes no leídos
  const { userLog } = useUser();
  const socket = useWebSocket();
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();
  

  const removeUnreadChat = (chatId) => {
    setUnreadChats((prevUnreadChats) => {
      const updatedUnreadChats = new Set(prevUnreadChats); // Crear una copia del Set
      updatedUnreadChats.delete(chatId); // Eliminar el ID del Set
      return updatedUnreadChats;
    });
    setUnreadChatsCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  };
  
  

  const fetchUsersChats = async () => {
    try {
      let response;
      if(!token) {
        throw new Error("Usuario no autorizado")
      }
      if (userLog.tipo === 'walker') {
         response = await fetch(`${baseUrl}/contacts/clients/${userLog.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
         response = await fetch(`${baseUrl}/contacts/walkers/${userLog.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      if (!response.ok) {
        throw new Error('Error al obtener la respuesta del servidor');
      }
      const data = await response.json();
      setUsersChats(data.body);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  const fetchUnreadChats = async () => {
    try {
      if(!token) {
        return navigate('/');
      }
      const response = await fetch(`${baseUrl}/unread/${userLog.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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
      setUnreadChats(new Set());
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

useEffect(() => {
  // Definimos `handleNewMessage` dentro del useEffect para que siempre acceda a los valores más recientes de usersChats y unreadChats
  const handleNewMessage = async (newMessage) => {
    if(!token) {
      return navigate('/');
    }
    if (newMessage.senderId === userLog.id) return; // No se procesa el mensaje de mi mismo

    // me traigo la info del mensaje nuevo desde la api para tener los datos completos
    const response = await fetch(`${baseUrl}/messages/single/${newMessage.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const fullMessage = data.body;
    

    // chequeo si el senderId que viene en el mensaje, ya existe en el estado
    const existingChat = usersChats.find((chat) => {
      return chat.id === newMessage.senderId;
    });

    let existingUnreadChat;

    if (unreadChats.size > 0) {
      // chequeo si el senderId ya está en el estado de unreadChats
       existingUnreadChat = unreadChats.has(newMessage.senderId);
    }

    // si no existe el chat, busco el cliente con el senderId que me llega con el mensaje y lo agrego al estado
    if (!existingChat) {
      let response;
      let user;

      // hago un fetch para obtener el usuario que envia con el senderId
      response = await fetch(`${baseUrl}/clients/body/${newMessage.senderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      user = await response.json();
      
      // si no es cliente, busco si es paseador
      if (!user.body) {
        response = await fetch(`${baseUrl}/walkers/${newMessage.senderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        user = await response.json();
      }      

      // agrego el usuario a los estados
      addChat(user.body);
      addUnreadChat(user.body.id);
      // si existe el chat, pero no está en el estado de unreadChats, lo agrego
    } else if (existingChat && !existingUnreadChat) { 
      // modifico el estado usersChats para asignarle el ultimo mensaje al chat en el atributo lastMessage
      setUsersChats((prevUsersChats) => {

        const updatedUsersChats = [...prevUsersChats]; // Crear una copia de los chats existentes
        const chatIndex = updatedUsersChats.findIndex((chat) => chat.id === newMessage.senderId);
        updatedUsersChats[chatIndex].lastMessage = fullMessage;
        return updatedUsersChats;
      });


      addUnreadChat(newMessage.senderId);
    }
  
    setUsersChats((prevUsersChats) => {
      const updatedChats = [...prevUsersChats]; // Crear una copia de los chats existentes
      const orderedChats = updatedChats.sort((b, a) => new Date(a.lastMessage?.createdAt) - new Date(b.lastMessage?.createdAt));
      return orderedChats; // Actualiza el estado con los chats ordenados
    });
  };

  // Vinculamos el evento del socket dentro del useEffect
  if (!socket) return;
  socket.on('receiveMessage', handleNewMessage);

  // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
  return () => socket.off('receiveMessage', handleNewMessage);

}, [socket, usersChats, unreadChats]); // Dependencias para que el useEffect se actualice con los valores más recientes



  return (
    <ChatsContext.Provider
      value={{ removeUnreadChat, usersChats, addChat, unreadChats, setUnreadChats, unreadChatsCount, setUnreadChatsCount, setUsersChats }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
