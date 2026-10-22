
"use strict";

// =====================================
// PORTFOLIO SOUND EFFECTS
// Uses the browser's built-in Web Audio API
// =====================================

(() => {
  const soundToggle = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");
  const soundLabel = document.getElementById("soundLabel");

  // Stop safely if the sound controls are not on this page.
  if (!soundToggle || !soundIcon || !soundLabel) return;

  const STORAGE_KEY = "portfolioSoundEnabled";

  let soundEnabled = false;
  let audioContext = null;
  let lastSoundTime = 0;

  // Read the saved preference.
  try {
    soundEnabled = localStorage.getItem(STORAGE_KEY) === "true";
  } catch (error) {
    soundEnabled = false;
  }

  // Create the audio context only when needed.
  function getAudioContext() {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    return audioContext;
  }

  // Play a short, gentle electronic tone.
  function playTone({
    frequency = 600,
    duration = 0.07,
    volume = 0.035,
    type = "sine",
    endFrequency = null
  } = {}) {
    if (!soundEnabled) return;

    const context = getAudioContext();
    if (!context) return;

    // Prevent rapid repeated sounds from becoming annoying.
    const nowMs = Date.now();
    if (nowMs - lastSoundTime < 45) return;
    lastSoundTime = nowMs;

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    const startTime = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    if (endFrequency !== null) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, endFrequency),
        startTime + duration
      );
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(
      volume,
      startTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);

    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }

  // Sound types available to the portfolio.
  const sounds = {
    click() {
      playTone({
        frequency: 650,
        endFrequency: 520,
        duration: 0.045,
        volume: 0.025
      });
    },

    success() {
      if (!soundEnabled) return;
      playTone({
        frequency: 520,
        duration: 0.07,
        volume: 0.03
      });

      window.setTimeout(() => {
        playTone({
          frequency: 780,
          duration: 0.1,
          volume: 0.03
        });
      }, 85);
    },

    error() {
      playTone({
        frequency: 260,
        endFrequency: 180,
        duration: 0.12,
        volume: 0.025,
        type: "triangle"
      });
    }
  };

  // Make sounds available to other scripts if needed.
  window.portfolioSounds = sounds;

  function updateSoundButton() {
    soundToggle.setAttribute(
      "aria-pressed",
      String(soundEnabled)
    );

    soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
    soundLabel.textContent = soundEnabled ? "Sound On" : "Sound Off";

    soundToggle.setAttribute(
      "aria-label",
      soundEnabled
        ? "Turn sound effects off"
        : "Turn sound effects on"
    );

    soundToggle.title = soundEnabled
      ? "Sound effects are on"
      : "Sound effects are off";
  }

  function savePreference() {
    try {
      localStorage.setItem(STORAGE_KEY, String(soundEnabled));
    } catch (error) {
      // Sound still works for this visit if storage is unavailable.
    }
  }

  // Toggle sound effects.
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    updateSoundButton();
    savePreference();

    // The click is a user gesture, allowing audio to start.
    if (soundEnabled) {
      const context = getAudioContext();

      if (context && context.state === "suspended") {
        context.resume().catch(() => {});
      }

      sounds.success();
    }
  });

  // Add a quiet click sound to buttons and links.
  document.addEventListener("click", (event) => {
    if (!soundEnabled) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const control = target.closest("button, a");

    if (!control || control.disabled) return;
    if (control === soundToggle) return;

    // Do not sound when clicking a link that opens a new tab.
    if (
      control instanceof HTMLAnchorElement &&
      control.target === "_blank"
    ) {
      return;
    }

    sounds.click();
  });

  // Initialize the button without playing anything on page load.
  updateSoundButton();
})();
