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
import { NotificationsProvider } from './contexts/NotificationsContext.jsx';
import { ConfirmedServicesProvider } from './contexts/ServicesContext.jsx';
import { UnpaidBillsProvider } from './contexts/BillContext.jsx';
import { WalkerTurnsProvider } from './contexts/TurnContext.jsx';
import { WebSocketProvider } from './contexts/WebSocketContext.jsx';
import { ClientImageContextProvider } from './contexts/ClientImageContext.jsx';
import { ChatsProvider } from './contexts/ChatsContext.jsx';
import { WalkerLocationProvider } from './contexts/WalkerLocationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <WebSocketProvider>
       <WalkersImageContextProvider>
        <ClientImageContextProvider>
          <BrowserRouter>
            <CssBaseline />
            <ConfirmedServicesProvider>
              <WalkerTurnsProvider>
                <NotificationsProvider>
                  <UnpaidBillsProvider>
                      <ChatsProvider>
                        <WalkerLocationProvider>
                          <App/>
                        </WalkerLocationProvider>
                      </ChatsProvider>
                    </UnpaidBillsProvider>
                  </NotificationsProvider>
                </WalkerTurnsProvider>
              </ConfirmedServicesProvider>
            </BrowserRouter>
          </ClientImageContextProvider>
        </WalkersImageContextProvider>
      </WebSocketProvider>
    </UserProvider>
  </React.StrictMode>,
);
