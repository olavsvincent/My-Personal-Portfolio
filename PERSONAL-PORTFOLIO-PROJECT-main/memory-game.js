
(() => {
  const grid = document.getElementById("memoryGrid");
  const startButton = document.getElementById("memoryStart");
  const restartButton = document.getElementById("memoryRestart");
  const movesElement = document.getElementById("memoryMoves");
  const timeElement = document.getElementById("memoryTime");
  const pairsElement = document.getElementById("memoryPairs");
  const messageElement = document.getElementById("memoryMessage");
  const bestElement = document.getElementById("memoryBest");

  if (!grid || !startButton || !restartButton) return;

  const symbols = ["💻", "⚙️", "🚀", "🎮", "💡", "🔋", "🧠", "🌐"];
  const totalPairs = symbols.length;

  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let locked = true;
  let moves = 0;
  let matchedPairs = 0;
  let elapsedSeconds = 0;
  let timerId = null;
  let started = false;
  let gameFinished = false;

  const BEST_KEY = "vincentPortfolioMemoryBest";

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remaining = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remaining}`;
  }

  function updateStats() {
    movesElement.textContent = moves;
    timeElement.textContent = formatTime(elapsedSeconds);
    pairsElement.textContent = `${matchedPairs} / ${totalPairs}`;
  }

  function showBest() {
    try {
      const best = JSON.parse(localStorage.getItem(BEST_KEY));
      bestElement.textContent = best
        ? `${best.time} · ${best.moves} moves`
        : "Not yet recorded";
    } catch {
      bestElement.textContent = "Not yet recorded";
    }
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    if (timerId !== null || gameFinished) return;

    timerId = setInterval(() => {
      elapsedSeconds++;
      timeElement.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createDeck() {
    return shuffle(
      symbols.flatMap((symbol, index) => [
        { symbol, pairId: index },
        { symbol, pairId: index }
      ])
    );
  }

  function createCard(cardData, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.index = index;
    card.dataset.pairId = cardData.pairId;
    card.setAttribute("aria-label", `Hidden card ${index + 1}`);
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-card-back" aria-hidden="true">?</span>
        <span class="memory-card-front" aria-hidden="true">${cardData.symbol}</span>
      </span>
    `;

    card.addEventListener("click", () => flipCard(card));
    return card;
  }

  function renderBoard() {
    grid.replaceChildren();
    deck.forEach((cardData, index) => {
      grid.appendChild(createCard(cardData, index));
    });
  }

  function startGame() {
    stopTimer();

    deck = createDeck();
    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    matchedPairs = 0;
    elapsedSeconds = 0;
    started = false;
    gameFinished = false;

    updateStats();
    renderBoard();

    messageElement.textContent = "Find all eight pairs!";
    startButton.textContent = "New Game";
  }

  function flipCard(card) {
    if (locked || gameFinished) return;
    if (card.classList.contains("is-flipped") ||
        card.classList.contains("is-matched")) return;

    if (!started) {
      started = true;
      startTimer();
      messageElement.textContent = "Looking good. Keep finding those pairs!";
    }

    card.classList.add("is-flipped");
    card.setAttribute("aria-pressed", "true");
    card.setAttribute("aria-label", `Card showing ${deck[Number(card.dataset.index)].symbol}`);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    updateStats();

    if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");
      firstCard.disabled = true;
      secondCard.disabled = true;

      matchedPairs++;
      firstCard = null;
      secondCard = null;
      updateStats();

      if (matchedPairs === totalPairs) {
        finishGame();
      } else {
        messageElement.textContent = "Match found! Keep going.";
      }
      return;
    }

    locked = true;
    messageElement.textContent = "Not a match. Try to remember their positions.";

    const cardA = firstCard;
    const cardB = secondCard;

    setTimeout(() => {
      cardA.classList.remove("is-flipped");
      cardB.classList.remove("is-flipped");
      cardA.setAttribute("aria-pressed", "false");
      cardB.setAttribute("aria-pressed", "false");
      cardA.setAttribute("aria-label", `Hidden card ${Number(cardA.dataset.index) + 1}`);
      cardB.setAttribute("aria-label", `Hidden card ${Number(cardB.dataset.index) + 1}`);

      firstCard = null;
      secondCard = null;
      locked = false;
    }, 750);
  }

  function finishGame() {
    gameFinished = true;
    locked = true;
    stopTimer();

    messageElement.textContent =
      `Congratulations! You matched every pair in ${moves} moves and ${formatTime(elapsedSeconds)}.`;

    try {
      const previousBest = JSON.parse(localStorage.getItem(BEST_KEY));
      const isBetter = !previousBest ||
        elapsedSeconds < previousBest.seconds ||
        (elapsedSeconds === previousBest.seconds && moves < previousBest.moves);

      if (isBetter) {
        localStorage.setItem(BEST_KEY, JSON.stringify({
          seconds: elapsedSeconds,
          time: formatTime(elapsedSeconds),
          moves
        }));
        messageElement.textContent += " New personal best!";
      }
    } catch {
      // The game still works if local storage is unavailable.
    }

    showBest();
  }

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);

  showBest();
  updateStats();
  renderBoard();
})();

(() => {
  const grid = document.getElementById("memoryGrid");
  const startButton = document.getElementById("memoryStart");
  const restartButton = document.getElementById("memoryRestart");
  const movesElement = document.getElementById("memoryMoves");
  const timeElement = document.getElementById("memoryTime");
  const pairsElement = document.getElementById("memoryPairs");
  const messageElement = document.getElementById("memoryMessage");
  const bestElement = document.getElementById("memoryBest");

  if (!grid || !startButton || !restartButton) return;

  const symbols = ["💻", "⚙️", "🚀", "🎮", "💡", "🔋", "🧠", "🌐"];
  const totalPairs = symbols.length;

  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let locked = true;
  let moves = 0;
  let matchedPairs = 0;
  let elapsedSeconds = 0;
  let timerId = null;
  let started = false;
  let gameFinished = false;

  const BEST_KEY = "vincentPortfolioMemoryBest";

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remaining = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remaining}`;
  }

  function updateStats() {
    movesElement.textContent = moves;
    timeElement.textContent = formatTime(elapsedSeconds);
    pairsElement.textContent = `${matchedPairs} / ${totalPairs}`;
  }

  function showBest() {
    try {
      const best = JSON.parse(localStorage.getItem(BEST_KEY));
      bestElement.textContent = best
        ? `${best.time} · ${best.moves} moves`
        : "Not yet recorded";
    } catch {
      bestElement.textContent = "Not yet recorded";
    }
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    if (timerId !== null || gameFinished) return;

    timerId = setInterval(() => {
      elapsedSeconds++;
      timeElement.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createDeck() {
    return shuffle(
      symbols.flatMap((symbol, index) => [
        { symbol, pairId: index },
        { symbol, pairId: index }
      ])
    );
  }

  function createCard(cardData, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.index = index;
    card.dataset.pairId = cardData.pairId;
    card.setAttribute("aria-label", `Hidden card ${index + 1}`);
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-card-back" aria-hidden="true">?</span>
        <span class="memory-card-front" aria-hidden="true">${cardData.symbol}</span>
      </span>
    `;

    card.addEventListener("click", () => flipCard(card));
    return card;
  }

  function renderBoard() {
    grid.replaceChildren();
    deck.forEach((cardData, index) => {
      grid.appendChild(createCard(cardData, index));
    });
  }

  function startGame() {
    stopTimer();

    deck = createDeck();
    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    matchedPairs = 0;
    elapsedSeconds = 0;
    started = false;
    gameFinished = false;

    updateStats();
    renderBoard();

    messageElement.textContent = "Find all eight pairs!";
    startButton.textContent = "New Game";
  }

  function flipCard(card) {
    if (locked || gameFinished) return;
    if (card.classList.contains("is-flipped") ||
        card.classList.contains("is-matched")) return;

    if (!started) {
      started = true;
      startTimer();
      messageElement.textContent = "Looking good. Keep finding those pairs!";
    }

    card.classList.add("is-flipped");
    card.setAttribute("aria-pressed", "true");
    card.setAttribute("aria-label", `Card showing ${deck[Number(card.dataset.index)].symbol}`);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    updateStats();

    if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");
      firstCard.disabled = true;
      secondCard.disabled = true;

      matchedPairs++;
      firstCard = null;
      secondCard = null;
      updateStats();

      if (matchedPairs === totalPairs) {
        finishGame();
      } else {
        messageElement.textContent = "Match found! Keep going.";
      }
      return;
    }

    locked = true;
    messageElement.textContent = "Not a match. Try to remember their positions.";

    const cardA = firstCard;
    const cardB = secondCard;

    setTimeout(() => {
      cardA.classList.remove("is-flipped");
      cardB.classList.remove("is-flipped");
      cardA.setAttribute("aria-pressed", "false");
      cardB.setAttribute("aria-pressed", "false");
      cardA.setAttribute("aria-label", `Hidden card ${Number(cardA.dataset.index) + 1}`);
      cardB.setAttribute("aria-label", `Hidden card ${Number(cardB.dataset.index) + 1}`);

      firstCard = null;
      secondCard = null;
      locked = false;
    }, 750);
  }

  function finishGame() {
    gameFinished = true;
    locked = true;
    stopTimer();

    messageElement.textContent =
      `Congratulations! You matched every pair in ${moves} moves and ${formatTime(elapsedSeconds)}.`;

    try {
      const previousBest = JSON.parse(localStorage.getItem(BEST_KEY));
      const isBetter = !previousBest ||
        elapsedSeconds < previousBest.seconds ||
        (elapsedSeconds === previousBest.seconds && moves < previousBest.moves);

      if (isBetter) {
        localStorage.setItem(BEST_KEY, JSON.stringify({
          seconds: elapsedSeconds,
          time: formatTime(elapsedSeconds),
          moves
        }));
        messageElement.textContent += " New personal best!";
      }
    } catch {
      // The game still works if local storage is unavailable.
    }

    showBest();
  }

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);

  showBest();
  updateStats();
  renderBoard();
})();
