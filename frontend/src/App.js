// Исправленный App.js
import React, { useEffect } from 'react'; // Добавлен импорт useEffect
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Create from './pages/Create';
import Login from './pages/Login';
import './styles/App.css';

function App() {
  // Перенесли useEffect внутрь компонента
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const exp = localStorage.getItem('token_exp');

      if (token && exp && exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('token_exp');
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
