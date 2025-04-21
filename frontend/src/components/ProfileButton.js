import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default function ProfileButton() {
  const navigate = useNavigate();
  const user = getUserData();

  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

  if (!user) {
    return <LoginLink />;
  }

  return (
    <div className="profile-dropdown">
      <ProfileButtonContent
        user={user}
        onProfileClick={() => navigate('/profile')}
        onLogoutClick={handleLogout}
      />
    </div>
  );
}

// хелперы
function getUserData() {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

function clearUserSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function LoginLink() {
  return (
    <a href="/login" className="login-link">
      Login
    </a>
  );
}

function ProfileButtonContent({ user, onProfileClick, onLogoutClick }) {
  return (
    <>
      <button
        onClick={onProfileClick}
        className="profile-button"
        aria-label="User profile"
      >
        {user.name} {user.last_name}
      </button>
      <div className="dropdown-content">
        <button
          onClick={onLogoutClick}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </>
  );
}

// пропсы
ProfileButtonContent.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
  onProfileClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};
