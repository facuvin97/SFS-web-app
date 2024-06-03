import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { WalkersImageContextProvider } from './contexts/WalkersImageContext.jsx';
import { UserProvider, useUser } from './contexts/UserLogContext';
import { ServicesProvider } from './contexts/ServiceContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WalkersImageContextProvider>
      <BrowserRouter>
        <CssBaseline />
        <UserProvider>
        <ServicesProvider>
        <App />
        </ServicesProvider>
        </UserProvider>
      </BrowserRouter>
    </WalkersImageContextProvider>
  </React.StrictMode>,
);
