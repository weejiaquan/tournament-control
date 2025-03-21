import express from 'express';
const router = express.Router();

let landingState = {
  text: 'Welcome to The Trading Gallery <br /> <span className="japanese">トレーディングギャラリーへようこそ</span>',
  style: {}
};

router.get('/api/landing/text', (req, res) => {
  res.json({ text: landingState.text });
});

router.post('/api/landing/text', (req, res) => {
  const { text } = req.body;
  landingState.text = text;
  res.json({ success: true });
});

router.get('/api/landing/style', (req, res) => {
  res.json(landingState.style);
});

router.post('/api/landing/style', (req, res) => {
  const { style } = req.body;
  landingState.style = style;
  res.json(landingState.style);
});

export default router;