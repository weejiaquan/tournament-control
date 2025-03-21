import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import styled from 'styled-components';
import { API_URL } from '../../config/display/';
import { themes } from '../../config/display/themes';


const currentTheme = themes.default;

const RaffleScreen = () => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [participants, setParticipants] = useState([]);
    const [winner, setWinner] = useState(null);

    // Generate random colors for wheel segments
    const generateColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 50%, 50%)`;
    };

    const areParticipantsEqual = (prev, next) => {
        if (prev.length !== next.length) return false;
        return prev.every((p, i) => p.name === next[i].name);
    };

    // Listen for spin events from control panel
    useEffect(() => {
        const eventSource = new EventSource(`${API_URL}/api/raffle/spin-updates`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === 'spin') {
                setPrizeNumber(data.winnerIndex);
                setMustSpin(true);
                setWinner(null);
            }
        };

        return () => eventSource.close();
    }, []);

    // Fetch participants periodically
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await fetch(`${API_URL}/api/raffle/participants`);
                const data = await response.json();

                // Handle both data formats: {participants: [...]} or direct array
                const participantList = data.participants || data;
                const newParticipants = Array.isArray(participantList) ? participantList : [];

                // Only update state if participants have changed
                setParticipants(prevParticipants => {
                    if (!areParticipantsEqual(prevParticipants, newParticipants)) {
                        console.log('Participants updated:', newParticipants);
                        // Reset winner when participants are cleared
                        if (newParticipants.length === 0) {
                            setWinner(null);
                        }
                        return newParticipants;
                    }
                    return prevParticipants;
                });
            } catch (error) {
                console.error('Failed to fetch participants:', error);
                setParticipants([]);
                setWinner(null); // Also reset winner on error
            }
        };

        fetchParticipants();
        const interval = setInterval(fetchParticipants, 5000);
        return () => clearInterval(interval);
    }, []);

    // Convert participants to wheel data
    const wheelData = participants.map(p => ({
        option: p.name,
        style: {
            backgroundColor: generateColor(),
            textColor: 'white',
            // fontSize: '16px',
            fontFamily: 'DM Sans'
        }
    }));

    return (
        <RaffleContainer theme={currentTheme.raffleStyle}>
            {wheelData.length > 0 ? (
                <>
                    <WheelContainer>
                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={prizeNumber}
                            data={wheelData}
                            onStopSpinning={() => {
                                setMustSpin(false);
                                if (participants[prizeNumber]) {
                                    setWinner(participants[prizeNumber].name);
                                }
                            }}
                            backgroundColors={wheelData.map(d => d.style.backgroundColor)}
                            textColors={[currentTheme.raffleStyle.wheel.textColors]}
                            fontSize={currentTheme.raffleStyle.wheel.fontSize}
                            spinDuration={currentTheme.raffleStyle.wheel.spinDuration}
                            outerBorderWidth={currentTheme.raffleStyle.wheel.outerBorderWidth}
                            outerBorderColor={currentTheme.raffleStyle.wheel.outerBorderColor}
                            innerBorderColor={currentTheme.raffleStyle.wheel.innerBorderColor}
                            radiusLineColor={currentTheme.raffleStyle.wheel.radiusLineColor}
                            radiusLineWidth={currentTheme.raffleStyle.wheel.radiusLineWidth}
                        />
                    </WheelContainer>
                    {winner && (
                        <WinnerAnnouncement theme={currentTheme.raffleStyle}>
                            Congratulations to {winner}!
                        </WinnerAnnouncement>
                    )}
                </>
            ) : (
                <NoParticipantsMessage theme={currentTheme.raffleStyle}>
                    Waiting for participants...
                </NoParticipantsMessage>
            )}
        </RaffleContainer>
    );
};

const RaffleContainer = styled.div`
    ${props => props.theme.container}
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const WheelContainer = styled.div`
    max-width: 80vh;
    max-height: 80vh;
    aspect-ratio: 1;
`;

const WinnerAnnouncement = styled.h1`
    ${props => props.theme.winner}
`;

const NoParticipantsMessage = styled.div`
    ${props => props.theme.waitingMessage}
`;

export default RaffleScreen;