import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../../css/tablet/tabletLanding.css';

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
    const [playerNames, setPlayerNames] = useState({});
  
    const getLoginUrl = (position) => {
      // This URL will point to your login page
      const baseUrl = window.location.origin;
      return `${baseUrl}/login?tabletid=${tabletId}&position=${position}`;
    };
  
    const renderPanels = () => {
      return Array.from({ length: playerCount }, (_, index) => {
        const position = index + 1;
        const playerName = playerNames[position];
  
        return (
          <div key={index} className={`panel panel-${position}`}>
            <h2>Player {position}</h2>
            {playerName ? (
              <div className="player-info">
                <h3>Welcome, {playerName}!</h3>
              </div>
            ) : (
              <div className="login-container">
                <p>Scan to login</p>
                <QRCodeSVG value={getLoginUrl(position)} size={200} />
              </div>
            )}
          </div>
        );
      });
    };
  
    // WebSocket or polling could be implemented here to receive login updates
    // For now, we'll create a test function to simulate login
    const simulateLogin = (position, name) => {
      setPlayerNames(prev => ({
        ...prev,
        [position]: name
      }));
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