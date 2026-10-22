"use strict";

const guessDifficulty = document.getElementById("guessDifficulty");
const guessRange = document.getElementById("guessRange");
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const guessMessage = document.getElementById("guessMessage");
const guessAttempts = document.getElementById("guessAttempts");
const guessBest = document.getElementById("guessBest");
const guessRestart = document.getElementById("guessRestart");
const guessSubmit = document.getElementById("guessSubmit");

let maxNumber = 100;
let secretNumber;
let attempts = 0;
let gameOver = false;

let bestScores = {
  50: Infinity,
  100: Infinity,
  500: Infinity
};

function startGuessGame() {
  maxNumber = Number(guessDifficulty.value);
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;

  attempts = 0;
  gameOver = false;

  guessAttempts.textContent = "0";
  guessRange.textContent = `Guess a number from 1 to ${maxNumber}`;
  guessMessage.textContent = "Enter your first guess to begin!";

  guessInput.min = "1";
  guessInput.max = String(maxNumber);
  guessInput.value = "";
  guessInput.disabled = false;
  guessSubmit.disabled = false;

  updateBestScore();
  guessInput.focus();
}

function updateBestScore() {
  const best = bestScores[maxNumber];

  guessBest.textContent = Number.isFinite(best) ? best : "--";
}

guessForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (gameOver) return;

  const guess = Number(guessInput.value);

  if (
    !Number.isInteger(guess) ||
    guess < 1 ||
    guess > maxNumber
  ) {
    guessMessage.textContent =
      `Enter a whole number between 1 and ${maxNumber}.`;
    return;
  }

  attempts++;
  guessAttempts.textContent = attempts;

  if (guess === secretNumber) {
    gameOver = true;

    guessMessage.textContent =
      `Correct! You found ${secretNumber} in ${attempts} attempt(s)! 🎉`;

    if (attempts < bestScores[maxNumber]) {
      bestScores[maxNumber] = attempts;
      updateBestScore();
    }

    guessInput.disabled = true;
    guessSubmit.disabled = true;
    return;
  }

  if (guess < secretNumber) {
    guessMessage.textContent =
      guess <= secretNumber - 10
        ? "Too low! Try a much higher number. ⬆️"
        : "A little too low! Try higher. ⬆️";
  } else {
    guessMessage.textContent =
      guess >= secretNumber + 10
        ? "Too high! Try a much lower number. ⬇️"
        : "A little too high! Try lower. ⬇️";
  }

  guessInput.value = "";
  guessInput.focus();
});

guessDifficulty.addEventListener("change", startGuessGame);
guessRestart.addEventListener("click", startGuessGame);

startGuessGame();