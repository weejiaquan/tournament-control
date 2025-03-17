import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { API_URL } from '../config';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [clockStyle, setClockStyle] = useState({ style: '' });

  useEffect(() => {
    const fetchClockStyle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/clock/style`);
        const data = await response.json();
        setClockStyle(data);
      } catch (error) {
        console.error('Failed to fetch clock style:', error);
      }
    };

    fetchClockStyle();
    const styleInterval = setInterval(fetchClockStyle, 1000);

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(styleInterval);
    };
  }, []);

  return (
    <ClockDisplay $customStyle={clockStyle.style}>
      {time.toLocaleTimeString()}
    </ClockDisplay>
  );
};

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

const ClockDisplay = styled.div`
  ${props => props.$customStyle || `
    color: white;
    font-size: 5rem;
    font-family: 'DM Mono', sans-serif;
    position: absolute;
    top: 1rem;
    left: 1rem;
  `}
`;

export default Clock;