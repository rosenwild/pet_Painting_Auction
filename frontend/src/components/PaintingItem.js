import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../styles/PaintingItem.css';
import BidHistory from './BidHistory';

export default function PaintingItem({ painting = {}, onClose, isAdmin }) {
  // Устанавливаем значения по умолчанию для painting
  const {
    id = '',
    name = '',
    photo = '',
    author = '',
    price = 0,
    type = ''
  } = painting;

  const [bidAmount, setBidAmount] = useState(price + 1000);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  const handleBid = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('You need to login to place a bid');
          navigate('/login');
          return;
        }

        const response = await axios.post(
          `http://localhost:8000/bids/${id}`,
          { amount: bidAmount },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            validateStatus: (status) => status < 500 // Не выбрасывать ошибку для 4xx статусов
          }
        );

        if (response.status === 401) {
          setMessage('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (response.status === 422) {
          // Обрабатываем ошибки валидации
          const errorMsg = response.data.detail?.[0]?.msg || 'Invalid bid amount';
          setMessage(`Error: ${errorMsg}`);
          return;
        }

        if (response.status !== 200) {
          setMessage(response.data?.detail || 'Bid failed');
          return;
        }

        setMessage('Bid placed successfully!');
        setTimeout(() => onClose(true), 1000);
      } catch (error) {
        console.error('Bid error:', error);
        setMessage('Network error. Please try again.');
      }
    };


  const handleClose = () => {
    onClose(false);
  };

  // Рендерим компонент только если есть минимально необходимые данные
  if (!id) {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleClose}>&times;</span>
          <p>Error: Painting data not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <img
          src={photo}
          alt={name}
          className="painting-image"
        />
        <div className="painting-details">
          <h2>{name}</h2>
          <p><strong>Artist:</strong> {author}</p>
          <p><strong>Current Price:</strong> ${price}</p>
          <p><strong>Type:</strong> {type}</p>

          {isAuthenticated ? (
            <div className="bid-section">
              <div className="bid-input-group">
                <label htmlFor="bidAmount">Your bid:</label>
                <input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={price + 1000}
                  step="1000"
                />
              </div>
              <button
                onClick={handleBid}
                className="bid-button"
              >
                Place Bid (+1000)
              </button>
              {message && (
                <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message}
                </p>
              )}
            </div>
          ) : (
            <div className="login-prompt">
              <p>Please login to place a bid</p>
              <a href="/login" className="login-link">Login</a>
            </div>
          )}
        <BidHistory paintingId={painting.id} />
        </div>
      </div>
    </div>
  );
}
