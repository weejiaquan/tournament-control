import express from 'express';
const router = express.Router();

let bannerState = {
  text: 'banner',
  style: {}
};

router.get('/api/landing/text', (req, res) => {
  res.json({ text: bannerState.text });
});

router.post('/api/landing/text', (req, res) => {
  const { text } = req.body;
  bannerState.text = text;
  res.json({ success: true });
});

router.get('/api/landing/style', (req, res) => {
  res.json(bannerState.style);
});

router.post('/api/landing/style', (req, res) => {
  const { style } = req.body;
  bannerState.style = style;
  res.json(bannerState.style);
});

export default router;