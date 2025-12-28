import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext.jsx';
import { RBACProvider } from './context/RBACContext.jsx';
import theme from './theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RBACProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </RBACProvider>
    </AuthProvider>
  </StrictMode>,
)
