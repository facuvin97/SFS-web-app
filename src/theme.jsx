import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

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
      body: {
        backgroundImage: `url('/fondo4.jpeg')`,  // Asegúrate de que la imagen está en la carpeta public
        backgroundColor: '#03626c',
        backgroundSize: 'cover',
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
