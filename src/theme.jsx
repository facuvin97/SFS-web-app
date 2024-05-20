import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import backgroundImage from './assets/fondo4.jpeg'; // Ajusta el camino según sea necesario


const theme = createTheme({
  palette: {
    primary: {
      main: '#647cff',
    },
    background: {
      default: '#03626c',
    },
  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      html: {
        height: '100%', // Asegura que el html ocupe toda la altura del viewport
        overflowY: 'scroll', // Fuerza la barra de desplazamiento
      },
      body: {
        background: `url(${backgroundImage}) center center / cover no-repeat fixed`,  // Combina todas las propiedades de fondo en una sola declaración
        backgroundColor: '#03626c',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'inherit',
      },
    }}
  />
);

export { theme, globalStyles };
