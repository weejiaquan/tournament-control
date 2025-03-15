import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';
import LandingScreen from './LandingScreen';
import TimerScreen from './TimerScreen';
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

  return (
    <>
    <GlobalStyle />
    <Container>
    <AnimatePresence mode="wait">
      {currentScene === 'landing' ? (
        <motion.div
          key="landing"
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
          <LandingScreen />
        </motion.div>
      ) : (
        <motion.div
          key="timer"
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
          <TimerScreen />
        </motion.div>
      )}
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