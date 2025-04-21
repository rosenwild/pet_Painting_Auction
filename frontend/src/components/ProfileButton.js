import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileButton() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return <a href="/login">Login</a>;
  }

  return (
    <div className="profile-dropdown">
      <button onClick={() => navigate('/profile')}>
        {user.name} {user.last_name}
      </button>
      <div className="dropdown-content">
        <button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }}>Logout</button>
      </div>
    </div>
  );
}
