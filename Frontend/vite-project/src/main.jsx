<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
=======
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
>>>>>>> 5048a444c9b4c049addaf180942fd715f02e0370

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
