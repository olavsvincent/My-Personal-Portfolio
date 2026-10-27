(() => {
  "use strict";

  // Prevent duplicate players on one page.
  if (document.getElementById("portfolioMusicPlayer")) return;

  const tracks = [
    {
      title: "I GOT YOU",
      artist: "TWICE",
      group: "TWICE",
      src: "music/IGOTYOU.mp3",
    },
    {
      title: "Strategy",
      artist: "TWICE",
      group: "TWICE",
      src: "music/STRATEGY.mp3",
    },
    {
      title: "Alcohol-Free",
      artist: "TWICE",
      group: "TWICE",
      src: "music/ALCOHOLFREE.mp3",
    },
    {
      title: "SET ME FREE",
      artist: "TWICE",
      group: "TWICE",
      src: "music/SETMEFREE.mp3",
    },
    {
      title: "Feel Special",
      artist: "TWICE",
      group: "TWICE",
      src: "music/FEELSPECIAL.mp3",
    },
    {
      title: "TT",
      artist: "TWICE",
      group: "TWICE",
      src: "music/TT.mp3",
    },
    {
      title: "CHEER UP",
      artist: "TWICE",
      group: "TWICE",
      src: "music/CHEERUP.mp3",
    },
    {
      title: "What Is Love?",
      artist: "TWICE",
      group: "TWICE",
      src: "music/WHATISLOVE.mp3",
    },
    {
      title: "Heart Shaker",
      artist: "TWICE",
      group: "TWICE",
      src: "music/HEARTSHAKER.mp3",
    },
    {
      title: "I CAN'T STOP ME",
      artist: "TWICE",
      group: "TWICE",
      src: "music/ICANTSTOPME.mp3",
    },
    {
      title: "LIKEY",
      artist: "TWICE",
      group: "TWICE",
      src: "music/LIKEY.mp3",
    },
    {
      title: "The Feels",
      artist: "TWICE",
      group: "TWICE",
      src: "music/THEFEELS.mp3",
    },
    {
      title: "THIS IS FOR",
      artist: "TWICE",
      group: "TWICE",
      src: "music/THISISFOR.mp3",
    },
    {
      title: "Talk That Talk",
      artist: "TWICE",
      group: "TWICE",
      src: "music/TALKTHATTALK.mp3",
    },
    {
      title: "SEOUL CITY",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/SEOULCITY.mp3",
    },
    {
      title: "DRACULA",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/DRACULA.mp3",
    },
    {
      title: "LIKE JENNIE",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/LIKEJENNIE.mp3",
    },
    {
      title: "LESS THAN A LOVER",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/LESSTHANALOVER.mp3",
    },
    {
      title: "MANTRA",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/MANTRA.mp3",
    },
    {
      title: "ZEN",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/ZEN.mp3",
    },{
      title: "SOLO",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/SOLO.mp3",
    },{
      title: "EXTRA L",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/EXTRAL.mp3",
    },{
      title: "HANDLEBARS",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/HANDLEBARS.mp3",
    },{
      title: "FALLEN ANGEL",
      artist: "JENNIE",
      group: "JENNIE",
      src: "music/FALLENANGEL.mp3",
    },
     {
    title: "Shinobi",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/SHINOBI.mp3"
  },
  {
    title: "Munting Paraiso",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/MUNTINGPARAISO.mp3"
  },
  {
    title: "Ilalim No. 1",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/ILALIMNO1.mp3"
  },
  {
    title: "Boy M",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/BOYM.mp3"
  },
  {
    title: "Iraya",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/IRAYA.mp3"
  },
  {
    title: "Alam Ko Na",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/ALAMKONA.mp3"
  },
  {
    title: "Maikee's Letter",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/MAIKEESLETTER.mp3"
  },
  {
    title: "Masiram",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/MASIRAM.mp3"
  },
  {
    title: "Co-Pilot",
    artist: "OPM",
    group: "OPM / Filipino Songs",
    src: "music/COPILOT.mp3"
  }
];

  const STORAGE_KEY = "portfolioMusicPlayerState";

  function readSavedState() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  const savedState = readSavedState();

  let currentIndex =
    Number.isInteger(savedState?.index) &&
    savedState.index >= 0 &&
    savedState.index < tracks.length
      ? savedState.index
      : 0;

  let activeGroup = "All";
  let shuffleEnabled = false;
  let isSeeking = false;
  let lastSavedTime = 0;
  let savedVolume =
    typeof savedState?.volume === "number"
      ? clamp(savedState.volume, 0, 1)
      : 0.7;

  const audio = new Audio();
  audio.preload = "metadata";
  audio.volume = savedVolume;

  // Build the player.
  const root = document.createElement("div");
  root.id = "portfolioMusicPlayer";

  root.innerHTML = `
    <div class="mp-shell mp-collapsed" id="mpShell">

      <div class="mp-header">
        <div class="mp-art" aria-hidden="true">♫</div>

        <div class="mp-track-heading">
          <div class="mp-eyebrow">
            <span class="mp-equalizer" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            PORTFOLIO RADIO
          </div>

          <p class="mp-title" id="mpTitle">Your Music</p>
          <div class="mp-artist" id="mpArtist">Add your own playlist</div>
        </div>

        <button
          class="mp-icon-button"
          id="mpExpand"
          type="button"
          aria-label="Maximize music player"
          aria-expanded="false"
          title="Maximize music player"
        >
          <span class="mp-collapse-icon" id="mpCollapseIcon" aria-hidden="true">+</span>
        </button>
      </div>

      <div class="mp-progress-area">
        <input
          class="mp-progress"
          id="mpProgress"
          type="range"
          min="0"
          max="100"
          value="0"
          step="0.1"
          aria-label="Song progress"
        />

        <div class="mp-times">
          <span id="mpCurrentTime">0:00</span>
          <span id="mpDuration">0:00</span>
        </div>
      </div>

      <div class="mp-controls">
        <button
          class="mp-icon-button"
          id="mpPrevious"
          type="button"
          aria-label="Previous song"
          title="Previous song"
        >⏮</button>

        <button
          class="mp-play"
          id="mpPlay"
          type="button"
          aria-label="Play"
          title="Play"
        >▶</button>

        <button
          class="mp-icon-button"
          id="mpNext"
          type="button"
          aria-label="Next song"
          title="Next song"
        >⏭</button>

        <button
          class="mp-icon-button"
          id="mpShuffle"
          type="button"
          aria-label="Toggle shuffle"
          aria-pressed="false"
          title="Toggle shuffle"
        >🔀</button>
      </div>

      <div class="mp-volume-row">
        <span aria-hidden="true">♪</span>

        <input
          class="mp-volume"
          id="mpVolume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          aria-label="Volume"
        />

        <span class="mp-volume-value" id="mpVolumeValue">70%</span>

        <button
          class="mp-icon-button"
          id="mpMute"
          type="button"
          aria-label="Mute"
          title="Mute"
        >🔊</button>
      </div>

      <div class="mp-status" id="mpStatus" role="status" aria-live="polite">
        Your player is ready
      </div>

      <div class="mp-panel" id="mpPanel">
        <div class="mp-panel-inner">

          <div class="mp-panel-top">
            <h3 class="mp-panel-title">Your Playlist</h3>
            <span class="mp-count" id="mpCount">0 tracks</span>
          </div>

          <input
            class="mp-search"
            id="mpSearch"
            type="search"
            placeholder="Search songs or artists..."
            aria-label="Search playlist"
          />

          <div class="mp-filters" id="mpFilters"></div>
          <div class="mp-list" id="mpList"></div>

        </div>
      </div>

    </div>
  `;

  document.body.appendChild(root);

  // Automatically load this player's CSS file.
  const currentScript = document.currentScript;
  const scriptURL = currentScript?.src || "";
  const cssURL = scriptURL
    ? new URL("music-player.css", scriptURL).href
    : "music-player.css";

  if (!document.querySelector("[data-music-player-css]")) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = cssURL;
    stylesheet.dataset.musicPlayerCss = "true";
    document.head.appendChild(stylesheet);
  }

  const $ = (id) => document.getElementById(id);

  const shell = $("mpShell");

  // Floating logo position and drag behavior.
  const logo = root.querySelector(".mp-art");
  const positionKey = "portfolioMusicLogoPosition";
  let dragStarted = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let logoStartX = 0;
  let logoStartY = 0;

  try {
    const savedPosition = JSON.parse(
      localStorage.getItem(positionKey) || "null",
    );

    if (
      savedPosition &&
      Number.isFinite(savedPosition.x) &&
      Number.isFinite(savedPosition.y)
    ) {
      root.style.left = `${savedPosition.x}px`;
      root.style.top = `${savedPosition.y}px`;
      root.style.right = "auto";
      root.style.bottom = "auto";
    }
  } catch {
    // Use the default bottom-right position if storage is unavailable.
  }

  logo.style.cursor = "grab";
  logo.setAttribute("role", "button");
  logo.setAttribute("tabindex", "0");
  logo.setAttribute("aria-label", "Open music player");

  logo.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    dragStarted = false;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;

    const rect = root.getBoundingClientRect();
    logoStartX = rect.left;
    logoStartY = rect.top;

    logo.setPointerCapture(event.pointerId);
  });

  logo.addEventListener("pointermove", (event) => {
    if (!logo.hasPointerCapture(event.pointerId)) return;

    const dx = event.clientX - pointerStartX;
    const dy = event.clientY - pointerStartY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragStarted = true;
    }

    if (!dragStarted) return;

    const maxX = window.innerWidth - root.offsetWidth;
    const maxY = window.innerHeight - root.offsetHeight;

    const x = Math.max(0, Math.min(maxX, logoStartX + dx));
    const y = Math.max(0, Math.min(maxY, logoStartY + dy));

    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
    root.style.right = "auto";
    root.style.bottom = "auto";
  });

  logo.addEventListener("pointerup", (event) => {
    if (logo.hasPointerCapture(event.pointerId)) {
      logo.releasePointerCapture(event.pointerId);
    }

    if (dragStarted) {
      try {
        const rect = root.getBoundingClientRect();

        localStorage.setItem(
          positionKey,
          JSON.stringify({
            x: rect.left,
            y: rect.top,
          }),
        );
      } catch {
        // The player still works if storage is unavailable.
      }
    } else {
      toggleFloatingPlayer();
    }
  });

  logo.addEventListener("pointercancel", () => {
    dragStarted = false;
  });

  logo.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFloatingPlayer();
    }
  });

  function toggleFloatingPlayer() {
    const isCollapsed = shell.classList.contains("mp-collapsed");

    shell.classList.toggle("mp-collapsed", !isCollapsed);
    shell.classList.toggle("mp-expanded", isCollapsed);

    // Hide the playlist when the player opens, then allow it to be expanded.
    if (isCollapsed) {
      shell.classList.add("mp-expanded");
      shell.classList.remove("mp-collapsed");
    } else {
      shell.classList.add("mp-collapsed");
      shell.classList.remove("mp-expanded");
    }

    logo.setAttribute(
      "aria-label",
      shell.classList.contains("mp-collapsed")
        ? "Open music player"
        : "Drag player or use the minimize button",
    );
  }

  // Keep the floating player inside the screen when the viewport changes.
  window.addEventListener("resize", () => {
    const rect = root.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(window.innerWidth - root.offsetWidth, rect.left),
    );

    const y = Math.max(
      0,
      Math.min(window.innerHeight - root.offsetHeight, rect.top),
    );

    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
    root.style.right = "auto";
    root.style.bottom = "auto";
  });
  const title = $("mpTitle");
  const artist = $("mpArtist");
  const expandButton = $("mpExpand");
  const collapseIcon = $("mpCollapseIcon");
  const playButton = $("mpPlay");
  const progress = $("mpProgress");
  const currentTimeLabel = $("mpCurrentTime");
  const durationLabel = $("mpDuration");
  const volume = $("mpVolume");
  const volumeValue = $("mpVolumeValue");
  const muteButton = $("mpMute");
  const shuffleButton = $("mpShuffle");
  const status = $("mpStatus");
  const search = $("mpSearch");
  const filters = $("mpFilters");
  const list = $("mpList");
  const count = $("mpCount");

  let volumeBeforeMute = audio.volume;

  // Start minimized every time a page loads.
  shell.classList.add("mp-collapsed");

  volume.value = String(audio.volume);

  buildFilters();
  renderPlaylist();
  updateTrackDisplay();
  updateVolumeDisplay();
  updatePlayButton();

  /*
   * Restore the previous song and position.
   * Autoplay may be blocked by the browser until the user presses Play.
   */
  if (tracks.length > 0) {
    const restoreTime =
      savedState && Number.isFinite(savedState.time)
        ? Math.max(0, savedState.time)
        : 0;

    loadTrack(currentIndex, {
      autoplay: Boolean(savedState?.wasPlaying),
      startTime: restoreTime,
      restoring: true,
    });
  } else {
    setStatus("Add your MP3 songs in music-player.js.");
    playButton.disabled = true;
    $("mpPrevious").disabled = true;
    $("mpNext").disabled = true;
    shuffleButton.disabled = true;
  }

  // Maximize and minimize the player.
  expandButton.addEventListener("click", () => {
    const shouldExpand = shell.classList.contains("mp-collapsed");

    shell.classList.toggle("mp-collapsed", !shouldExpand);
    shell.classList.toggle("mp-expanded", shouldExpand);

    expandButton.setAttribute("aria-expanded", String(shouldExpand));
    expandButton.setAttribute(
      "aria-label",
      shouldExpand ? "Minimize music player" : "Maximize music player",
    );

    expandButton.title = shouldExpand
      ? "Minimize music player"
      : "Maximize music player";

    collapseIcon.textContent = shouldExpand ? "−" : "+";
  });

  // Play and pause.
  playButton.addEventListener("click", async () => {
    if (!tracks.length) {
      setStatus("Add songs to your tracks array first.");
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setStatus("Now playing", "success");
      } catch {
        setStatus(
          "Playback blocked or file missing. Check the MP3 path.",
          "error",
        );
      }
    } else {
      audio.pause();
      setStatus("Playback paused");
    }

    updatePlayButton();
    renderPlaylist();
  });

  // Previous song.
  $("mpPrevious").addEventListener("click", () => {
    if (!tracks.length) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      saveState();
      return;
    }

    playRelative(-1);
  });

  // Next song.
  $("mpNext").addEventListener("click", () => {
    playRelative(1);
  });

  // Shuffle.
  shuffleButton.addEventListener("click", () => {
    shuffleEnabled = !shuffleEnabled;

    shuffleButton.setAttribute("aria-pressed", String(shuffleEnabled));

    shuffleButton.style.color = shuffleEnabled ? "#38bdf8" : "";

    setStatus(shuffleEnabled ? "Shuffle enabled" : "Shuffle disabled");
  });

  // Track progress.
  audio.addEventListener("timeupdate", () => {
    if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value = String((audio.currentTime / audio.duration) * 100);
    }

    currentTimeLabel.textContent = formatTime(audio.currentTime);
    saveStateOccasionally();
  });

  audio.addEventListener("loadedmetadata", () => {
    durationLabel.textContent = formatTime(audio.duration);
    currentTimeLabel.textContent = formatTime(audio.currentTime);
  });

  // Update player appearance when playback changes.
  audio.addEventListener("play", () => {
    shell.classList.add("mp-playing");
    updatePlayButton();
    renderPlaylist();
    saveState();
  });

  audio.addEventListener("pause", () => {
    shell.classList.remove("mp-playing");
    updatePlayButton();
    renderPlaylist();
    saveState();
  });

  // Automatically continue to the next song.
  audio.addEventListener("ended", () => {
    if (tracks.length > 1) {
      playRelative(1);
    } else {
      audio.currentTime = 0;
      saveState();
    }
  });

  audio.addEventListener("error", () => {
    const track = tracks[currentIndex];

    if (track) {
      setStatus(
        `Unable to load "${track.title}". Check the MP3 file path.`,
        "error",
      );
    }

    updatePlayButton();
  });

  // Seek through the song.
  progress.addEventListener("input", () => {
    isSeeking = true;

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const target = (Number(progress.value) / 100) * audio.duration;
      currentTimeLabel.textContent = formatTime(target);
    }
  });

  progress.addEventListener("change", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    }

    isSeeking = false;
    saveState();
  });

  // Volume.
  volume.addEventListener("input", () => {
    audio.volume = clamp(Number(volume.value), 0, 1);
    audio.muted = false;
    updateVolumeDisplay();
    saveState();
  });

  // Mute and unmute.
  muteButton.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;

      if (audio.volume === 0) {
        audio.volume = volumeBeforeMute || 0.7;
      }
    } else {
      volumeBeforeMute = audio.volume;
      audio.muted = true;
    }

    updateVolumeDisplay();
    saveState();
  });

  // Search songs.
  search.addEventListener("input", renderPlaylist);

  // Save playback state when leaving or hiding a page.
  window.addEventListener("pagehide", saveState);
  window.addEventListener("beforeunload", saveState);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      saveState();
    }
  });

  function loadTrack(index, options = {}) {
    if (!tracks.length) return;

    currentIndex = (index + tracks.length) % tracks.length;

    const track = tracks[currentIndex];
    const startTime = Math.max(0, Number(options.startTime) || 0);

    audio.pause();
    audio.src = track.src;
    audio.load();

    progress.value = "0";
    currentTimeLabel.textContent = "0:00";
    durationLabel.textContent = "0:00";

    updateTrackDisplay();
    renderPlaylist();

    // Save the new song with a reset position.
    saveState(0);

    let metadataHandled = false;

    const applyMetadata = () => {
      if (metadataHandled) return;
      metadataHandled = true;

      if (startTime > 0 && Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(
          startTime,
          Math.max(0, audio.duration - 0.25),
        );
      }

      currentTimeLabel.textContent = formatTime(audio.currentTime);
      durationLabel.textContent = formatTime(audio.duration);

      progress.value =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? String((audio.currentTime / audio.duration) * 100)
          : "0";

      saveState();

      if (options.autoplay) {
        audio
          .play()
          .then(() => setStatus("Now playing", "success"))
          .catch(() => setStatus("Press Play to start the music."));
      } else if (options.restoring && startTime > 0) {
        setStatus("Song restored. Press Play to continue.");
      } else {
        setStatus("Ready to play");
      }
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applyMetadata();
    } else {
      audio.addEventListener("loadedmetadata", applyMetadata, {
        once: true,
      });
    }

    updatePlayButton();
  }

  function playRelative(direction) {
    if (!tracks.length) return;

    let nextIndex;

    if (shuffleEnabled && tracks.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
    }

    loadTrack(nextIndex, { autoplay: true });
  }

  function buildFilters() {
    const groups = [
      "All",
      ...new Set(tracks.map((track) => track.group || "Other")),
    ];

    filters.innerHTML = "";

    groups.forEach((group) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className =
        "mp-filter" + (group === activeGroup ? " mp-active" : "");
      button.textContent = group;

      button.addEventListener("click", () => {
        activeGroup = group;

        filters.querySelectorAll(".mp-filter").forEach((filter) => {
          filter.classList.toggle(
            "mp-active",
            filter.textContent === activeGroup,
          );
        });

        renderPlaylist();
      });

      filters.appendChild(button);
    });
  }

  function renderPlaylist() {
    const query = search.value.trim().toLowerCase();

    const visibleTracks = tracks
      .map((track, index) => ({ ...track, index }))
      .filter((track) => {
        const matchesGroup =
          activeGroup === "All" || (track.group || "Other") === activeGroup;

        const searchableText = [track.title, track.artist, track.group]
          .join(" ")
          .toLowerCase();

        return matchesGroup && searchableText.includes(query);
      });

    count.textContent = `${visibleTracks.length} ${
      visibleTracks.length === 1 ? "track" : "tracks"
    }`;

    list.innerHTML = "";

    if (!visibleTracks.length) {
      const empty = document.createElement("div");
      empty.className = "mp-empty";
      empty.textContent = tracks.length
        ? "No matching songs found."
        : "Your playlist is empty. Add songs in music-player.js.";

      list.appendChild(empty);
      return;
    }

    visibleTracks.forEach((track) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className =
        "mp-track" + (track.index === currentIndex ? " mp-current" : "");

      const number = document.createElement("span");
      number.className = "mp-track-number";
      number.textContent =
        track.index === currentIndex && !audio.paused
          ? "♫"
          : String(track.index + 1);

      const info = document.createElement("span");
      info.className = "mp-track-info";

      const name = document.createElement("span");
      name.className = "mp-track-name";
      name.textContent = track.title || "Untitled song";

      const subtitle = document.createElement("span");
      subtitle.className = "mp-track-subtitle";
      subtitle.textContent = track.artist || "Unknown artist";

      info.append(name, subtitle);

      const state = document.createElement("span");
      state.className = "mp-track-state";
      state.textContent =
        track.index === currentIndex && !audio.paused ? "♫" : "›";

      button.append(number, info, state);

      button.addEventListener("click", async () => {
        if (track.index === currentIndex) {
          if (audio.paused) {
            try {
              await audio.play();
              setStatus("Now playing", "success");
            } catch {
              setStatus(
                "Couldn't play this song. Check its file path.",
                "error",
              );
            }
          } else {
            audio.pause();
          }
        } else {
          loadTrack(track.index, { autoplay: true });
        }

        updatePlayButton();
        renderPlaylist();
      });

      list.appendChild(button);
    });
  }

  function updateTrackDisplay() {
    const track = tracks[currentIndex];

    title.textContent = track?.title || "Your Music";
    artist.textContent = track?.artist || "Add your own playlist";
  }

  function updatePlayButton() {
    const playing = !audio.paused && !audio.ended;

    playButton.textContent = playing ? "Ⅱ" : "▶";
    playButton.setAttribute("aria-label", playing ? "Pause" : "Play");
    playButton.title = playing ? "Pause" : "Play";

    shell.classList.toggle("mp-playing", playing);
  }

  function updateVolumeDisplay() {
    const actualVolume = audio.muted ? 0 : audio.volume;

    volume.value = String(audio.volume);
    volumeValue.textContent = `${Math.round(actualVolume * 100)}%`;

    muteButton.textContent = audio.muted || audio.volume === 0 ? "🔇" : "🔊";

    muteButton.setAttribute(
      "aria-label",
      audio.muted || audio.volume === 0 ? "Unmute" : "Mute",
    );

    muteButton.title = audio.muted || audio.volume === 0 ? "Unmute" : "Mute";
  }

  function setStatus(message, type = "") {
    status.textContent = message;
    status.classList.toggle("mp-error", type === "error");
    status.classList.toggle("mp-success", type === "success");
  }

  function saveState(timeOverride) {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          index: currentIndex,
          time:
            typeof timeOverride === "number"
              ? timeOverride
              : Number.isFinite(audio.currentTime)
                ? audio.currentTime
                : 0,
          volume: audio.volume,
          wasPlaying: !audio.paused && !audio.ended,
        }),
      );
    } catch {
      // The player can still work if browser storage is unavailable.
    }
  }

  function saveStateOccasionally() {
    const now = Date.now();

    if (now - lastSavedTime >= 2000) {
      lastSavedTime = now;
      saveState();
    }
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }
})();
