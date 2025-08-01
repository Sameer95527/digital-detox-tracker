const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // in minutes
  coinsEarned: { type: Number, required: true }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);

