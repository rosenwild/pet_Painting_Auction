import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/App.css';

const API_BASE_URL = 'http://localhost:8000';

export default function BidHistory({ paintingId }) {
  const [bidHistory, setBidHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/bids/${paintingId}/history`
        );
        setBidHistory(data);
      } catch (err) {
        console.error('Error fetching bid history:', err);
        setError('Failed to load bid history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBidHistory();
  }, [paintingId]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-message">Loading history...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (bidHistory.length === 0) {
      return <div className="empty-message">No bids yet</div>;
    }

    return (
      <>
        <h3 className="bid-history-title">Bid History:</h3>
        <ul className="bid-history-list">
          {bidHistory.map((bid) => (
            <BidItem key={`${bid.user_id}-${bid.created_at}`} bid={bid} />
          ))}
        </ul>
      </>
    );
  };

  return <div className="bid-history-container">{renderContent()}</div>;
}

function BidItem({ bid }) {
  return (
    <li className="bid-item">
      <span className="bid-user">{bid.user_name}</span>
      <span className="bid-amount">${bid.amount.toLocaleString()}</span>
      <span className="bid-date">
        {new Date(bid.created_at).toLocaleString()}
      </span>
    </li>
  );
}

BidHistory.propTypes = {
  paintingId: PropTypes.string.isRequired,
};

BidItem.propTypes = {
  bid: PropTypes.shape({
    user_id: PropTypes.string,
    user_name: PropTypes.string,
    amount: PropTypes.number,
    created_at: PropTypes.string,
  }).isRequired,
};
