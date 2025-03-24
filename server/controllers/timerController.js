import { themes } from '../../src/config/display/themes.js';

let timerState = {
    time: 1800,
    isRunning: false,
    style: themes.default.timerStyle || '',
    gradients: themes.default.timerGradients || {
      default: 'linear-gradient(45deg, #ffffff, #ffffff)',
      warning: 'linear-gradient(45deg, #ffffff, #ff7b00)',
      danger: 'linear-gradient(45deg, #ff0000, #ff6666, #ff0000)'
    }
  };
  
  
  let timerInterval;
  
  export const startTimer = () => {
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        // Allow timer to go negative
        timerState.time -= 1;
      }, 1000);
    }
  };
  
  export const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  export const getTimer = (req, res) => {
    res.json(timerState);
  };
  
  export const setTimer = (req, res) => {
    const { time } = req.body;
    timerState.time = time;
    res.json(timerState);
  };
  
  export const toggleTimer = (req, res) => {
    timerState.isRunning = !timerState.isRunning;
    if (timerState.isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
    res.json(timerState);
  };

  export const getTimerGradients = (req, res) => {
    res.json(timerState.gradients);
  };
  
  export const setTimerGradients = (req, res) => {
    timerState.gradients = { ...timerState.gradients, ...req.body };
    res.json(timerState.gradients);
  };

  export const setTimerStyle = (req, res) => {
    const newStyle = req.body.style;
    if (newStyle === undefined) {
      return res.status(400).json({ error: 'Style is required' });
    }
    timerState.style = newStyle;
    res.json({ style: timerState.style });
  };
  
  export const getTimerStyle = (req, res) => {
    res.json({ style: timerState.style });
  };