import React from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useUserImageContext } from '../contexts/UserImageContext'

function ImageProfile ({ username }){
  const { imageSrc} = useUserImageContext();
  
  return (
    <Avatar alt="avatar" src={imageSrc || '/no_image.png'} />    
  )
}

export default ImageProfile
