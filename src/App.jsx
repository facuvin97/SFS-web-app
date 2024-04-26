import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import RegisterClient from './pages/clients/RegisterClient'
import ModifyClient from './pages/clients/ModifyClient'
import DeleteClient from './pages/clients/DeleteClient'
import { useState } from 'react';
import RegisterWalker from './pages/walkers/RegisterWalker';
import ModifyWalker from './pages/walkers/ModifyWalker';
import DeleteWalker from './pages/walkers/DeleteWalker'
import UserDetails from './pages/clients/FindUser';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Container from  '@mui/material/Container';
import Contact from './pages/Contact'
import AccountInfo from './components/AccountInfo'


function App() {
  
  const [userLog, setUserLog] = useState({ 
    id: 19,
    foto: '../assets/no_image.png',
    nombre_usuario: 'paseador',
    contraseña: '123456789',
    direccion: 'direccion123',
    fecha_nacimiento: '1999-11-11',
    email: 'paseador@correo.com',
    telefono: '123456',
    calificacion: null
  })

  return (
    <>
    <Container className='root-container'>
      <div className='App'>
        <header className='App-header'>
          
          <ResponsiveAppBar loggedInUser={userLog} />
          <Routes>
            <Route path='/' element={<Contact></Contact>}></Route>
            <Route path="/register" element={<RegisterClient />} />
            <Route path={`/client/${userLog.id}`} element={<AccountInfo user={userLog} />} />
            <Route path={`/modify/${userLog.id}`} element={<ModifyClient userLog={userLog} />} />
            <Route path={`/delete/${userLog.id}`} element={<DeleteClient userLog={userLog} />} />
            <Route path="/walker-register" element={<RegisterWalker />} />
            <Route path={`/modify-walker/${userLog.id}`} element={<ModifyWalker userLog={userLog} />} />
            <Route path={`/delete-walker/${userLog.id}`} element={<DeleteWalker userLog={userLog} />} />
            <Route path={`/find/${userLog.id}`} element={<UserDetails userId={userLog.id} />} />
          </Routes>
          {/* <Router>
            <div>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/register">Registro (cliente)</Link>
                </li>
                <li>
                  <Link to={`/modify/${userLog.id}`}>Modificar Cliente</Link>
                </li>
                <li>
                  <Link to={`/delete/${userLog.id}`}>Eliminar Cliente</Link>
                </li>
                <li>
                  <Link to="/walker-register">Registro (paseador)</Link>
                </li>
                <li>
                  <Link to={`/modify-walker/${userLog.id}`}>Modificar Paseador</Link>
                </li>
                <li>
                  <Link to={`/delete-walker/${userLog.id}`}>Eliminar Paseador</Link>
                </li>
                <li>
                  <Link to={`/find/${userLog.id}`}>Buscar CLiente</Link>
                </li>
              </ul>
            </div>
            <Routes>
              <Route path="/register" element={<RegisterClient />} />
              <Route path={`/modify/${userLog.id}`} element={<ModifyClient userLog={userLog} />} />
              <Route path={`/delete/${userLog.id}`} element={<DeleteClient userLog={userLog} />} />
              <Route path="/walker-register" element={<RegisterWalker />} />
              <Route path={`/modify-walker/${userLog.id}`} element={<ModifyWalker userLog={userLog} />} />
              <Route path={`/delete-walker/${userLog.id}`} element={<DeleteWalker userLog={userLog} />} />
              <Route path={`/find/${userLog.id}`} element={<UserDetails userId={userLog.id} />} />
            </Routes>
          </Router> */}
        </header>
      </div>
      </Container>
    </>
  )
}

export default App
