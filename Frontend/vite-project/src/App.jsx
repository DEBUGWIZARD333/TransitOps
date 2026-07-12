<<<<<<< HEAD
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
=======
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <NotificationProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </NotificationProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
>>>>>>> 5048a444c9b4c049addaf180942fd715f02e0370
}

export default App;
