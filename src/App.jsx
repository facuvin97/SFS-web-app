import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import { useState, useEffect } from 'react';
import UserDetails from './pages/users/FindUser';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Container from  '@mui/material/Container';
import Contact from './pages/Contact'
import AccountInfo from './components/AccountInfo'
import LoginPage from './pages/LogIn';
import Register from './pages/users/Register';
import ModifyUser from './pages/users/ModifyUser';
import ProfileImageUploader from './pages/ProfileImageUploader';
import useUserImage from './hook/UseUserImage';
import { UserImageContextProvider } from './contexts/UserImageContext';
import TurnCard from './components/TurnCard';
import AddTurnForm from './pages/turns/AddTurn';

import { ThemeProvider } from '@mui/material/styles';
import { theme, globalStyles } from './theme';

function App() {
  const [userLog, setUserLog] = useState(null);

  const turno = {
    "id": 1,
    "dias": ["lunes", "miércoles", "viernes"],
    "hora_inicio": "09:00:00",
    "hora_fin": "13:00:00",
    "tarifa": 250,
    "zona": "Pocitos",
    "createdAt": "2024-05-15T10:15:00",
    "updatedAt": "2024-05-15T10:15:00",
    "WalkerId": 1
  }

  // Verificar si hay datos de inicio de sesión en localStorage al cargar la aplicación
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUserLog(JSON.parse(userData));
    }
  }, []);

  const handleLogin = async (user) => {
    setUserLog(user);
    localStorage.setItem('userData', JSON.stringify(user));
  };
  const handleLogout = () => {
    // Limpiar el estado del usuario y los datos de sesión
    setUserLog(null);
    localStorage.removeItem('userData');
  };

  return (
    <ThemeProvider theme={theme}>
    {globalStyles}
      <Container className='root-container'>
        <div className='App'>
          <UserImageContextProvider>
            <header className='App-header'>
              <ResponsiveAppBar loggedInUser={userLog} onLogout={handleLogout} />
              <Routes>
                <Route path='/' element={<Contact />} />
                <Route path='/login' element={<LoginPage onLogin={handleLogin} />} />
                <Route path='/register/:typeUser' element={<Register />} />
                <Route path={`/user/${userLog?.id}`} element={<AccountInfo user={userLog} onLogin={handleLogin} />} />
                <Route path={`/modify-user/${userLog?.id}`} element={<ModifyUser userLog={userLog} />} />
                <Route path={`/image/single/${userLog?.id}`} element={<ProfileImageUploader userLog={userLog} onImageUpload={() => useUserImage(userLog.nombre_usuario)}/>}/>
                <Route path={`/find/${userLog?.id}`} element={<UserDetails userId={userLog?.id} />} />
                <Route path={`/card`} element={<TurnCard turn={turno} />} />
                <Route path={`/agregar-turno`} element={<AddTurnForm userLog={userLog} />} />
                <Route path="*" element={<div>404</div> } />
              </Routes>
            </header>
          </UserImageContextProvider>
        </div>
      </Container>
      </ThemeProvider>
  );
}

export default App;
