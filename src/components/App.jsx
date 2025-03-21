import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import LandingScreen from './display/LandingScreen';
import TimerScreen from './display/TimerScreen';
import ControlPanel from './display/ControlPanel';
import SceneManager from './display/SceneManager';
import RaffleScreen from './display/RaffleScreen';
import TabletLanding from './tablet/TabletLanding'; // Break out TabletLanding for direct import
import Login from './tablet/Login';

const App = () => {
  return (
    <AppContainer>
      <Routes>
        {/* Display Routes */}
        <Route path="/" element={<SceneManager />} />
        <Route path="/landing" element={<LandingScreen />} />
        <Route path="/timer" element={<TimerScreen />} />
        <Route path="/control" element={<ControlPanel />} />
        <Route path="/raffle" element={<RaffleScreen />} />

        {/* Tablet Routes */}
        <Route path="/tablet" element={<TabletLanding />} />
        <Route path="/tablet/login" element={<Login />} />
      </Routes>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
`;

export default App;
