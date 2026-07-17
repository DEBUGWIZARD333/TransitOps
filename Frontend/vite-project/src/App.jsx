import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <NotificationProvider>
          <AuthProvider>
            <SettingsProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </SettingsProvider>
          </AuthProvider>
        </NotificationProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
