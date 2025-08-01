const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connectionnode
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB error:", err));

// Schema + Model
const challengeSchema = new mongoose.Schema({
  username: String,
  coins: Number,
  time: String
});
const Challenge = mongoose.model('Challenge', challengeSchema);

// Submit endpoint
app.post('/submit', async (req, res) => {
  const { username, coins, time } = req.body;
  if (!username || !coins || !time) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const newChallenge = new Challenge({ username, coins, time });
    await newChallenge.save();
    res.json({ message: 'Challenge submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leaderboard endpoint
app.get('/leaderboard', async (req, res) => {
  try {
    const top = await Challenge.find().sort({ coins: -1 }).limit(5);
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

// Start server
app.get('/test', (req, res) => {
  res.send('Backend is working!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
