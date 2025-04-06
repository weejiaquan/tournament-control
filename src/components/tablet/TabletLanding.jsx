import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/tablet/TabletLanding.css';
import GlobalStyle from '../../styles/GlobalStyle';

const TabletLanding = () => {
    const [playerCount, setPlayerCount] = useState(4);
    const [tabletId, setTabletId] = useState('1');
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);

    const handleMTGClick = () => {
        navigate(`/tablet/mtgcounter?tabletid=${tabletId}&players=${playerCount}`);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };


    return (
            <>
              <GlobalStyle />
        <div className="landing-container">
        <nav className="navbar">
            <div className="nav-left">
                <button
                    className="mtg-button"
                    onClick={handleMTGClick}
                >
                    MTG
                </button>
            </div>
        </nav>

        <div className="content">
            <h1>Tournament Control</h1>

                <div className="setup-form">
                    <div className="form-group">
                        <label htmlFor="playerCount">Number of Players:</label>
                        <select
                            id="playerCount"
                            value={playerCount}
                            onChange={(e) => setPlayerCount(Number(e.target.value))}
                        >
                            <option value={2}>2 Players</option>
                            <option value={3}>3 Players</option>
                            <option value={4}>4 Players</option>
                            <option value={5}>5 Players</option>
                            <option value={6}>6 Players</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
            className="settings-button"
            onClick={toggleSettings}
        >
            ⚙️
        </button>

            {showSettings && (
                <div className="settings-overlay">
                    <div className="settings-form">
                        <div className="form-group">
                            <label htmlFor="tabletId">Tablet ID:</label>
                            <input
                                type="number"
                                id="tabletId"
                                value={tabletId}
                                onChange={(e) => setTabletId(e.target.value)}
                                min="1"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default TabletLanding;