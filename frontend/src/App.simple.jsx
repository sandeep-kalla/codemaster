import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Simple placeholder component
const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>CodeMaster</h1>
    <p>Welcome to CodeMaster - Enhance Your Coding Skills</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
