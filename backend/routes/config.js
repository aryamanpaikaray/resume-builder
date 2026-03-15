const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

const ACCESS_WINDOW_MINUTES = 20;

// GET /api/config/access
router.get('/access', async (req, res) => {
  try {
    const config = await Config.findOne({ key: 'deploymentTime' });
    if (!config) {
      return res.json({ allowed: false, message: 'Deployment time not configured.' });
    }

    const deploymentTime = new Date(config.value);
    const now = new Date();
    const diffMs = now - deploymentTime;
    const diffMinutes = diffMs / (1000 * 60);

    const allowed = diffMinutes <= ACCESS_WINDOW_MINUTES;
    const remainingSeconds = Math.max(0, Math.ceil((ACCESS_WINDOW_MINUTES * 60) - (diffMs / 1000)));

    res.json({
      allowed,
      remainingSeconds,
      deploymentTime: config.value,
      diffMinutes: Math.round(diffMinutes),
      message: allowed ? null : 'Resume submission time has expired.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/config/reset-timer
// Call this whenever you want to start a fresh 20-minute window
router.post('/reset-timer', async (req, res) => {
  try {
    const now = new Date().toISOString();
    await Config.findOneAndUpdate(
      { key: 'deploymentTime' },
      { $set: { value: now } },
      { upsert: true, new: true }
    );
    res.json({ success: true, deploymentTime: now, message: 'Timer reset. 20 minutes starts now.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;