import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();
  
  const tabletId = searchParams.get('tabletid');
  const position = searchParams.get('position');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // TODO: Replace with actual database interaction
    try {
      // Simulate API call
      // Later, this will be replaced with actual database operations
      console.log('Player logged in:', {
        tabletId,
        position,
        playerName
      });

      // For now, just close the window as we'll handle the state update via WebSocket later
      window.close();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-page">
      <h1>Player Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="playerName">Enter your name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
};

export default Login;