import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_URL } from '../../config';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [playerName, setPlayerName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [favoriteColor, setFavoriteColor] = useState('#ffffff'); // State for color picker

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
      if (data.tabletId === tabletId && data.position === position) {
        handleLogoutCleanup();
      }
    });

    // Keep this as a backup to ensure sync
    newSocket.on('playerUpdate', (data) => {
      if (data.tabletId === tabletId &&
        data.position === position &&
        data.playerName === null) {
        handleLogoutCleanup();
      }
    });

    return () => newSocket.disconnect();
  }, [tabletId, position]);

  const handleLogoutCleanup = () => {
    console.log('Logging out and resetting color'); // Debugging log
    localStorage.removeItem(`player_${tabletId}_${position}`);
    localStorage.removeItem(`color_${tabletId}_${position}`); // Remove the color from localStorage
    setIsLoggedIn(false);
    setPlayerName('');
    setFavoriteColor('#ffffff'); // Reset the color to default
  };
  
  const handleLogout = () => {
    if (socket) {
      socket.emit('playerLogout', {
        tabletId,
        position,
        playerName,
        favoriteColor,
      });
      handleLogoutCleanup();
      console.log('Favorite color after logout:', favoriteColor); // Debugging log
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (socket) {
      socket.emit('playerLogin', {
        tabletId,
        position,
        playerName,
        favoriteColor
      });
      // Save login state
      localStorage.setItem(`player_${tabletId}_${position}`, playerName);
      localStorage.setItem(`color_${tabletId}_${position}`, favoriteColor); // Save the color
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="login-page">
      <h1>Player Login</h1>
      {isLoggedIn ? (
        <div>
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
          <div className="background-color">
            <label htmlFor="favoriteColor">Pick your favorite color:</label>
            <input
              type="color"
              id="favoriteColor"
              value={favoriteColor}
              onChange={(e) => setFavoriteColor(e.target.value)}
            />
          </div>

          {/* Selected color box */}
        <div
          className="selected-color-box"
          style={{
            backgroundColor: favoriteColor,
            width: '200px',
            height: '27px',
            marginTop: '10px',
            border: '1px solid #000',
          }}
        >
          <p style={{ textAlign: 'center', color: '#fff', margin: 0 }}>Selected Color</p>
        </div>
          <button type="submit">Join Game</button>
        </form>
      )}
    </div>
  );
};

export default Login; // Add this line at the end