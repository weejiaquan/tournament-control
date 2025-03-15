import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../config';
import { keyframes } from 'styled-components';
import { createGlobalStyle } from 'styled-components';

// Add this before your App component
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const gradientFlow = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`;

const App = () => {
  const [time, setTime] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const fetchTimer = async () => {
      const response = await fetch(`${API_URL}/api/timer`);
      const data = await response.json();
      setTime(data.time);
      setIsRunning(data.isRunning);
    };

    fetchTimer();
    const interval = setInterval(fetchTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await fetch(`${API_URL}/api/background`);
        const data = await response.json();
        setBackgroundImage(data.backgroundImage);
      } catch (error) {
        console.error('Failed to fetch background:', error);
      }
    };

    fetchBackground();
    // Poll for background changes
    const bgInterval = setInterval(fetchBackground, 1000);
    return () => clearInterval(bgInterval);
  }, []);

  const formatTime = (seconds) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    
    return `${isNegative ? '-' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds <= 0) {
      return 'linear-gradient(45deg, #ff0000, #ff6666, #ff0000)';  // Bright red neon
    }
    if (seconds <= 300) {
      return 'linear-gradient(45deg, #ffff00, #ffff99, #ffff00)';  // Bright yellow neon
    }
    return 'linear-gradient(45deg, #00ffff, #99ffff, #00ffff)';  // Cyan neon
  };

  return (
    <Container $backgroundImage={backgroundImage}>
      <Timer $timeColor={getTimerColor(time)}>
        {formatTime(time)}
      </Timer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  color: #000;
  font-family: 'Arial', sans-serif;
  background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
`;

const Timer = styled.div`
  font-size: 15rem;
  font-weight: bold;
  text-shadow: 
    0 0 10px ${props => props.$timeColor.split(',')[0].split('(')[2]},
    0 0 20px ${props => props.$timeColor.split(',')[0].split('(')[2]},
    0 0 40px ${props => props.$timeColor.split(',')[0].split('(')[2]};
  background: ${props => props.$timeColor};
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${gradientFlow} 5s ease infinite;
`;

export default App;