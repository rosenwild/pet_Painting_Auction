import React, { useState, useEffect } from 'react';
import PaintingItem from '../components/PaintingItem';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import '../styles/App.css';

function Home() {
  const [paintings, setPaintings] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const token = localStorage.getItem('token');

  const fetchPaintings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/paintings/');
      setPaintings(response.data);
    } catch (error) {
      console.error('Error fetching paintings:', error);
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    }
    fetchPaintings();
  }, [token, refreshTrigger]); // Добавляем refreshTrigger в зависимости

  const handleCloseModal = (shouldRefresh) => {
    setSelectedPainting(null);
    if (shouldRefresh) {
      setRefreshTrigger(prev => !prev); // Используем триггер для обновления
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Art Gallery</h1>
        {token && isAdmin && (
          <a href="/create" className="add-painting-btn">Add Painting</a>
        )}
      </header>

      <div className="gallery">
        {paintings.map(painting => (
          <div
            key={painting.id}
            className={`painting-card ${!painting.is_bid_active ? 'bid-closed' : ''}`}
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
              <p className="price">${painting.price.toLocaleString()}</p>
              {!painting.is_bid_active && (
                <div className="bid-closed-badge">BID CLOSED</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPainting && (
        <PaintingItem
          painting={selectedPainting}
          onClose={handleCloseModal}
          isAdmin={isAdmin}
          refreshList={() => setRefreshTrigger(prev => !prev)}
        />
      )}
    </div>
  );
}

export default Home;
