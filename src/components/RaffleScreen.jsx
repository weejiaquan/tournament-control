import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const RaffleScreen = () => {
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Fetch participants from your storage/database
    const fetchParticipants = async () => {
      // Implementation depends on your storage solution
      // This is just a placeholder
      const response = await fetch('/api/raffle-participants');
      const data = await response.json();
      setParticipants(data);
    };

    fetchParticipants();
  }, []);

  return (
    <RaffleContainer>
      {winner && <WinnerAnnouncement>Congratulations to {winner}!</WinnerAnnouncement>}
      <WheelContainer spinning={isSpinning}>
        {participants.map((participant, index) => (
          <WheelSegment
            key={index}
            rotation={index * (360 / participants.length)}
            color={`hsl(${index * (360 / participants.length)}, 70%, 50%)`}
          >
            {participant.name}
          </WheelSegment>
        ))}
      </WheelContainer>
    </RaffleContainer>
  );
};

const RaffleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1a1a1a;
`;

const WinnerAnnouncement = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const WheelContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  transform: ${({ spinning }) => spinning ? 'rotate(2160deg)' : 'rotate(0deg)'};
`;

const WheelSegment = styled.div`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: 100% 100%;
  transform: rotate(${props => props.rotation}deg) skewY(-60deg);
  background-color: ${props => props.color};
  color: white;
  text-align: center;
  padding-top: 20px;
`;

export default RaffleScreen;