import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import LandingScreen from './LandingScreen';
import TimerScreen from './TimerScreen';
import ControlPanel from './ControlPanel';
import SceneManager from './SceneManager';
import RaffleScreen from './RaffleScreen'; 

const App = () => {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<SceneManager />} />
        <Route path="/landing" element={<LandingScreen />} />
        <Route path="/timer" element={<TimerScreen />} />
        <Route path="/control" element={<ControlPanel />} />
        <Route path="/raffle" element={<RaffleScreen />} />
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