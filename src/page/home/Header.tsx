import React, { useState } from 'react';
import Modal from '../components/Modal';
import './Header.css';

const Header: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = () => {
    alert(`Logged in with email: ${email}`);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="header">
      <div className="title-container">
        <h1 className="title">URL Shortener</h1>
        <p className="subtitle">Easily shorten your long links!</p>
      </div>

      <div className="login-form">
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
        <button className="login-button" onClick={handleLogin}>Login</button>
        <button className="register-button" onClick={toggleModal}>Register</button>
      </div>

      {isModalOpen && <Modal onClose={toggleModal} />}
    </header>
  );
};

export default Header;