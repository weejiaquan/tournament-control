import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <ClockContainer>
      {currentTime.toLocaleTimeString()}
    </ClockContainer>
  );
};

const ClockContainer = styled.div`
  position: fixed;
  top: 0;
  right: 1%;
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
`;

export default Clock;