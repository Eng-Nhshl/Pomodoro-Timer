// Timer options
const timerOptions = { 'Pomodoro': 25, 'Short Break': 5, 'Long Break': 15 };
const timerBackgrounds = { 'Pomodoro': '#f67280', 'Short Break': '#6c5b7b', 'Long Break': '#355c7d' };

// DOM elements
const optionsContainer = document.querySelector('.options ul');
const timerDisplay = document.querySelector('#timer');
const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#reset');
const buttons = [startBtn, resetBtn];

// Progress ring setup
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

// State
let minutes = 25;
let seconds = 0;
let intervalId = null;
let timerName = 'Pomodoro';

// Display update
function updateDisplay() {
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Tick function
function tick() {
  if (seconds === 0) {
    if (minutes === 0) {
      clearInterval(intervalId);
      intervalId = null;
      startBtn.textContent = 'Start';
      setProgress(100);
      return;
    }
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }
  updateDisplay();
  const totalSeconds = timerOptions[timerName] * 60;
  const elapsedSeconds = totalSeconds - (minutes * 60 + seconds);
  const percent = (elapsedSeconds / totalSeconds) * 100;
  setProgress(percent);
}

// Reset progress
function resetProgress() { setProgress(0); }

// Initialize default option
const defaultOption = optionsContainer.querySelector('li');
defaultOption.classList.add('active');
timerName = defaultOption.textContent.trim();
minutes = timerOptions[timerName];
seconds = 0;
updateDisplay();
document.body.style.background = timerBackgrounds[timerName];
buttons.forEach(btn => btn.style.color = timerBackgrounds[timerName]);
resetProgress();

// Option selection
optionsContainer.addEventListener('click', (e) => {
  const clickedLi = e.target.closest('li');
  if (!clickedLi) return;

  optionsContainer.querySelectorAll('li').forEach(li => li.classList.remove('active'));
  clickedLi.classList.add('active');

  timerName = clickedLi.textContent.trim();
  minutes = timerOptions[timerName];
  seconds = 0;

  if (intervalId !== null) { clearInterval(intervalId); intervalId = null; startBtn.textContent = 'Start'; }

  updateDisplay();
  document.body.style.background = timerBackgrounds[timerName];
  buttons.forEach(btn => btn.style.color = timerBackgrounds[timerName]);
  resetProgress();
});

// Start / Pause
startBtn.addEventListener('click', () => {
  if (intervalId === null) {
    intervalId = setInterval(tick, 1000);
    startBtn.textContent = 'Pause';
  } else {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.textContent = 'Start';
  }
});

// Reset
resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  const activeLi = optionsContainer.querySelector('li.active');
  timerName = activeLi ? activeLi.textContent.trim() : 'Pomodoro';
  minutes = timerOptions[timerName];
  seconds = 0;
  updateDisplay();
  startBtn.textContent = 'Start';
  resetProgress();
});