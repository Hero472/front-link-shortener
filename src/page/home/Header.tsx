import React, { useState } from 'react';
import { ModalRegister, ModalProfile } from '../components/Modal';
import './Header.css';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const { user, login, logout } = useAuthStore(); // Access global login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const displayMessage = (message: string, duration: number, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(message);
    setTimeout(() => setter(''), duration);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("data");
        console.log(data);
        login(data);
        displayMessage('Login successful!', 3000, setSuccessMessage);
      } else {
        displayMessage('Login failed. Please check your credentials.', 3000, setError);
      }
    } catch (err) {
      displayMessage('An error occurred during login.', 3000, setError);
    } finally {
      setLoading(false);
    }
  };

  const toggleModalRegister = () => {
    setIsRegisterModalOpen(!isRegisterModalOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleModalProfile = async () => {
    setIsProfileModalOpen(!isProfileModalOpen)
  }

  return (
    <header className="header">
      <div className="title-container">
        <h1 className="title">URL Shortener</h1>
        <p className="subtitle">Easily shorten your long links!</p>
      </div>
      <div className="login-form">
        {user ? (
          <div className="user-info">
            <h2 className="username">Hello, {user.username}!</h2>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <button className='profile-button' onClick={toggleModalProfile}>
              Profile
            </button>
          </div>
        ) : (
          <>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-button" onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button className="register-button" onClick={toggleModalRegister}>
              Register
            </button>
          </>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {isRegisterModalOpen && <ModalRegister onClose={toggleModalRegister} />}
      {isProfileModalOpen && <ModalProfile onClose={toggleModalProfile} userId={user ? user.id : "user_id"} />}
    </header>
  );
};

export default Header;