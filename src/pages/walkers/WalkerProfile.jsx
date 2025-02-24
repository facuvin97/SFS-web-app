import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Avatar, Grid, Box, Button, IconButton, Tooltip, Rating, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para controlar el modal

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  useEffect(() => {
    const fetchWalker = async () => {
      try {

        const response = await fetch(`${baseUrl}/walkers/${walkerId}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWalker(data.body);

        const turnsResponse = await fetch(`${baseUrl}/turns/walker/${walkerId}`, { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
      });
        if (!turnsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const turnsData = await turnsResponse.json();
        setTurns(turnsData.body);

        if(data.body.fotos){
          const images = await Promise.all(data.body.fotos.map(async (foto) => {
            const imageResponse = await fetch(`${baseUrl}/image/walkers/${foto.url}`, { 
              headers: { 
                'Authorization': `Bearer ${token}` 
              } 
          });
            
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

  const handleDeleteImageClick = (url) => {
    setSelectedImage(url); // Guarda la URL de la imagen a eliminar
    setIsDeleteDialogOpen(true); // Abre el modal
  };

  const handleConfirmDelete = async () => {
    try {
      console.log(`Eliminar imagen con URL: ${selectedImage}`);
    
    // Eliminar la imagen seleccionada llamada a la api
    const response = await fetch(`${baseUrl}/image/${userLog.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl: selectedImage }),
    });
    const data = await response.json();
    console.log('data', data);

    if (!response.ok) {
      throw new Error('Error al eliminar la imagen');
    }

    //actualizo al lista de fotos del walker
    const updatedWalker = walker;
    updatedWalker.fotos = updatedWalker.fotos.filter(foto => foto.url !== selectedImage);
    setWalker(updatedWalker);

    setIsDeleteDialogOpen(false); // Cierra el modal
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  };

  const handleCancelDelete = () => {
    setSelectedImage(null); // Limpia la imagen seleccionada
    setIsDeleteDialogOpen(false); // Cierra el modal
  };

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
  const imageUrl = walkerImage ? walkerImage.imageSrc : 'url_de_no_profile_image'; // URL de imagen por defecto
  

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
            <IconButton aria-label="ver reseñas" onClick={() => navigate(`/reviews/${walker.id}`)}>
              <Tooltip title='Ver Reseñas'>
              <VisibilityIcon />
              </Tooltip>
            </IconButton>
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
          {walker.fotos?.length > 0 &&
          walker.fotos.map((foto, index) => {
            const imageUrl = images[index] ? images[index].imageSrc : 'url_de_no_profile_image'; // URL de imagen por defecto
            return (
              <Grid item key={index}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={imageUrl}
                    alt={`Foto ${index + 1}`}
                    style={{ display: 'block' }}
                  />
                  {userLog.id == walker.id ? 
                  <div 
                    onClick={() => handleDeleteImageClick(foto.url)} // Abre el modal con la URL seleccionada
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%',
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <DeleteIcon style={{ color: 'white', fontSize: '15px' }} />
                  </div>: null}
                </div>
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

    {/* Modal para confirmar eliminación */}
    <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">¿Eliminar Foto?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro de que deseas eliminar esta foto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WalkerProfile;
