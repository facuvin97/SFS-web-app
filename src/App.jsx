import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import RegisterClient from './pages/clients/RegisterClient'
import ModifyClient from './pages/clients/ModifyClient'
import DeleteClient from './pages/clients/DeleteClient'
import { useState, useEffect } from 'react';
import RegisterWalker from './pages/walkers/RegisterWalker';
import ModifyWalker from './pages/walkers/ModifyWalker';
import DeleteWalker from './pages/walkers/DeleteWalker'
import UserDetails from './pages/clients/FindUser';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Container from  '@mui/material/Container';
import Contact from './pages/Contact'
import AccountInfo from './components/AccountInfo'
import LoginPage from './pages/LogIn';
import Register from './pages/Register';
import ModifyUser from './pages/ModifyUser';


function App() {
  const [userLog, setUserLog] = useState(null);

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
    <>
      <Container className='root-container'>
        <div className='App'>
          <header className='App-header'>
            <ResponsiveAppBar loggedInUser={userLog} onLogout={handleLogout} />
            <Routes>
              <Route path='/' element={<Contact />} />
              <Route path='/login' element={<LoginPage onLogin={handleLogin} />} />
              <Route path='/register/:typeUser' element={<Register />} />
              <Route path={`/client/${userLog?.id}`} element={<AccountInfo user={userLog} onLogin={handleLogin} />} />
              <Route path={`/modify-user/${userLog?.id}`} element={<ModifyUser userLog={userLog} />} />
              <Route path={`/delete-client/${userLog?.id}`} element={<DeleteClient userLog={userLog} />} />
              <Route path='/walker-register' element={<RegisterWalker />} />
              <Route path={`/delete-walker/${userLog?.id}`} element={<DeleteWalker userLog={userLog} />} />
              <Route path={`/find/${userLog?.id}`} element={<UserDetails userId={userLog?.id} />} />
              <Route path="*" element={<div>404</div> } />
            </Routes>
          </header>
        </div>
      </Container>
    </>
  );
}

export default App;
