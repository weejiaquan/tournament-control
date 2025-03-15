import express from 'express';
import cors from 'cors';
import multer from 'multer';  // Add this import
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';  // Add this import
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add this before your app initialization
const bgUploadsDir = path.join(__dirname, 'uploads', 'bgimg');
if (!fs.existsSync(bgUploadsDir)) {
  fs.mkdirSync(bgUploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Store background images in uploads/bgimg
      cb(null, bgUploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // Allow access from network


app.use(cors());
app.use(express.json());

// TIMER API //

let timerState = {
  time: 1800,
  isRunning: false
};

let timerInterval;

// Timer control functions
const startTimer = () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
          // Allow timer to go negative
          timerState.time -= 1;
          
          // Optional: Stop at a certain negative limit
          // if (timerState.time < -300) { // Stop at -5 minutes
          //   stopTimer();
          //   timerState.isRunning = false;
          // }
        }, 1000);
  }
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

app.get('/api/timer', (req, res) => {
  res.json(timerState);
});

app.delete('/api/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(bgUploadsDir, filename);
    
    fs.unlink(filepath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete image' });
      }
      res.json({ success: true });
    });
  });

app.post('/api/timer/set', (req, res) => {
  const { time } = req.body;
  timerState.time = time;
  res.json(timerState);
});

app.post('/api/timer/toggle', (req, res) => {
  timerState.isRunning = !timerState.isRunning;
  if (timerState.isRunning) {
    startTimer();
  } else {
    stopTimer();
  }
  res.json(timerState);
});

// Background image API //

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/bgimg/${req.file.filename}` });
});

app.get('/api/images', (req, res) => {
    fs.readdir(bgUploadsDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read uploads directory' });
      }
      const images = files
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map(file => ({
          url: `/uploads/bgimg/${file}`
        }));
      res.json(images);
    });
  });

let backgroundState = {
    currentBackground: ''
  };

app.post('/api/background', (req, res) => {
    const { backgroundImage } = req.body;
    backgroundState.currentBackground = backgroundImage;
    res.json({ success: true });
  });
  
app.get('/api/background', (req, res) => {
  res.json({ backgroundImage: backgroundState.currentBackground });
});
  
let sceneState = {
  currentScene: 'landing' // or 'timer'
};

//SCENE API//

app.post('/api/scene', (req, res) => {
  const { scene } = req.body;
  sceneState.currentScene = scene;
  res.json({ success: true, currentScene: scene });
});

app.get('/api/scene', (req, res) => {
  res.json({ currentScene: sceneState.currentScene });
});

// MENU API//

// Create directory for menu item uploads
const menuUploadsDir = path.join(__dirname, 'uploads', 'menu');
if (!fs.existsSync(menuUploadsDir)) {
  fs.mkdirSync(menuUploadsDir, { recursive: true });
}

// Configure multer for menu item uploads
const menuStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, menuUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});


const menuUpload = multer({ storage: menuStorage });

let menuState = {
  items: [],
  isVisible: true
};

// Add these endpoints
app.post('/api/menu/upload', menuUpload.single('menuItem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const newItem = {
    id: uuidv4(),
    imageUrl: `/uploads/menu/${req.file.filename}`,
    unavailable: false
  };

  menuState.items.push(newItem);
  res.json(newItem);
});

app.get('/api/menu/items', (req, res) => {
  res.json(menuState.items);
});

app.patch('/api/menu/items/:id/toggle', (req, res) => {
  const item = menuState.items.find(item => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.unavailable = !item.unavailable;
  res.json(item);
});

app.delete('/api/menu/items/:id', (req, res) => {
  const itemIndex = menuState.items.findIndex(item => item.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const item = menuState.items[itemIndex];
  const filename = item.imageUrl.split('/').pop();
  const filepath = path.join(menuUploadsDir, filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete image file' });
    }
    menuState.items.splice(itemIndex, 1);
    res.json({ success: true });
  });
});

app.post('/api/menu/visibility', (req, res) => {
  const { isVisible } = req.body;
  menuState.isVisible = isVisible;
  res.json({ success: true, isVisible });
});

app.get('/api/menu/visibility', (req, res) => {
  res.json({ isVisible: menuState.isVisible });
});

app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});