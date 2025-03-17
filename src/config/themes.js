export const themes = {
    default: {
        name: 'Default',
        backgroundUrl: '/assets/timer/ttg_main.png',
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
          default: 'linear-gradient(45deg, #ffdf00, #ffffff)',
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
            top: 0;
            right: 1%;
            color: transparent;
            font-size: 5rem;
            font-family: 'DM Mono', sans-serif;

            background: linear-gradient(300deg, #ffff00, #ffffff);
            background-size: 300% 300%;
            -webkit-text-stroke-color: black;
            -webkit-text-stroke-width: 1.50px; 
            -webkit-background-clip: text;
            background-clip: text;
          `
        }
      },
        cyberpunk:
      {
        name: 'Cyberpunk',
        backgroundUrl: '/backgrounds/cyberpunk.jpg',
        timerStyle: `
          color: transparent;
          font-size: 20rem;
          font-family: 'DM Mono', sans-serif;
          position: absolute;
          bottom: 5%;
          right: 5%;
          text-shadow: 
            0 0 10px #0ff,
            0 0 20px #0ff,
            0 0 30px #0ff,
            0 0 40px #0ff;`,
        timerGradients: {
          default: 'linear-gradient(45deg, #00ffff, #ff00ff)',
          warning: 'linear-gradient(45deg, #ff00ff, #ffff00)',
          danger: 'linear-gradient(45deg, #ff0000, #ff00ff)'
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
            background: linear-gradient(300deg, #ff00ff, #00ffff);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
          `,
          japaneseStyle: `
            font-family: 'Noto Sans JP', sans-serif;
            font-size: 3.2rem;
          `
        }
      }
};