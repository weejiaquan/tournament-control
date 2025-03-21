import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import GlobalStyle from '../../styles/GlobalStyle';
import styled, { keyframes, css } from 'styled-components';
import Clock from './Clock';
import MenuScreen from './MenuScreen';
import YouTubeEmbed from './YoutubeEmbed';
import Timer from './Timer';
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

const LandingScreen = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [videoId, setVideoId] = useState('');
  const [timerState, setTimerState] = useState({ time: 0, isRunning: false });
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [landingTextStyles, setLandingTextStyles] = useState({
    style: '',
    japaneseStyle: ''
  });

  const [customText, setCustomText] = useState('Welcome to The Trading Gallery <br /> <span className="japanese">トレーディングギャラリーへようこそ</span>');
  const [isTextFading, setIsTextFading] = useState(false);
  const [pendingText, setPendingText] = useState('');
  
  useEffect(() => {
    const fetchCustomText = async () => {
      try {
        const response = await fetch(`${API_URL}/api/landing/text`);
        const data = await response.json();
        
        if (data.text !== customText) {
          setIsTextFading(true);
          setPendingText(data.text);
          
          setTimeout(() => {
            setCustomText(data.text);
            setIsTextFading(false);
          }, 500); // Match this with CSS transition duration
        }
      } catch (error) {
        console.error('Failed to fetch custom text:', error);
      }
    };
  
    fetchCustomText();
    const textInterval = setInterval(fetchCustomText, 1000);
    return () => clearInterval(textInterval);
  }, [customText]); // Add customText as dependency

  useEffect(() => {
    const fetchLandingStyles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/landing/style`);
        const data = await response.json();
        setLandingTextStyles(data);
      } catch (error) {
        console.error('Failed to fetch landing styles:', error);
      }
    };
  
    fetchLandingStyles();
    const styleInterval = setInterval(fetchLandingStyles, 1000);
    return () => clearInterval(styleInterval);
  }, []);


  const fetchTimerState = async () => {
    try {
      const response = await fetch(`${API_URL}/api/timer`);
      const data = await response.json();
      setTimerState(data);
    } catch (error) {
      console.error('Failed to fetch timer state:', error);
    }
  };

  useEffect(() => {
    fetchTimerState();
    const timerInterval = setInterval(fetchTimerState, 1000);
    return () => clearInterval(timerInterval);
  }, []); 

  useEffect(() => {
    if (timerState.isRunning && !isTimerVisible) {
      setIsTimerVisible(true);
    } else if (!timerState.isRunning && isTimerVisible) {
      const timer = document.querySelector('.timer-container');
      if (timer) {
        timer.classList.add('fade-out');
        setTimeout(() => {
          setIsTimerVisible(false);
        }, 500); // Match this with animation duration
      }
    }
  }, [timerState.isRunning, isTimerVisible]);

  useEffect(() => {
    if (timerState.isRunning && !isTimerVisible) {
      setIsFading(false);
      setIsTimerVisible(true);
    } else if (!timerState.isRunning && isTimerVisible) {
      setIsFading(true);
      setTimeout(() => {
        setIsTimerVisible(false);
        setIsFading(false);
      }, 500);
    }
  }, [timerState.isRunning, isTimerVisible]);


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

    const bgInterval = setInterval(fetchBackground, 1000);

    const fetchVideo = async () => {
        try {
          const response = await fetch(`${API_URL}/api/video`);
          const data = await response.json();
          setVideoId(data.videoId);
        } catch (error) {
          console.error('Failed to fetch video:', error);
        }
      };
  
      fetchVideo();

      const videoInterval = setInterval(fetchVideo, 1000);
  
    return () => {
    clearInterval(bgInterval);
    clearInterval(videoInterval);
    };
  }, []);

  return (
    <>
    <GlobalStyle />
    <Container $backgroundImage={backgroundImage}>
    <Logo />
    <Clock />
    {isTimerVisible && <Timer time={timerState.time} className={isFading ? 'fade-out' : ''} />}
    <ContentWrapper>
    <DefaultText 
      $hasVideo={!!videoId}
      $customStyle={landingTextStyles.style}
      $customJapaneseStyle={landingTextStyles.japaneseStyle}
      $isTextFading={isTextFading}
      dangerouslySetInnerHTML={{ __html: customText }}
    />
        {videoId && <YouTubeEmbed videoId={videoId} />}
        </ContentWrapper>
      <MenuScreen />
    </Container>
  </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : '#000000'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const DefaultText = styled.h1`
  position: absolute;
  top: ${props => props.$hasVideo ? '10%' : '50%'};
  opacity: ${props => props.$hasVideo ? 0 : 1};
  transform: translateY(-50%);
  margin: 0;
  z-index: 1;
  ${props => props.$customStyle || css`
    color: transparent;
    font-size: 3.5rem;
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
    background: linear-gradient(300deg, #ffdf00, #ffffff);
    background-size: 300% 300%;
    animation: ${gradient} 12s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
  `}

    opacity: ${props => {
    if (props.$isTextFading) return 0;
    return props.$hasVideo ? 0 : 1;
    }};
    transition: all 0.5s ease-in-out;
    visibility: ${props => props.$isTextFading ? 'visible' : 'visible'};

  .japanese {
    ${props => props.$customJapaneseStyle || ''}
  }

  br {
    margin: 10px 0;
  }

  transition: top 0.5s ease-in-out, opacity 0.5s ease-in-out;
`;

export default LandingScreen;