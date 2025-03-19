import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../config';
import { keyframes } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import Clock from './Clock';
import yonakaLogo from '../../assets/yonaka_logo.png'; // Add this import
import MenuScreen from './MenuScreen';
import Logo from './Logo';

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
  const [timerStyle, setTimerStyle] = useState('');
  const [timerGradients, setTimerGradients] = useState({
    default: 'linear-gradient(45deg, #ffffff, #ffffff)',
    warning: 'linear-gradient(45deg, #ffffff, #ff7b00)',
    danger: 'linear-gradient(45deg, #ff0000, #ff6666, #ff0000)'
  });

  useEffect(() => {
    const fetchTimer = async () => {
      const response = await fetch(`${API_URL}/api/timer`);
      const data = await response.json();
      if (data.time !== time || data.isRunning !== isRunning) {
        setTime(data.time);
        setIsRunning(data.isRunning);
      }
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

  useEffect(() => {
    const fetchTimerStyle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/timer/style`);
        const data = await response.json();
        setTimerStyle(data.style);
      } catch (error) {
        console.error('Failed to fetch timer style:', error);
      }
    };
  
    fetchTimerStyle();
    const styleInterval = setInterval(fetchTimerStyle, 1000);
    return () => clearInterval(styleInterval);
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
      return timerGradients.danger;
    }
    if (seconds <= 300) {
      return timerGradients.warning;
    }
    return timerGradients.default;
  };

  useEffect(() => {
    const fetchGradients = async () => {
      try {
        const response = await fetch(`${API_URL}/api/timer/gradients`);
        const data = await response.json();
        setTimerGradients(data);
      } catch (error) {
        console.error('Failed to fetch timer gradients:', error);
      }
    };
  
    fetchGradients();
    const gradientInterval = setInterval(fetchGradients, 1000);
    return () => clearInterval(gradientInterval);
  }, []);

  return (

    <Container $backgroundImage={backgroundImage}>
    <Clock />
    <Logo />
    <Timer 
      $timeColor={getTimerColor(time)}
      $customStyle={timerStyle}
    >
      {formatTime(time)}
    </Timer>
    <LogoContainer>
        <PoweredByText>Powered by</PoweredByText>
        <YonakaLogo src={yonakaLogo} alt="Yonaka Logo" />
      </LogoContainer>
    <MenuScreen />
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
  z-index: 1000;
`;

const PoweredByText = styled.span`
  color: white;
  font-size: 2rem;
  font-family: 'DM Sans', sans-serif;
  opacity: 1;
  text-shadow: 
    0 0 7px rgba(0,0,0,0.2),
    0 0 10px rgba(0,0,0,0.2),
    0 0 21px rgba(0,0,0,0.2),
    0 0 42px rgba(0,0,0,0.3),
    0 0 82px rgba(0,0,0,0.1);
`;

const YonakaLogo = styled.img`
  height: 7vh; // Adjust this value based on your logo size
  width: 100%;
`;

const Timer = styled.div`
  /* Base styles - always applied */
  position: fixed;
  font-family: 'DM Mono', sans-serif;
  color: transparent;
  background: ${props => props.$timeColor};
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${gradient} 12s ease infinite;
  will-change: opacity, transform;
  
  /* Default styles - applied when no custom style is present */
  ${props => !props.$customStyle && `
    font-size: 25rem;
    text-align: center;
    letter-spacing: 2px;
    line-height: 1.5;
    padding: 20px;
    text-shadow: 
      0 0 7px rgba(255,255,255,0.2),
      0 0 10px rgba(255,255,255,0.2),
      0 0 21px rgba(255,255,255,0.2),
      0 0 42px rgba(255,255,255,0.3),
      0 0 82px rgba(255,255,255,0.1);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `}
  
  /* Custom styles - overrides default styles when present */
  ${props => props.$customStyle}
`;

export default App;