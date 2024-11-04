import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Avatar, Grid, Box, Button, IconButton, Tooltip, Rating } from '@mui/material';
import { useWalkersImageContext } from '../../contexts/WalkersImageContext';
import { useUser } from '../../contexts/UserLogContext'; 
import EditIcon from '@mui/icons-material/Edit';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ChatIcon from '@mui/icons-material/Chat';
import { useUserImageContext } from '../../contexts/UserImageContext';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteUser from '../users/DeleteUser';

const WalkerProfile = () => {
  const { walkerId } = useParams();
  const navigate = useNavigate();
  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [turns, setTurns] = useState([]);
  const { walkerImages } = useWalkersImageContext();
  const { userLog } = useUser();
  const { imageSrc} = useUserImageContext();
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  useEffect(() => {
    const fetchWalker = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/walkers/${walkerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWalker(data.body);

        const turnsResponse = await fetch(`http://localhost:3001/api/v1/turns/walker/${walkerId}`);
        if (!turnsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const turnsData = await turnsResponse.json();
        setTurns(turnsData.body);

        if(data.body.fotos){
          const images = await Promise.all(data.body.fotos.map(async (foto) => {
            const imageResponse = await fetch(`http://localhost:3001/api/v1/image/walkers/${foto.url}`);
            
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              const objectURL = URL.createObjectURL(blob);
              return { imageSrc: objectURL };
            } else {
              console.error('Error al obtener la imagen del paseador:', imageResponse.statusText);
              return { imageSrc: null };
            }
          }));

          setImages(images);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalker();
  }, [walkerId]);

  const formatFechaNacimiento = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  };

  const handleAddService = (turn) => {
    navigate('/add-service', { state: { turn } });
  };

  const handleModifyClick = (event) => {
    event.stopPropagation();
    navigate(`/modify-user`);
  }

  const handleModifyPhotoClick = (event) =>{
    event.stopPropagation();
    navigate(`/image/single/${userLog.id}`);
  }
  
  const handleUploadPhoto = (event) => {
    event.stopPropagation();
    navigate('/upload-photo');
  }
  const handleMPAsociationClick = (event) => {
    event.stopPropagation();
    navigate('/payment-methods-config')
  }

  const handleDeleteUser = () => {
    setShowDeleteUser(true);
  };

  const handleEditTurnClick = (turn) => {
    navigate('/turn-modify', { state: { turn } });
  }

  const handleChatClick = (event) => {
    event.stopPropagation();
    navigate('/chat', { state: {receiver: walker.User } });
  }

  const onCancel = () => {
    setShowDeleteUser(false);
  };
  
   const getStarIcons = (calificacion) => {
    const fullStars = Math.floor(calificacion);
    const hasHalfStar = calificacion % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon key={`full-${index}`} />
        ))}
        {hasHalfStar && <StarIcon />}
        {[...Array(emptyStars)].map((_, index) => (
          <StarOutlineIcon key={`empty-${index}`} />
        ))}
      </>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!walker) return <p>No walker found</p>;

  //manejo de la imagen de perfils
  const walkerImage = walkerImages.find(img => img.nombre_usuario === walker.User.nombre_usuario);
  const imageUrl = walkerImage ? imageSrc : 'url_de_no_profile_image'; // URL de imagen por defecto

  return (
    <>
    {showDeleteUser && <DeleteUser onCancel={onCancel} />}
    <Card sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
      <CardContent>
        { userLog.id == walker.id &&  <Grid container spacing={2} alignItems="right">
          <Grid item sx={{ marginLeft: 'auto' }}>
            <Tooltip title='Editar Perfil'>
              <IconButton aria-label="editar" onClick={handleModifyClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            {userLog.tipo == 'walker' ? (
            <Tooltip title="Eliminar Usuario" arrow>
              <IconButton className="edit-icon" onClick={handleDeleteUser}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>): null}

          </Grid>
        </Grid>}
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt={walker.User.nombre_usuario} src={imageUrl} sx={{ width: 100, height: 100 }} />
          </Grid>
          {/* si el usuario logueado es el propietario del perfil, muestra el botón de editar la foto del perfil */}
          { userLog.id == walker.id && 
          <Grid item>
            <Typography align="center">
            <Tooltip title='Editar Foto Perfil'>
              <IconButton aria-label="editar" onClick={handleModifyPhotoClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            </Typography>
          </Grid>
          }
          {/* si el usuario logueado no es el propietario del perfil, muestra el botón de chatear */}
          { userLog.id != walker.id && 
            <Grid item>
              <Typography align="center">
              <Tooltip title='Chatear'>
                <IconButton aria-label="chatear" onClick={handleChatClick}>
                  <ChatIcon />
                </IconButton>
              </Tooltip>
              </Typography>
            </Grid>
          }
          <Grid item xs>
            <Typography variant="h5" component="div">
              {walker.User.nombre_usuario}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {walker.User.direccion}
            </Typography>
                {getStarIcons(walker.User.calificacion || 0)}
           </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="body1"><strong>Fecha de Nacimiento:</strong> {formatFechaNacimiento(walker.User.fecha_nacimiento)}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {walker.User.email}</Typography>
          <Typography variant="body1"><strong>Teléfono:</strong> {walker.User.telefono}</Typography>
        </Box>
        <Box mt={2}>
          {walker.fotos?.length > 0 && <Typography variant="h6">Fotos</Typography>}
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            { walker.fotos?.length > 0 && walker.fotos?.map((foto, index) => {
              const imageUrl = images[index] ? images[index].imageSrc : 'url_de_no_profile_image'; // URL de imagen por defecto
              return (
                <Grid item key={index}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={imageUrl}
                    alt={`Foto ${index + 1}`}
                  />
                </Grid>
              );
            })}
            { userLog.id == walker.id && 
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item sx={{ marginTop: 2, marginBottom: 4 }}>
                <Tooltip title='Asociar MercadoPago' arrow>
                <Button variant="contained" color="primary" onClick={handleMPAsociationClick}>
                  Metodos de Pago
                </Button>
                </Tooltip>
              </Grid>
              <Grid item sx={{ marginTop: 2, marginBottom: 4 }}>
                <Tooltip title='Subir Imagen' arrow>
                  <IconButton className="edit-icon" onClick={handleUploadPhoto}>
                    <InsertPhotoIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>}
          </Grid>
        </Box>
        {turns && turns.length > 0 ? (
          turns.map((turn, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body1" color="text.primary">
                <strong>Zona:</strong> {turn.zona}
              </Typography>
               <Typography variant="body1" color="text.primary">
                  <strong>Tarifa:</strong> {turn.tarifa}
                </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Días:</strong> {turn.dias.join(', ')}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Hora de inicio:</strong> {turn.hora_inicio}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Hora de fin:</strong> {turn.hora_fin}
              </Typography>
              { userLog.id == walker.id ? (
              <Button variant="contained" color="primary" onClick={() => handleEditTurnClick(turn)}>
                Modificar Turno
              </Button>) : (
              <Button variant="contained" color="primary" onClick={() => handleAddService(turn)}>
                Solicitar Servicio 
              </Button>)
              }
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No hay turnos disponibles.
          </Typography>
        )}
        
      </CardContent>
    </Card>
    </>
  );
};

export default WalkerProfile;
