import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import '../../css/tablet/MTGCounter.css';
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

const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

const MTGCounter = () => {
  const [searchParams] = useSearchParams();
  const tabletId = searchParams.get('tabletid');
  const playerCount = parseInt(searchParams.get('players') || '2', 10);

  // Initialize state from localStorage or empty object
  const [playerNames, setPlayerNames] = useState(() => {
    const saved = localStorage.getItem(`tablet_${tabletId}_players`);
    return saved ? JSON.parse(saved) : {};
  });
  const [socket, setSocket] = useState(null);

  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(`tablet_${tabletId}_gameState`);
    return saved || 'standby';
  });

  const [activePlayer, setActivePlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [lifePoints, setLifePoints] = useState(() => {
    const saved = localStorage.getItem(`tablet_${tabletId}_lifePoints`);
    return saved ? JSON.parse(saved) : {};
  });

  const [deltas, setDeltas] = useState({});
  const [longPressTimers, setLongPressTimers] = useState({});

  const [gameStats, setGameStats] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);

  const [deathOrder, setDeathOrder] = useState([]);

  const [commanderDamage, setCommanderDamage] = useState(() => {
    const saved = localStorage.getItem(`tablet_${tabletId}_commanderDamage`);
    return saved ? JSON.parse(saved) : {};
  });


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
              localStorage.setItem(`tablet_${tabletId}_gameState`, 'started');
            }
          }, interval);
        }
      }, interval);
    }

    return () => clearInterval(intervalId);
  }, [gameState, playerCount]);

  const handleStartGame = () => {
    if (Object.keys(playerNames).length >= 2) {
      // Reset life points to default when starting a new game
      const defaultLifePoints = Object.fromEntries(
        Object.keys(playerNames).map(pos => [pos, 40])
      );
      setLifePoints(defaultLifePoints);
      setDeathOrder([]); // Reset death order
      localStorage.setItem(`tablet_${tabletId}_lifePoints`, JSON.stringify(defaultLifePoints));

      setGameState('selecting');
      localStorage.setItem(`tablet_${tabletId}_gameState`, 'started');
    }
  };

  const handleEndGame = () => {
    // Reset game state
    setGameState('standby');
    localStorage.setItem(`tablet_${tabletId}_gameState`, 'standby');

    // Reset player selection
    setSelectedPlayer(null);
    setActivePlayer(null);

    // Reset game over state and stats
    setShowGameOver(false);
    setGameStats([]);

    // Reset life points to initial state
    const defaultLifePoints = Object.fromEntries(
      Object.keys(playerNames).map(pos => [pos, 40])
    );
    setLifePoints(defaultLifePoints);
    localStorage.setItem(`tablet_${tabletId}_lifePoints`, JSON.stringify(defaultLifePoints));

    // Reset commander damage
    setCommanderDamage({});
    localStorage.removeItem(`tablet_${tabletId}_commanderDamage`);


    // Reset death order
    setDeathOrder([]);

    // Clear any deltas
    setDeltas({});

    // Clear any long press timers
    Object.values(longPressTimers).forEach(timer => clearTimeout(timer));
    setLongPressTimers({});

    // Clear delta animation timers
    if (window.deltaTimers) {
      Object.values(window.deltaTimers).forEach(timer => clearTimeout(timer));
      window.deltaTimers = {};
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

  const handleCommanderDamage = (fromPosition, toPosition, amount) => {
    setCommanderDamage(prev => {
      const key = `${fromPosition}-${toPosition}`;
      const currentDamage = prev[key] || 0;
      const newDamage = Math.max(0, currentDamage + amount);

      const newCommanderDamage = {
        ...prev,
        [key]: newDamage
      };

      // Also reduce life points by the same amount
      handleLifeChange(toPosition, -amount);

      // If commander damage reaches 21 or more, the player loses
      if (newDamage >= 21) {
        handleLifeChange(toPosition, -lifePoints[toPosition]); // Set life to 0
      }

      localStorage.setItem(`tablet_${tabletId}_commanderDamage`, JSON.stringify(newCommanderDamage));
      return newCommanderDamage;
    });
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

  const handleLifeChange = (position, amount) => {
    setLifePoints(prev => {
      const currentLife = prev[position] ?? 40;
      const newLife = currentLife + amount;
      const finalLife = Math.max(0, newLife);

      // Track death order when a player dies
      if (currentLife > 0 && finalLife === 0) {
        setDeathOrder(prev => [...prev, position]);
      }

      const newLifePoints = {
        ...prev,
        [position]: finalLife
      };

      // Check for game over condition
      const alivePlayers = Object.entries(newLifePoints).filter(([_, life]) => life > 0);
      if (alivePlayers.length === 1) {  
        const winner = alivePlayers[0][0];
        // Create final standings with death order consideration
        const standings = Object.entries(newLifePoints)
          .map(([pos, life]) => ({
            position: pos,
            playerName: playerNames[pos],
            finalLife: life,
            deathPosition: life > 0 ? Number.MAX_SAFE_INTEGER : deathOrder.indexOf(pos)
          }))
          .sort((a, b) => {
            // Winner always first
            if (a.finalLife > 0) return -1;
            if (b.finalLife > 0) return 1;

            // For dead players, earlier index in deathOrder means they died first
            // So they should be ranked lower
            return a.deathPosition - b.deathPosition;
          });

        setGameStats(standings);
        setShowGameOver(true);
      }

      localStorage.setItem(`tablet_${tabletId}_lifePoints`, JSON.stringify(newLifePoints));
      return newLifePoints;
    });

    // Handle visual delta indicators
    setDeltas(prev => {
      const currentDelta = prev[position];
      const now = Date.now();

      return {
        ...prev,
        [position]: {
          amount: currentDelta && (now - currentDelta.timestamp) < 2000
            ? currentDelta.amount + amount
            : amount,
          timestamp: now,
          key: now
        }
      };
    });

    // Clear existing timeout for delta animation
    if (window.deltaTimers?.[position]) {
      clearTimeout(window.deltaTimers[position]);
    }

    // Set new timeout for delta animation
    const timer = setTimeout(() => {
      setDeltas(prev => {
        const newDeltas = { ...prev };
        delete newDeltas[position];
        return newDeltas;
      });
    }, 5000);

    if (!window.deltaTimers) window.deltaTimers = {};
    window.deltaTimers[position] = timer;
  };

  const handleMouseDown = (position, amount) => {
    // Handle initial click
    handleLifeChange(position, amount);
  
    // Set up timer for long press
    const timer = setInterval(() => {
      // Check life points inside interval to stop when reaching 0
      setLifePoints(prev => {
        const life = prev[position] ?? 40;
        if (life <= 0) {
          clearInterval(timer); // Clear the interval if player dies
          setLongPressTimers(prev => {
            const newTimers = { ...prev };
            delete newTimers[position];
            return newTimers;
          });
          return prev; // Return unchanged state
        }
        return prev; // Let handleLifeChange handle the actual change
      });
      handleLifeChange(position, amount < 0 ? -10 : 10);
    }, 1000);
  
    setLongPressTimers(prev => ({
      ...prev,
      [position]: timer
    }));
  };

  const handleMouseUp = (position) => {
    // Clear long press timer
    if (longPressTimers[position]) {
      clearTimeout(longPressTimers[position]);
      setLongPressTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[position];
        return newTimers;
      });
    }
  };


  const renderPanels = () => {
    return Array.from({ length: playerCount }, (_, index) => {
      const position = index + 1;
      const playerName = playerNames[position];
      const isActive = activePlayer === String(position);
      const isSelected = selectedPlayer === String(position);
      const life = lifePoints[position] ?? 40;
      const delta = deltas[position];

      //color changer
      const playerColor = playerName && !playerName.startsWith('Guest')
      ? localStorage.getItem(`color_${tabletId}_${position}`) || '#ffffff' // Use saved color or default to white
      : '#ffffff'; // Default to white for guests or logged-out players


      // Find player's final rank if game is over
      const playerRank = showGameOver ?
        gameStats.findIndex(stat => stat.position === String(position)) + 1 :
        null;


      return (
        <div
          key={index}
          className={`panel panel-${position} ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
          style={{
            backgroundColor: playerColor, // Set the background color dynamically
          }}
        >
          {playerName ? (
            <div className="player-content">
              <h2 className="player-name">
                {playerName}
                {showGameOver && (
                  <span className="player-rank">
                    {playerRank}{getOrdinalSuffix(playerRank)}
                  </span>
                )}
              </h2>
              {gameState === 'standby' && playerName && (
                <button onClick={() => handleLogout(position)} className="logout-button">
                  Logout
                </button>
              )}
              {(gameState === 'started' || showGameOver) && (
                <div className="life-counter">
                  {!showGameOver ? (
                    <>
                      <button
                        className="minus"
                        onMouseDown={() => handleMouseDown(position, -1)}
                        onMouseUp={() => handleMouseUp(position)}
                        onMouseLeave={() => handleMouseUp(position)}
                      />
                      <div className="life-display">
                        <span className={`life-number ${life <= 0 ? 'dead' : ''}`}>
                          {life <= 0 ? 'DEAD' : life}
                        </span>
                        {delta && (
                          <span
                            key={delta.key}
                            className={`delta ${delta.amount > 0 ? 'positive' : 'negative'}`}
                          >
                            {delta.amount > 0 ? '+' : ''}{delta.amount}
                          </span>
                        )}
                      </div>

                      <button
                        className="plus"
                        onMouseDown={() => handleMouseDown(position, 1)}
                        onMouseUp={() => handleMouseUp(position)}
                        onMouseLeave={() => handleMouseUp(position)}
                      />
                    </>
                  ) : (
                    <div className="final-stats">
                      <div className={`final-life ${life <= 0 ? 'dead' : ''}`}>
                        {life <= 0 ? 'DEAD' : `Final Life: ${life}`}
                      </div>
                    </div>
                  )}
                </div>


              )}

              {(gameState === 'started' && !showGameOver) && (
                <div className={`commander-damage-grid player-count-${playerCount}`}>
                  {Array.from({ length: playerCount }, (_, idx) => {
                    const fromPosition = idx + 1;
                    const damageKey = `${fromPosition}-${position}`;
                    const damage = commanderDamage[damageKey] || 0;

                    return (
                        <div key={fromPosition} className={`commander-damage-counter`}>

                        <button
                          className="minus"
                          onClick={() => handleCommanderDamage(fromPosition, position, -1)}
                          disabled={damage <= 0}
                        ></button>
                        <span className="commander-label">
                          {fromPosition === position ? 'Self' : `P${fromPosition}`}
                        </span>
                        <span className="damage-amount">{damage}</span>
                        <button
                          className="plus"
                          onClick={() => handleCommanderDamage(fromPosition, position, 1)}
                          disabled={damage >= 21}
                        ></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="login-container">
              <p>Scan to login</p>
              <p> {getLoginUrl(position)}</p>
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
    <>
      <GlobalStyle />
      <div className="tablet-container">
        <div className={`split-screen ${getGridLayout(playerCount)}`}>
          {renderPanels()}
        </div>
        <div className="game-controls">
          {gameState === 'standby' && allPlayersReady && (
            <button
              className="start-button"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          )}
          {gameState === 'started' && (
            <button
              className="end-button"
              onClick={handleEndGame}
            >
              End Game
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MTGCounter;