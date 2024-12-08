import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} URL Shortener Arquitectura de Sistemas.</p>
    </footer>
  );
};

export default Footer;