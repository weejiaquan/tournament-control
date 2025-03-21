export const themes = {
  default: {
    name: 'Default',
    backgroundUrl: '../assets/timer/ttg_main.png',
    timerStyle: `
          color: transparent;
          font-size: 25rem;
          font-family: 'DM Mono', sans-serif;
          text-align: center;
          letter-spacing: 2px;
          line-height: 1.5;
          padding: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          -webkit-text-stroke-color: black;
          -webkit-text-stroke-width: 5.00px; 
            `,
    logo: {
      url: '/assets/timer/ttg_logo_white.png',
      style: `
            position: absolute;
            top: 2%;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: auto;
            z-index: 2;
          `
    },
    timerGradients: {
      default: 'linear-gradient(45deg, #ffffff, #ffffff)',
      warning: 'linear-gradient(45deg, #ffffff, #ff7b00)',
      danger: 'linear-gradient(45deg, #ff0000, #ff6666, #ff0000)'
    },
    landingText: {
      style: `
            color: transparent;
            font-size: 3.5rem;
            font-family: 'DM Sans', sans-serif;
            text-shadow: 
              0 0 7px rgba(255,255,255,0.2),
              0 0 10px rgba(255,255,255,0.2),
              0 0 21px rgba(255,255,255,0.2),
              0 0 42px rgba(255,255,255,0.3),
              0 0 82px rgba(255,255,255,0.1);
            background: linear-gradient(300deg, #004aad, #ffffff);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            text-align: center;
          `,
      japaneseStyle: `
            font-family: 'Noto Sans JP', sans-serif;
            font-size: 3.2rem;
          `
    },
    clockStyle: {
      style: `
            position: fixed;
            top: 5%;
            right: 3%;
            color: transparent;
            font-size: 5rem;
            font-family: 'DM Mono', sans-serif;
            background: linear-gradient(300deg, #ffffff, #ffffff);
            background-size: 300% 300%;
            -webkit-text-stroke-color: black;
            -webkit-text-stroke-width: 1.50px; 
            -webkit-background-clip: text;
            background-clip: text;
          `
    },
    raffleStyle: {
      container: `
              background-image: url('/assets/timer/ttg_main.png');
              min-height: 100vh;
              padding: 2rem;
          `,
      wheel: {
        fontSize: 32,
        outerBorderColor: '#fff',
        outerBorderWidth: 3,
        innerBorderColor: 'rgba(255, 255, 255, 0.3)',
        radiusLineColor: 'rgba(255, 255, 255, 0.2)',
        radiusLineWidth: 2,
        textColors: ['#ffffff'],
        spinDuration: 0.8
      },
      winner: `
              color: transparent;
              font-size: 4rem;
              font-family: 'DM Sans', sans-serif;
              text-align: center;
              margin-top: 2rem;
              background: linear-gradient(300deg, #ffdf00, #ffffff);
              background-size: 300% 300%;
              -webkit-background-clip: text;
              background-clip: text;
              animation: fadeIn 1s ease-in;

              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
              }
          `,
      waitingMessage: `
              color: rgba(255, 255, 255, 0.7);
              font-size: 2rem;
              font-family: 'DM Sans', sans-serif;
              text-align: center;
          `
    }
  },
  cyberpunk:
  {
    name: 'Yonaka',
    backgroundUrl: '../assets/timer/yonaka_main.png',
    timerStyle: `
          color: transparent;
          font-size: 20rem;
          font-family: 'DM Mono', sans-serif;
          text-align: center;
          letter-spacing: 2px;
          line-height: 1.5;
          padding: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          -webkit-text-stroke-color: black;
          -webkit-text-stroke-width: 5.00px; 
            `,
    logo: {
      url: '',
      style: `
            position: absolute;
            top: 2%;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: auto;
            z-index: 2;
          `
    },
    timerGradients: {
      default: 'linear-gradient(45deg, #ffffff, #ffffff)',
      warning: 'linear-gradient(45deg, #ffffff, #ff7b00)',
      danger: 'linear-gradient(45deg, #ff0000, #ff6666, #ff0000)'
    },
    landingText: {
      style: `
            color: transparent;
            font-size: 3.5rem;
            font-family: 'DM Sans', sans-serif;
            text-shadow: 
              0 0 7px rgba(255,255,255,0.2),
              0 0 10px rgba(255,255,255,0.2),
              0 0 21px rgba(255,255,255,0.2),
              0 0 42px rgba(255,255,255,0.3),
              0 0 82px rgba(255,255,255,0.1);
            background: linear-gradient(300deg, #004aad, #ffffff);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            text-align: center;
          `,
      japaneseStyle: `
            font-family: 'Noto Sans JP', sans-serif;
            font-size: 3.2rem;
          `
    },
    clockStyle: {
      style: `
            position: fixed;
            top: 5%;
            right: 3%;
            color: transparent;
            font-size: 5rem;
            font-family: 'DM Mono', sans-serif;
            background: linear-gradient(300deg, #ffffff, #ffffff);
            background-size: 300% 300%;
            -webkit-text-stroke-color: black;
            -webkit-text-stroke-width: 1.50px; 
            -webkit-background-clip: text;
            background-clip: text;
          `
    },
    raffleStyle: {
      container: `
              background-image: url('/assets/timer/ttg_main.png');
              min-height: 100vh;
              padding: 2rem;
          `,
      wheel: {
        fontSize: 32,
        outerBorderColor: '#fff',
        outerBorderWidth: 3,
        innerBorderColor: 'rgba(255, 255, 255, 0.3)',
        radiusLineColor: 'rgba(255, 255, 255, 0.2)',
        radiusLineWidth: 2,
        textColors: ['#ffffff'],
        spinDuration: 0.8
      },
      winner: `
              color: transparent;
              font-size: 4rem;
              font-family: 'DM Sans', sans-serif;
              text-align: center;
              margin-top: 2rem;
              background: linear-gradient(300deg, #ffdf00, #ffffff);
              background-size: 300% 300%;
              -webkit-background-clip: text;
              background-clip: text;
              animation: fadeIn 1s ease-in;

              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
              }
          `,
      waitingMessage: `
              color: rgba(255, 255, 255, 0.7);
              font-size: 2rem;
              font-family: 'DM Sans', sans-serif;
              text-align: center;
          `
    }
  }
};