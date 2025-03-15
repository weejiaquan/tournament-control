import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../config';
import { keyframes } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';

import yonakaLogo from '../../assets/yonaka_logo.png'; // Add this import


const gradient = keyframes`
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
      return 'linear-gradient(45deg,rgb(255, 255, 255), #dfb150)';  // Bright yellow neon
    }
    return 'linear-gradient(45deg, #ffdf00, #ffffff)';  // Cyan neon
  };

  return (
    <Container $backgroundImage={backgroundImage}>
    <Timer $timeColor={getTimerColor(time)}>
      {formatTime(time)}
    </Timer>
    <LogoContainer>
        <PoweredByText>Powered by</PoweredByText>
        <Logo src={yonakaLogo} alt="Yonaka Logo" />
      </LogoContainer>
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
  background-color: #000;
  background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  position: relative; 

`;

const LogoContainer = styled.div`
  position: absolute;
  bottom: 1%;
  right: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PoweredByText = styled.span`
  color: white;
  font-size: 2rem;
  font-family: 'DM Sans', sans-serif;
  opacity: 1;
`;

const Logo = styled.img`
  height: 7vh; // Adjust this value based on your logo size
  width: 100%;
`;

const Timer = styled.div`
  color: transparent;
  font-size: 25rem;
  font-family: 'DM Sans', sans-serif;
  
  text-align: center;
  letter-spacing: 2px;
  line-height: 1.5;
  padding: 20px;
  border-radius: 10px;
  text-shadow: 
    0 0 7px rgba(255,255,255,0.2),
    0 0 10px rgba(255,255,255,0.2),
    0 0 21px rgba(255,255,255,0.2),
    0 0 42px rgba(255,255,255,0.3),
    0 0 82px rgba(255,255,255,0.1);

  background: ${props => props.$timeColor};
  background-size: 300% 300%;
  animation: ${gradient} 12s ease infinite;
  -webkit-background-clip: text;
  background-clip: text;

  br {
    margin: 10px 0;
  }
`;

export default App;