const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');

// POST: Save new challenge
router.post('/add', async (req, res) => {
  try {
    const { username, duration, coinsEarned } = req.body;
    const newChallenge = new Challenge({ username, duration, coinsEarned });
    await newChallenge.save();
    res.status(201).json({ message: '✅ Challenge saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to save challenge' });
  }
});

// GET: All challenges for a user
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const data = await Challenge.find({ username }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch challenges' });
  }
});

module.exports = router;
