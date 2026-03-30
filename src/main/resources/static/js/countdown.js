const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const targetTextEl = document.getElementById("targetText");
const serverTimeEl = document.getElementById("serverTime");
const celebrationPanelEl = document.getElementById("celebrationPanel");
const cheerTrackEl = document.getElementById("cheerTrack");
const progressTextEl = document.getElementById("progressText");
const progressFillEl = document.getElementById("progressFill");
const FAKE_COUNTDOWN_MS = ((12 * 60) + 59) * 1000;
const STATIC_CHEERS = [
    "One last sprint before midnight.",
    "Close the books. Raise the energy.",
    "FY 2025-2026 deserves a proper sendoff.",
    "Twelve o'clock turns the page to a new year."
];

const valueEls = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

let targetTimeMs = null;
let serverOffsetMs = 0;
let celebrationMode = false;
let tickIntervalId = null;
let refreshIntervalId = null;

function renderMidnightSnapshot() {
    renderTimer(0);
    progressFillEl.style.width = "100%";
    progressTextEl.textContent = "Final cheer complete";
    targetTextEl.textContent = "2026-04-01 00:00:00 Asia/Kolkata";
    serverTimeEl.textContent = "01/04/2026, 00:00:00";
}

function formatPart(value) {
    return String(value).padStart(2, "0");
}

function splitDuration(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
}

function renderTimer(milliseconds) {
    const { days, hours, minutes, seconds } = splitDuration(milliseconds);
    valueEls.days.textContent = formatPart(days);
    valueEls.hours.textContent = formatPart(hours);
    valueEls.minutes.textContent = formatPart(minutes);
    valueEls.seconds.textContent = formatPart(seconds);
}

function setCelebrationMode() {
    if (celebrationMode) {
        return;
    }

    celebrationMode = true;
    document.body.classList.add("celebration-mode");
    celebrationPanelEl.hidden = false;
    subtitleEl.textContent = "The countdown hit zero. FY 2025-2026 ended at exactly 2026-04-01 00:00:00 Asia/Kolkata.";
    renderMidnightSnapshot();
    if (tickIntervalId !== null) {
        clearInterval(tickIntervalId);
    }
    if (refreshIntervalId !== null) {
        clearInterval(refreshIntervalId);
    }
}

function renderCheers(cheers) {
    if (!Array.isArray(cheers) || cheers.length === 0) {
        cheerTrackEl.innerHTML = "<span>Final night. Full energy.</span>";
        return;
    }

    const doubledCheers = [...cheers, ...cheers];
    cheerTrackEl.innerHTML = doubledCheers.map((cheer) => `<span>${cheer}</span>`).join("");
}

function renderProgress(estimatedServerNowMs) {
    if (targetTimeMs === null) {
        return;
    }

    const countdownStartMs = targetTimeMs - FAKE_COUNTDOWN_MS;
    const elapsed = Math.min(Math.max(estimatedServerNowMs - countdownStartMs, 0), FAKE_COUNTDOWN_MS);
    const percentage = Math.round((elapsed / FAKE_COUNTDOWN_MS) * 100);

    progressFillEl.style.width = `${percentage}%`;
    progressTextEl.textContent = `${percentage}% of the fake midnight run completed`;
}

function syncWithServer(data) {
    titleEl.textContent = data.title;
    subtitleEl.textContent = "Every visit starts a fresh 12:59 countdown to the midnight-style celebration.";
    targetTextEl.textContent = "2026-04-01 00:00:00 Asia/Kolkata";
    serverTimeEl.textContent = "01/04/2026, 00:00:00";
    renderCheers(data.cheers);

    const clientNowMs = Date.now();
    targetTimeMs = clientNowMs + FAKE_COUNTDOWN_MS;
    serverOffsetMs = 0;
    renderTimer(FAKE_COUNTDOWN_MS);
    renderProgress(clientNowMs);
}

function initializeFakeCountdown() {
    titleEl.textContent = "FY 2025-2026 Finale";
    subtitleEl.textContent = "Every visit starts a fresh 12:59 countdown to the midnight-style celebration.";
    targetTextEl.textContent = "2026-04-01 00:00:00 Asia/Kolkata";
    serverTimeEl.textContent = "01/04/2026, 00:00:00";
    renderCheers(STATIC_CHEERS);

    targetTimeMs = Date.now() + FAKE_COUNTDOWN_MS;
    serverOffsetMs = 0;
    renderTimer(FAKE_COUNTDOWN_MS);
    renderProgress(Date.now());
}

function tick() {
    if (targetTimeMs === null) {
        return;
    }

    const estimatedServerNowMs = Date.now() + serverOffsetMs;
    const remainingMs = Math.max(0, targetTimeMs - estimatedServerNowMs);

    renderTimer(remainingMs);
    renderProgress(estimatedServerNowMs);
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    serverTimeEl.textContent = `00:00:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (remainingMs === 0) {
        renderMidnightSnapshot();
        setCelebrationMode();
        return;
    }
}

initializeFakeCountdown();
tickIntervalId = setInterval(tick, 1000);
