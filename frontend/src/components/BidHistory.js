// components/BidHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BidHistory({ paintingId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/bids/${paintingId}/history`
        );
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching bid history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBidHistory();
  }, [paintingId]);

  if (loading) return <div>Loading history...</div>;
  if (history.length === 0) return <div>No bids yet</div>;

  return (
    <div className="bid-history">
      <h3>Bid History:</h3>
      <ul>
        {history.map((bid, index) => (
          <li key={index} className="bid-item">
            <span className="bid-user">{bid.user_name}</span>
            <span className="bid-amount">${bid.amount.toLocaleString()}</span>
            <span className="bid-date">{bid.created_at}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
