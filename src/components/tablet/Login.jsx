import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_URL } from '../../config';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [playerName, setPlayerName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);

  const tabletId = searchParams.get('tabletid');
  const position = searchParams.get('position');


  useEffect(() => {
    // Check if already logged in
    const savedName = localStorage.getItem(`player_${tabletId}_${position}`);
    if (savedName) {
      setPlayerName(savedName);
      setIsLoggedIn(true);
    }

    const newSocket = io(API_URL);
    setSocket(newSocket);

    // Listen for logout events from tablet
    newSocket.on('playerLogout', (data) => {
      console.log('Player logout event receivedAAAAAAAA:', data);
      if (data.tabletId === tabletId && data.position === position) {
        handleLogoutCleanup();
      }
    });
  
    newSocket.on('playerUpdate', (data) => {
      if (data.tabletId === tabletId && data.position === position && data.playerName === null) {
        handleLogoutCleanup();
      }
    });
  
    return () => newSocket.disconnect();
  }, [tabletId, position]);

  const handleLogoutCleanup = () => {
    localStorage.removeItem(`player_${tabletId}_${position}`);
    setIsLoggedIn(false);
    setPlayerName('');
  };

  const handleLogout = () => {
    if (socket) {
      socket.emit('playerLogout', {
        tabletId,
        position,
        playerName
      });
      handleLogoutCleanup();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (socket) {
      socket.emit('playerLogin', {
        tabletId,
        position,
        playerName
      });
      // Save login state
      localStorage.setItem(`player_${tabletId}_${position}`, playerName);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="login-page">
      <h1>Player Login</h1>
      {isLoggedIn ? (
        <div className="logged-in-view">
          <h2>Welcome, {playerName}!</h2>
          <p>You are ready to play</p>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Login; // Add this line at the end