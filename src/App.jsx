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
import LoginPage from './pages/LogIn';


function App() {
  
  const [userLog, setUserLog] = useState(null)

  const handleLogin = async (user) => {
    // Establece el usuario en el estado userLog
    setUserLog(user);
    console.log(userLog)
  };

  return (
    <>
    <Container className='root-container'>
      <div className='App'>
        <header className='App-header'>
          
          <ResponsiveAppBar loggedInUser={userLog} />
          <Routes>
            <Route path='/' element={<Contact />}></Route>
            <Route path='/login' element={<LoginPage onLogin={handleLogin} />}></Route>
            <Route path="/register" element={<RegisterClient />} />
            <Route path={`/client/${userLog?.id}`} element={<AccountInfo user={userLog} onLogin={handleLogin} />} />
            <Route path={`/modify-client/${userLog?.id}`} element={<ModifyClient userLog={userLog} />} />
            <Route path={`/delete-client/${userLog?.id}`} element={<DeleteClient userLog={userLog} />} />
            <Route path="/walker-register" element={<RegisterWalker />} />
            <Route path={`/modify-walker/${userLog?.id}`} element={<ModifyWalker userLog={userLog} />} />
            <Route path={`/delete-walker/${userLog?.id}`} element={<DeleteWalker userLog={userLog} />} />
            <Route path={`/find/${userLog?.id}`} element={<UserDetails userId={userLog?.id} />} />
          </Routes>
        </header>
      </div>
      </Container>
    </>
  )
}

export default App
