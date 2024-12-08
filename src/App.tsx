import React from 'react';
import './App.css';
import Header from './page/home/Header';
import Body from './page/home/Body';
import Footer from './page/home/Footer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
      </header>
      <body className='App-body'>
        <Body/>
      </body>
      <footer className='App-footer'>
        <Footer/>
      </footer>
    </div>
  );
}

export default App;
