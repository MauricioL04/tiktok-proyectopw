// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ThemeProvider } from './context/ThemeContext'; // <-- Importa el proveedor

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider> {/* <-- Envuelve tu App aquí */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);