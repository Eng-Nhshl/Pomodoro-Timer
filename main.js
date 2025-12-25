const timerOptions = {
  Pomodoro: 25,
  'Short Break': 5,
  'Long Break': 15,
};

const timerBackgrounds = {
  Pomodoro: '#f67280',
  'Short Break': '#6c5b7b',
  'Long Break': '#355c7d',
};

const optionsContainer = document.querySelector('.options ul');
const timerDisplay = document.querySelector('#timer');
const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#reset');
const buttons = [startBtn, resetBtn];
const sounds = {
  start: new Audio('sounds/start.mp3'),
  pause: new Audio('sounds/pause.mp3'),
  resume: new Audio('sounds/resume.mp3'),
  reset: new Audio('sounds/reset.mp3'),
  switch: new Audio('sounds/switch.mp3'),
  finish: new Audio('sounds/finish.mp3'),
  secondsLeft: new Audio('sounds/seconds-left.mp3')
};

sounds.start.volume = 0.3;
sounds.pause.volume = 0.3;
sounds.resume.volume = 0.3;
sounds.reset.volume = 0.3;
sounds.switch.volume = 0.4;
sounds.finish.volume = 0.6;
sounds.secondsLeft.volume = 0.5;

let isMuted = false;

function playSound(sound) {
  if (isMuted) return;
  sound.currentTime = 0;
  sound.play();
}

let secondsLeftPlayed = false;

function resetSecondsLeftFlag() {
  secondsLeftPlayed = false;
}

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let minutes = 25;
let seconds = 0;
let intervalId = null;
let timerName = 'Pomodoro';

function updateDisplay() {
  timerDisplay.textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function setProgress(percent) {
  circle.style.strokeDashoffset =
    circumference - (percent / 100) * circumference;
}

function tick() {
  const totalRemaining = minutes * 60 + seconds;

  // 9 seconds warning
  if (totalRemaining === 9 && !secondsLeftPlayed) {
    playSound(sounds.secondsLeft);
    secondsLeftPlayed = true;
  }

  // Finished
  if (minutes === 0 && seconds === 0) {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.textContent = 'Start';

    playSound(sounds.finish);
    return;
  }

  if (seconds === 0) {
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }

  updateDisplay();

  const total = timerOptions[timerName] * 60;
  const elapsed = total - (minutes * 60 + seconds);
  setProgress((elapsed / total) * 100);
}

function resetProgress() {
  setProgress(0);
}

optionsContainer.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  playSound(sounds.switch);

  optionsContainer.querySelectorAll('li')
    .forEach(el => el.classList.remove('active'));

  li.classList.add('active');

  timerName = li.textContent.trim();
  minutes = timerOptions[timerName];
  seconds = 0;

  clearInterval(intervalId);
  intervalId = null;
  startBtn.textContent = 'Start';

  document.body.style.background = timerBackgrounds[timerName];
  buttons.forEach(btn => btn.style.color = timerBackgrounds[timerName]);

  resetProgress();
  resetSecondsLeftFlag();
  updateDisplay();
});


startBtn.addEventListener('click', () => {
  if (intervalId === null) {
    intervalId = setInterval(tick, 1000);

    playSound(startBtn.textContent === 'Start'
      ? sounds.start
      : sounds.resume);

    startBtn.textContent = 'Pause';
    resetSecondsLeftFlag();
  } else {
    clearInterval(intervalId);
    intervalId = null;

    playSound(sounds.pause);
    startBtn.textContent = 'Resume';
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;

  playSound(sounds.reset);

  minutes = timerOptions[timerName];
  seconds = 0;

  updateDisplay();
  resetProgress();
  resetSecondsLeftFlag();

  startBtn.textContent = 'Start';
});

function applyMode(newMode) {
  mode = newMode;

  minutes = timerOptions[mode];
  seconds = 0;

  updateDisplay();
  resetProgress();
  resetSecondsLeftFlag();

  playSound(sounds.switch);
}



/* Init */
optionsContainer.querySelector('li').classList.add('active');
document.body.style.background = timerBackgrounds[timerName];
buttons.forEach(btn => btn.style.color = timerBackgrounds[timerName]);
updateDisplay();
