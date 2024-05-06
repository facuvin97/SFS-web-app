import React from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import useUserImage from '../hook/UseUserImage'

function ImageProfile ({ username }){
  const imageSrc = useUserImage(username)
  
  return (
    <Avatar alt="avatar" src={imageSrc || '/no_image.png'} />    
  )
}

export default ImageProfile
