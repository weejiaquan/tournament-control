import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import '../../css/tablet/tabletLanding.css';
import { API_URL } from '../../config';
import GlobalStyle from '../../styles/GlobalStyle';
import styled from "styled-components";

const GlobalOverride = styled.div`
  html, body, #root {
    overflow: auto !important;
  }
`;

const getGridLayout = (playerCount) => {
  switch (playerCount) {
    case 2:
      return 'grid-2-players';
    case 3:
      return 'grid-3-players';
    case 4:
      return 'grid-4-players';
    case 5:
      return 'grid-5-players';
    case 6:
      return 'grid-6-players';
    default:
      return 'grid-2-players';
  }
};

const TabletLanding = () => {
  const [searchParams] = useSearchParams();
  const tabletId = searchParams.get('tabletid');
  const playerCount = parseInt(searchParams.get('players') || '2', 10);

  // Initialize state from localStorage or empty object
  const [playerNames, setPlayerNames] = useState(() => {
    const saved = localStorage.getItem(`tablet_${tabletId}_players`);
    return saved ? JSON.parse(saved) : {};
  });
  const [socket, setSocket] = useState(null);

  const [gameState, setGameState] = useState('standby'); // 'standby' | 'selecting' | 'started'
  const [activePlayer, setActivePlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('playerUpdate', (data) => {
      if (data.tabletId === tabletId && data.position) {  // Add position check
        setPlayerNames(prev => {
          const newNames = { ...prev };
          if (data.playerName === null) {
            // Remove the player entirely instead of setting to null
            delete newNames[data.position];
          } else {
            newNames[data.position] = data.playerName;
          }
          localStorage.setItem(`tablet_${tabletId}_players`, JSON.stringify(newNames));
          return newNames;
        });
      }
    });

    // Modify the logout listener to only handle specific position
    newSocket.on('playerLogout', (data) => {
      if (data.tabletId === tabletId && data.position) {
        setPlayerNames(prev => {
          const newNames = { ...prev };
          delete newNames[data.position];
          localStorage.setItem(`tablet_${tabletId}_players`, JSON.stringify(newNames));
          return newNames;
        });
      }
    });

    return () => newSocket.disconnect();
  }, [tabletId]);
  useEffect(() => {
    const loggedInPlayers = Object.entries(playerNames)
      .filter(([_, name]) => name !== null)  // Filter out null values
      .map(([position, name]) => ({
        position,
        name
      }));

    if (loggedInPlayers.length >= 0) {  // Only log if there are actual players
      console.log('Currently logged in players:', loggedInPlayers);
    }
  }, [playerNames]);

  useEffect(() => {
    // Get all currently logged in players
    const currentPlayers = Object.keys(playerNames).map(Number);

    // Find players that need to be logged out (those with position > playerCount)
    const playersToLogout = currentPlayers.filter(position => position > playerCount);

    if (playersToLogout.length > 0) {
      // Create new player names object without the excess players
      const newNames = { ...playerNames };
      playersToLogout.forEach(position => {
        delete newNames[position];

        // Emit logout events for each removed player
        if (socket) {
          socket.emit('playerLogout', {
            tabletId,
            position: String(position),
            playerName: null
          });
          socket.emit('playerUpdate', {
            tabletId,
            position: String(position),
            playerName: null,
            type: 'logout'
          });
        }
      });

      // Update local storage and state
      localStorage.setItem(`tablet_${tabletId}_players`, JSON.stringify(newNames));
      setPlayerNames(newNames);

      console.log(`Logged out players in positions: ${playersToLogout.join(', ')}`);
    }
  }, [playerCount, tabletId, socket, playerNames]);

  useEffect(() => {
    let intervalId;
    let currentPosition = 0;

    if (gameState === 'selecting') {
      // Determine final position before starting animation
      const finalPosition = Math.floor(Math.random() * playerCount) + 1;
      // Calculate total iterations (5 full rotations plus final position)
      const totalIterations = (playerCount * 5) + finalPosition;

      // Start with fast interval that gradually slows down
      let interval = 100;

      intervalId = setInterval(() => {
        currentPosition++;
        const currentPlayer = (currentPosition % playerCount) + 1;
        setActivePlayer(String(currentPlayer));

        // Gradually increase interval duration for slowdown effect
        if (currentPosition > totalIterations * 0.7) {
          interval += 50;
          clearInterval(intervalId);
          intervalId = setInterval(() => {
            currentPosition++;
            const currentPlayer = (currentPosition % playerCount) + 1;
            setActivePlayer(String(currentPlayer));

            if (currentPosition >= totalIterations) {
              clearInterval(intervalId);
              setActivePlayer(String(finalPosition));
              setSelectedPlayer(String(finalPosition));
              setGameState('started');
            }
          }, interval);
        }
      }, interval);
    }

    return () => clearInterval(intervalId);
  }, [gameState, playerCount]);

  const handleStartGame = () => {
    if (Object.keys(playerNames).length >= 2) { // Require at least 2 players
      setGameState('selecting');
    }
  };

  const allPlayersReady = Object.keys(playerNames).length === playerCount;


  const handleGuestLogin = (position) => {
    const positionStr = String(position);
    const newNames = {
      ...playerNames,
      [positionStr]: `Guest ${positionStr}`
    };
    localStorage.setItem(`tablet_${tabletId}_players`, JSON.stringify(newNames));
    setPlayerNames(newNames);
  };

  const handleLogout = (position) => {
    const positionStr = String(position);

    // Update local state first
    setPlayerNames(prev => {
      const newNames = { ...prev };
      delete newNames[positionStr];
      localStorage.setItem(`tablet_${tabletId}_players`, JSON.stringify(newNames));
      return newNames;
    });

    // Emit both events to ensure both tablet and login screens are updated
    if (socket) {
      socket.emit('playerLogout', {
        tabletId,
        position: positionStr,
        playerName: null
      });
      socket.emit('playerUpdate', {
        tabletId,
        position: positionStr,
        playerName: null,
        type: 'logout'
      });
    }
  };

  const getLoginUrl = (position) => {
    // This URL will point to your login page
    const baseUrl = window.location.origin;
    return `${baseUrl}/tablet/login?tabletid=${tabletId}&position=${position}`;
  };

  const renderPanels = () => {
    return Array.from({ length: playerCount }, (_, index) => {
      const position = index + 1;
      const playerName = playerNames[position];
      const isActive = activePlayer === String(position);
      const isSelected = selectedPlayer === String(position);

      return (
        <div
          key={index}
          className={`panel panel-${position} ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
        >
          <h2>{playerName ? playerName : `Player ${position}`}</h2>
          {playerName ? (
            <div className="player-info">
              <h3>Ready to play!</h3>
              <button
                onClick={() => handleLogout(position)}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="login-container">
              <p>Scan to login</p>
              <QRCodeSVG value={getLoginUrl(position)} size={200} />
              {/* <p>{getLoginUrl(position)}</p> */}
              <button
                onClick={() => handleGuestLogin(position)}
                className="guest-button"
              >
                Continue as Guest
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <GlobalStyle />
      <div className="tablet-container">
        <div className={`split-screen ${getGridLayout(playerCount)}`}>
          {renderPanels()}
        </div>
        {gameState === 'standby' && allPlayersReady && (
          <div className="game-controls">
            <button
              className="start-button"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TabletLanding;