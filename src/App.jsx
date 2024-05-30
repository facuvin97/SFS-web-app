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
import SelectedTurnCard from './pages/turns/SelectedTurnCard';
import TurnsList from './pages/turns/TurnsList';
import AddTurnForm from './pages/turns/AddTurn';

import { ThemeProvider } from '@mui/material/styles';
import { theme, globalStyles } from './theme';
import { Box } from '@mui/material';
import ModifyTurn from './pages/turns/ModifyTurn';
import AddServiceForm from './pages/services/AddService';
import ServicesList from './pages/services/ServicesClientList';
import WalkersList from './pages/walkers/WalkerList';
import WalkerDetails from './pages/walkers/WalkerDetails';
import WalkerServiceRequest from './pages/services/WalkerServicesRequests'

function App() {
  const [userLog, setUserLog] = useState(null);

  const [selectedTurn, setSelectedTurn] = useState(null); 

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
      <Box sx={{ minHeight: '100vh', minWidth: '100vh' , paddingTop: '64px'}}>
        <Container className='root-container'>
          <div className='App'>
            <UserImageContextProvider>
              <header className='App-header'>
                <ResponsiveAppBar loggedInUser={userLog} onLogout={handleLogout} />
                <Routes>
                  <Route path='/' element={userLog ? (userLog.tipo === 'walker' ? <TurnsList walkerId={userLog?.id} /> : <WalkersList clientId={userLog?.id} />) : <Contact />} /> {/* modificar service usuario */}
                  <Route path='/login' element={<LoginPage onLogin={handleLogin} />} />
                  <Route path='/register/:typeUser' element={<Register />} />
                  <Route path={`/user/${userLog?.id}`} element={<AccountInfo user={userLog} onLogin={handleLogin} />} />
                  <Route path={`/modify-user/${userLog?.id}`} element={<ModifyUser userLog={userLog} />} />
                  <Route path={`/image/single/${userLog?.id}`} element={<ProfileImageUploader userLog={userLog} onImageUpload={() => useUserImage(userLog.nombre_usuario)}/>}/>
                  <Route path={`/walker-details/`} element={<WalkerDetails />}/>
                  <Route path={`/find/${userLog?.id}`} element={<UserDetails userId={userLog?.id} />} />
                  <Route path={`/turns`} element={<TurnsList walkerId={userLog?.id} />} />
                  <Route path='/turn-details' element={<SelectedTurnCard />} />                  
                  <Route path='/turn-modify' element={<ModifyTurn />} />                 
                  <Route path={`/walker-service-request/${userLog?.id}`} element={<WalkerServiceRequest walkerId={userLog?.id} />} />                 
                  <Route path={`/agregar-turno`} element={<AddTurnForm userLog={userLog} />} />
                  <Route path={`/services`} element={<ServicesList walkerId={userLog?.id} />} />

                  {/* <Route path={'/service-details'} element={<SelectedServiceCard />} />                  
                  <Route path='/service-modify' element={<ModifyService />} />  */} 
                  <Route path={`/add-service`} element={<AddServiceForm userLog={userLog}/>}/>
                  <Route path="*" element={<div>404</div> } />
                </Routes>
              </header>
            </UserImageContextProvider>
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
