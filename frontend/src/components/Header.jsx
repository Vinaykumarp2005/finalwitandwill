import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <nav style={{ backgroundColor: '#333', padding: '10px' }}>
      <button onClick={() => navigate('/admin')}>Home</button>
      <button>Sample Reports</button>
      <button>Download Reports</button>
    </nav>
  );
}

export default Header;
