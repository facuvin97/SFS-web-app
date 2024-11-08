import React, { useState, useEffect } from 'react';
import { IconButton, Badge,  Typography, Tooltip, Menu, MenuItem } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useUser } from '../contexts/UserLogContext';
import { useChatsContext } from '../contexts/ChatsContext';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const [anchorElChat, setAnchorElChat] = useState(null); // Para manejar el menú de chats
  const { usersChats, setUsersChats , unreadChats, setUnreadChats, unreadChatsCount} = useChatsContext();
  const navigate = useNavigate();
  const { userLog } = useUser();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    // Redibujo el componente cuando cambia alguno de los estados

  }, [usersChats, unreadChats, unreadChatsCount]);
 
  const handleClick = (event) => {
    setAnchorElChat(null);
    // busco en chats el chat con el id que me pasa
    const userChat = usersChats.find((userChat) =>  userChat.id.toString() === event.currentTarget.id);
    
    // Verificar si se encontró el chat
    if (userChat) {
      // Navegar a la página de chat
      navigate(`/chat`, { state: { receiver: userChat.User } });
    }
  };

    // Abre el menú de chats
    const handleOpenChatMenu = (event) => {
      setAnchorElChat(event.currentTarget);
    };
  
    // Cierra el menú de chats
    const handleCloseChatMenu = () => {
      setAnchorElChat(null);
    };



  return (
    <div className="Chat-container"> {/* Aplica la clase del contenedor */}
      <Tooltip title="Abrir Chats">
        <IconButton onClick={handleOpenChatMenu} sx={{ p: 0 }}>
          <Badge badgeContent={unreadChatsCount} color="error">
            <ChatIcon sx={{ color: 'white' }} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar-chats"
        anchorEl={anchorElChat}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElChat)}
        onClose={handleCloseChatMenu}
      >
        {usersChats.length > 0 ? (
          usersChats.map((userChat) => {
            const isUnread = unreadChats.has(userChat.User.id);
            return (
              <MenuItem
                key={userChat.User.id}
                id={userChat.User.id}
                onClick={handleClick}
                sx={{
                  backgroundColor: isUnread ? '#BBE7FB' : 'inherit', // Celeste claro si no leído
                  '&:hover': {
                    backgroundColor: isUnread ? '#BBDEFB' : 'rgba(0, 0, 0, 0.08)', // Hover distinto
                  },
                }}
              >
                <Typography textAlign="center">{userChat.User.nombre_usuario}</Typography>
              </MenuItem>
            );
          })
        ) : (
          <MenuItem>
            <Typography textAlign="center">No hay chats disponibles</Typography>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default ChatList;
