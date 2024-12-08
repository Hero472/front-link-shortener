import React from 'react';
import './Body.css';

const Body = () => {
  return (
    <main className="body">
      <input className="url-input" type="text" placeholder="Enter your long URL here" />
      <button className="shorten-button">Shorten URL</button>
    </main>
  );
};

export default Body;