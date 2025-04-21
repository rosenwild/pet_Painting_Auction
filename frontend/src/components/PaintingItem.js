import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../styles/PaintingItem.css';
import BidHistory from './BidHistory';

export default function PaintingItem({ painting, onClose, isAdmin, refreshList }) {
  const {
    id,
    name,
    photo,
    author,
    price,
    type,
    is_bid_active: initialBidStatus = true
  } = painting || {};

  const [bidAmount, setBidAmount] = useState(price ? price + 1000 : 1000);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bidStatus, setBidStatus] = useState(initialBidStatus);
  const navigate = useNavigate();

  // Инициализация и проверка аутентификации
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(decoded.exp * 1000 > Date.now());
      } catch {
        setIsAuthenticated(false);
      }
    }

    // Синхронизация с актуальным статусом из пропсов
    setBidStatus(initialBidStatus);
  }, [initialBidStatus]);

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
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this painting?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/paintings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      refreshList();
      onClose(false);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Delete failed. Check admin permissions.');
    }
  };

  const toggleBidStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.patch(
        `http://localhost:8000/paintings/${id}/toggle-bid`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setBidStatus(data.is_bid_active);
      refreshList(); // Полностью обновляем данные
      setMessage(`Bidding ${data.is_bid_active ? 'reopened' : 'closed'} successfully`);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to update bid status');
    }
  };

  if (!painting) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => onClose(false)}>&times;</span>
        <img src={photo} alt={name} className="painting-image" />
        <div className="painting-details">
          <h2>{name}</h2>
          {!bidStatus && <div className="bid-closed-label">BID CLOSED</div>}
          <p><strong>Artist:</strong> {author}</p>
          <p><strong>Current Price:</strong> ${price?.toLocaleString()}</p>
          <p><strong>Type:</strong> {type}</p>

          {bidStatus && isAuthenticated && (
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
              <button onClick={handleBid} className="bid-button">
                Place Bid (+1000)
              </button>
            </div>
          )}

          {!isAuthenticated && bidStatus && (
            <div className="login-prompt">
              <p>Please login to place a bid</p>
              <button onClick={() => navigate('/login')}>Login</button>
            </div>
          )}

          {isAdmin && (
            <div className="admin-actions">
              <button
                onClick={toggleBidStatus}
                className={bidStatus ? 'close-bid-btn' : 'open-bid-btn'}
              >
                {bidStatus ? 'Close Bid' : 'Re-Open Bid'}
              </button>
              <button onClick={handleDelete} className="delete-btn">
                Delete Painting
              </button>
            </div>
          )}

          {message && (
            <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}

          <BidHistory paintingId={id} />
        </div>
      </div>
    </div>
  );
}
