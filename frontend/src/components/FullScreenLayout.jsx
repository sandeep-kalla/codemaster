import React from 'react';
import { Outlet } from 'react-router-dom';
import './FullScreenLayout.css';

const FullScreenLayout = () => {
  return (
    <div className="full-screen-layout">
      <Outlet />
    </div>
  );
};

export default FullScreenLayout;
