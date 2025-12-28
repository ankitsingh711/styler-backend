import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './context/AuthContext.jsx';
import { RBACProvider } from './context/RBACContext.jsx';
import { theme } from './mantineTheme';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
