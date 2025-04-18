import React from 'react';
import './App.css';

// Simple placeholder component
const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>CodeMaster</h1>
    <p>Welcome to CodeMaster - Enhance Your Coding Skills</p>
    <div className="features">
      <div className="feature">
        <h3>Interactive Coding</h3>
        <p>Practice coding with our interactive editor</p>
      </div>
      <div className="feature">
        <h3>Daily Challenges</h3>
        <p>Improve your skills with daily coding challenges</p>
      </div>
      <div className="feature">
        <h3>Problem Library</h3>
        <p>Access a wide range of coding problems</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">CodeMaster</div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Problems</a></li>
            <li><a href="#">Profile</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <Home />
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} CodeMaster. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
