import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.simple.jsx';

// Create a simple loading indicator
const loadingElement = document.createElement('div');
loadingElement.style.position = 'fixed';
loadingElement.style.top = '0';
loadingElement.style.left = '0';
loadingElement.style.width = '100%';
loadingElement.style.height = '100%';
loadingElement.style.display = 'flex';
loadingElement.style.alignItems = 'center';
loadingElement.style.justifyContent = 'center';
loadingElement.style.backgroundColor = '#0c0c0f';
loadingElement.style.color = '#8b5cf6';
loadingElement.style.fontSize = '24px';
loadingElement.style.fontWeight = 'bold';
loadingElement.style.zIndex = '9999';
loadingElement.textContent = 'Loading CodeMaster...';

// Add the loading indicator to the body
document.body.appendChild(loadingElement);

// Render the app after a short delay to ensure the DOM is ready
setTimeout(() => {
  // Remove the loading indicator
  document.body.removeChild(loadingElement);

  // Render the app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}, 500);
