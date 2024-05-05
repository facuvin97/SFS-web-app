import React from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import useUserImage from '../hook/UseUserImage'

const ImageProfile = ({ username }) => {
  const imageSrc = useUserImage(username)
  

  return (
    <Tooltip title="Perfil de usuario">
      <IconButton sx={{ p: 0 }}>
        <Avatar alt="avatar" src={imageSrc || '/public/no_image.png'} />
      </IconButton>
    </Tooltip>
  )
}

export default ImageProfile
