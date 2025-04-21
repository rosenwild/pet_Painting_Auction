import React, { useState, useEffect } from 'react';
import PaintingItem from '../components/PaintingItem';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import '../styles/App.css';
import ProfileButton from '../components/ProfileButton';

function Home() {
  const [paintings, setPaintings] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');

  // Выносим функцию получения картин в отдельную функцию
  const fetchPaintings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/paintings/');
      setPaintings(response.data);
    } catch (error) {
      console.error('Error fetching paintings:', error);
    }
  };

  useEffect(() => {
    // Проверка прав администратора
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    }

    // Загружаем картины
    fetchPaintings();
  }, [token]);

  const handleCloseModal = (shouldRefresh) => {
    setSelectedPainting(null);
    if (shouldRefresh) {
      fetchPaintings(); // Теперь функция определена
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Art Gallery</h1>
        {token && isAdmin && ( // Показываем только админам
          <a href="/create">Add Painting</a>
        )}
        {token ? (
          <ProfileButton />
        ) : (
          <a href="/login">Login</a>
        )}
      </header>

      <div className="gallery">
        {paintings.map(painting => (
          <div
            key={painting.id}
            className="painting-card"
            onClick={() => setSelectedPainting(painting)}
          >
            <img
              src={painting.photo}
              alt={painting.name}
              className="painting-image"
            />
            <div className="painting-info">
              <h3>{painting.name}</h3>
              <p>{painting.author}</p>
              <p className="price">${painting.price}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedPainting && (
        <PaintingItem
          painting={selectedPainting}
          onClose={handleCloseModal}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

export default Home;
