let timerInterval, startTime;
let coins = 0;
let sessionData = null;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const toggleLeaderboardBtn = document.getElementById("toggleLeaderboardBtn");
const timerDisplay = document.getElementById("timer");
const coinsDisplay = document.getElementById("coins");
const lastSessionDisplay = document.getElementById("lastSession");
const leaderboardList = document.getElementById("leaderboardList");
const submitBtn = document.getElementById("submitBtn");
const quoteBox = document.getElementById("quoteBox");

const quotes = [
  "“Be stronger than your strongest excuse.”",
  "“Focus on being productive, not busy.”",
  "“It’s not about having time, it’s about making time.”",
  "“Detox your mind, not just your phone.”",
  "“Discipline is doing it even when you don’t feel like it.”",
  "“Digital detox starts with discipline.”",
  "“You don’t need more time. You need fewer distractions.”",
  "“The real flex is self-control.”",
  "“Being unavailable is the new luxury.”",
  "“Disconnect to reconnect.”",
  "“Silence your phone to hear your thoughts.”",
  "“Less scrolling, more living.”",
  "“Your mind needs space to grow. Unplug.”",
  "“Not everything needs your attention.”",
  "“Focus is the currency of productivity.”",
  "“Time is precious, don’t feed it to your feed.”",
  "“Digital detox is self-love.”",
  "“Airplane mode your life sometimes.”",
  "“You miss life when you're glued to a screen.”",
  "“Pause notifications, play real life.”"
];

function displayRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.innerText = quote;
}

displayRandomQuote();

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

function msToReadable(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
}

startBtn.addEventListener("click", () => {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerDisplay.innerText = formatTime(elapsed);
  }, 1000);

  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  const elapsed = Date.now() - startTime;
  const earnedCoins = Math.max(1, Math.floor(elapsed / 60000)); // 1 coin per minute
  coins += earnedCoins;

  coinsDisplay.innerText = coins;
  lastSessionDisplay.innerText = msToReadable(elapsed);

  sessionData = {
    coins: earnedCoins,
    time: msToReadable(elapsed)
  };

  startBtn.disabled = false;
  stopBtn.disabled = true;
});

submitBtn.addEventListener('click', async () => {
  if (!sessionData) {
    alert("Nothing to submit. Please start and stop a session first.");
    return;
  }

  const username = prompt("Enter your name:");
  if (!username) return;

  const payload = {
    username,
    coins: sessionData.coins,
    time: sessionData.time
  };

  try {
    const res = await fetch('http://localhost:5000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message || "Submitted!");
      fetchLeaderboard();
    } else {
      alert("Submission failed. " + (result.message || ""));
    }
  } catch (err) {
    alert("Submission failed. Is the backend running?");
  }
});

async function fetchLeaderboard() {
  try {
    const res = await fetch('http://localhost:5000/leaderboard');
    const data = await res.json();

    leaderboardList.innerHTML = "";
    data.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${entry.username} — ${entry.coins} Coins (${entry.time})`;
      leaderboardList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load leaderboard", err);
  }
}

toggleLeaderboardBtn.addEventListener("click", () => {
  const leaderboard = document.querySelector(".leaderboard");
  leaderboard.style.display =
    leaderboard.style.display === "none" ? "block" : "none";
  toggleLeaderboardBtn.innerText =
    leaderboard.style.display === "none" ? "Show Leaderboard" : "Hide Leaderboard";
});

// Load leaderboard on start
fetchLeaderboard();
