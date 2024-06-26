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
import { UserImageContextProvider } from './contexts/UserImageContext';
import SelectedTurnCard from './pages/turns/SelectedTurnCard';
import TurnsList from './pages/turns/TurnsList';
import AddTurnForm from './pages/turns/AddTurn';

import { ThemeProvider } from '@mui/material/styles';
import { theme, globalStyles } from './theme';
import { Box } from '@mui/material';
import ModifyTurn from './pages/turns/ModifyTurn';
import AddServiceForm from './pages/services/AddService';
import ServicesList from './pages/services/ServicesList';
import WalkersList from './pages/walkers/WalkerList';
import WalkerDetails from './pages/walkers/WalkerDetails';
import WalkerServiceRequest from './pages/services/WalkerServicesRequests'
import { UserProvider, useUser } from './contexts/UserLogContext';
import Notifications from './components/Notifications';
import ClientDetails from './pages/clients/ClientDetails';
import ClientsList from './pages/clients/ClientList';
import ServiceHistory from './pages/services/ServiceHistory';
import AddReviewForm from './pages/reviews/AddReview';
import WalkerProfile from './pages/walkers/WalkerProfile';


function App() {
  // const [userLog, setUserLog] = useState(null);
  const { userLog, setUserLog } = useUser();
  const [selectedTurn, setSelectedTurn] = useState(null); 


  //Verificar si hay datos de inicio de sesión en localStorage al cargar la aplicación
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUserLog(JSON.parse(userData));
    }
  }, []);

  
  const handleLogout = () => {
    // Limpiar el estado del usuario y los datos de sesión
    setUserLog(null);
    // setUserLog(null);
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
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/register/:typeUser' element={<Register />} />
                  <Route path={`/user/${userLog?.id}`} element={<AccountInfo user={userLog} />} />
                  <Route path={`/modify-user/${userLog?.id}`} element={<ModifyUser userLog={userLog} />} />
                  <Route path={`/image/single/${userLog?.id}`} element={<ProfileImageUploader userLog={userLog} />}/>
                  <Route path={`/walker-details/`} element={<WalkerDetails />}/>
                  <Route path={`/client-details/`} element={<ClientDetails />}/>
                  <Route path={'/client-list/'} element={< ClientsList/>} />
                  <Route path={`/find/${userLog?.id}`} element={<UserDetails userId={userLog?.id} />} />
                  <Route path={`/turns`} element={<TurnsList walkerId={userLog?.id} />} />
                  <Route path='/turn-details' element={<SelectedTurnCard />} />                  
                  <Route path='/turn-modify' element={<ModifyTurn />} />                 
                  <Route path={`/walker-service-request/${userLog?.id}`} element={<WalkerServiceRequest walkerId={userLog?.id} />} />                 
                  <Route path={`/agregar-turno`} element={<AddTurnForm userLog={userLog} />} />
                  <Route path={`/services`} element={<ServicesList />} />
                  <Route path={`/service-history`} element={<ServiceHistory />} />
                  <Route path={`/add-review/:receiverId`} element={<AddReviewForm />} />
                  <Route path={`/profile`} element={<WalkerProfile />} />
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
