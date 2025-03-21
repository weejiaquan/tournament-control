import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import '../../css/tablet/tabletLanding.css';
import { API_URL } from '../../config';

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

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('playerUpdate', (data) => {
      if (data.tabletId === tabletId) {
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
    // Add listener for logout events
    newSocket.on('playerLogout', (data) => {
      if (data.tabletId === tabletId) {
        handleLogout(data.position);
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
    const newNames = { ...playerNames };
    const playerName = playerNames[positionStr];
    delete newNames[positionStr];
  
    localStorage.setItem(`tablet_${tabletId}_players`, JSON.stringify(newNames));
    setPlayerNames(newNames);
  
    if (socket) {
      socket.emit('playerLogout', {
        tabletId,
        position: positionStr,
        playerName
      });
      
      socket.emit('playerUpdate', {
        tabletId,
        position: positionStr,
        playerName: null
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

      return (
        <div key={index} className={`panel panel-${position}`}>
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
    <div className="tablet-container">
      <div className={`split-screen ${getGridLayout(playerCount)}`}>
        {renderPanels()}
      </div>
    </div>
  );
};

export default TabletLanding;