import express from 'express';
const router = express.Router();

let clockStyle = {
  style: ''
};

router.get('/api/clock/style', (req, res) => {
  res.json(clockStyle);
});

router.post('/api/clock/style', (req, res) => {
  const { style } = req.body;
  if (style !== undefined) clockStyle.style = style;
  res.json(clockStyle);
});

export default router;