
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const picker = document.getElementById("game-picker");
  const memory = document.getElementById("memory-game");
  const guessing = document.getElementById("number-game");

  if (!picker || !memory || !guessing) {
    console.error("Game selection sections could not be found.");
    return;
  }

  function showPicker() {
    picker.hidden = false;
    memory.hidden = true;
    guessing.hidden = true;

    picker.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function openGame(game) {
    if (game !== "memory" && game !== "guess") return;

    picker.hidden = true;
    memory.hidden = game !== "memory";
    guessing.hidden = game !== "guess";

    const selectedGame = game === "memory" ? memory : guessing;

    selectedGame.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  picker.querySelectorAll("[data-open-game]").forEach(function (button) {
    button.addEventListener("click", function () {
      openGame(button.dataset.openGame);
    });
  });

  [memory, guessing].forEach(function (section) {
    const container = section.querySelector(".container");

    if (!container) return;

    const backButton = document.createElement("button");

    backButton.type = "button";
    backButton.className = "btn btn-outline game-picker-back";
    backButton.textContent = "← Choose Another Game";
    backButton.addEventListener("click", showPicker);

    container.insertBefore(backButton, container.firstChild);
  });

  showPicker();
});
