import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to WIT and WILL</h1>
      <button onClick={() => navigate('/admin')}>Admin</button>
      <button onClick={() => navigate('/faculty')}>Faculty</button>
    </div>
  );
}

export default Home;
