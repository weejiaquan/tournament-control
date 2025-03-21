import React from 'react';
import styled, { keyframes } from 'styled-components';

const Timer = ({ time, className }) => {
    const formatTime = (timeInSeconds) => {
      const isNegative = timeInSeconds < 0;
      const absTime = Math.abs(timeInSeconds);
      const minutes = Math.floor(absTime / 60);
      const seconds = absTime % 60;
      
      return `${isNegative ? '-' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const getTimerColor = (seconds) => {
        if (seconds <= 0) {
          return 'linear-gradient(45deg, #ff0000, #ff6666, #ff0000)';  // Bright red neon
        }
        if (seconds <= 300) {
          return 'linear-gradient(45deg, #ffffff, #ff7b00)';  // Bright yellow neon
        }
        return 'linear-gradient(45deg, #ffffff, #ffffff)';  // Default color
      };

  return (
    <TimerContainer 
      className={`timer-container ${className || ''}`}
      $timeColor={getTimerColor(time)}
    >
      {formatTime(time)}
    </TimerContainer>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

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

const TimerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 1%;
  color: transparent;
  font-size: 5rem;
  font-family: 'DM Mono', sans-serif;
  text-shadow: 
    0 0 7px rgba(255,255,255,0.2),
    0 0 10px rgba(255,255,255,0.2),
    0 0 21px rgba(255,255,255,0.2),
    0 0 42px rgba(255,255,255,0.3),
    0 0 82px rgba(255,255,255,0.1);
  background: ${props => props.$timeColor};
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${gradient} 12s ease infinite;
  will-change: opacity, transform;

  &.fade-out {
    animation: ${fadeOut} 0.5s ease-in-out forwards;
  }
`;

export default Timer;