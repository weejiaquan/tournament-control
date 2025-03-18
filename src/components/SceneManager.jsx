import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';
import LandingScreen from './LandingScreen';
import TimerScreen from './TimerScreen';
import RaffleScreen from './RaffleScreen';
import GlobalStyle from '../styles/GlobalStyle';

const SceneManager = () => {
  const [currentScene, setCurrentScene] = useState('landing');

  useEffect(() => {
    const fetchScene = async () => {
      try {
        const response = await fetch(`${API_URL}/api/scene`);
        const data = await response.json();
        setCurrentScene(data.currentScene);
      } catch (error) {
        console.error('Failed to fetch scene:', error);
      }
    };

    fetchScene();
    const interval = setInterval(fetchScene, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderScene = () => {
    const scenes = {
      landing: {
        component: <LandingScreen />,
        key: "landing"
      },
      timer: {
        component: <TimerScreen />,
        key: "timer"
      },
      raffle: {
        component: <RaffleScreen />,
        key: "raffle"
      }
    };

    const scene = scenes[currentScene] || scenes.landing;

    return (
      <motion.div
        key={scene.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        {scene.component}
      </motion.div>
    );
  };

  return (
    <>
    <GlobalStyle />
    <Container>
    <AnimatePresence mode="wait">
          {renderScene()}
    </AnimatePresence>
  </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000;
`;

export default SceneManager;