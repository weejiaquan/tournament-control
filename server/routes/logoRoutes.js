import express from 'express';
const router = express.Router();

let logoState = {
  url: '',
  style: ''
};

router.get('/api/logo', (req, res) => {
  res.json(logoState);
});

router.post('/api/logo', (req, res) => {
  const { url, style } = req.body;
  if (url !== undefined) logoState.url = url;
  if (style !== undefined) logoState.style = style;
  res.json(logoState);
});

export default router;