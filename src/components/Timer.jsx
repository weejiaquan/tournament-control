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

  return (
    <TimerContainer className={`timer-container ${className || ''}`}>
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
  background: linear-gradient(300deg, #ffdf00, #ffffff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${fadeIn} 0.5s ease-in-out;
  will-change: opacity, transform;

  &.fade-out {
    animation: ${fadeOut} 0.5s ease-in-out forwards;
  }
`;

export default Timer;