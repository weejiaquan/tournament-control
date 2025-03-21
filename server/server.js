import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import timerRoutes from './routes/timerRoutes.js';
import raffleRoutes from './routes/raffleRoutes.js';
import sceneRoutes from './routes/sceneRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import backgroundRoutes from './routes/backgroundRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import logoRoutes from './routes/logoRoutes.js';
import clockRoutes from './routes/clockRoutes.js';
import landingRoutes from './routes/landingRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import { setupTabletWebSocket } from './websocket/tabletHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

// WebSockets
setupTabletWebSocket(io);

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.use(timerRoutes);
app.use(raffleRoutes);
app.use(sceneRoutes);
app.use(menuRoutes);
app.use(backgroundRoutes);
app.use(videoRoutes);
app.use(logoRoutes);
app.use(clockRoutes);
app.use(landingRoutes);
app.use(themeRoutes);

// Static files
app.use(express.static('dist'));
app.use('/uploads', express.static('uploads'));
app.use('/uploads/bgimg', express.static(path.join('uploads', 'bgimg')));
app.use('/uploads/menu', express.static(path.join('uploads', 'menu')));


// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});