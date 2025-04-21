import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          cursor: 'pointer',
          padding: '8px 12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '4px'
        }}
        onClick={() => setShowLogout(!showLogout)}
      >
        {user?.name} {user?.last_name}
      </div>

      {showLogout && (
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '5px',
            padding: '5px 10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 100
          }}
        >
          Log Out
        </button>
      )}
    </div>
  );
}
