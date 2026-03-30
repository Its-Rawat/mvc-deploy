const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const targetTextEl = document.getElementById("targetText");
const serverTimeEl = document.getElementById("serverTime");
const celebrationPanelEl = document.getElementById("celebrationPanel");
const cheerTrackEl = document.getElementById("cheerTrack");
const progressTextEl = document.getElementById("progressText");
const progressFillEl = document.getElementById("progressFill");

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
    progressTextEl.textContent = "100% of the final day completed";
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

    const dayStartMs = targetTimeMs - (24 * 60 * 60 * 1000);
    const elapsed = Math.min(Math.max(estimatedServerNowMs - dayStartMs, 0), 24 * 60 * 60 * 1000);
    const percentage = Math.round((elapsed / (24 * 60 * 60 * 1000)) * 100);

    progressFillEl.style.width = `${percentage}%`;
    progressTextEl.textContent = `${percentage}% of the final day completed`;
}

function syncWithServer(data) {
    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;
    targetTextEl.textContent = data.targetDateTime.replace("T", " ");
    serverTimeEl.textContent = data.serverDateTime.replace("T", " ");
    renderCheers(data.cheers);

    targetTimeMs = new Date(data.targetDateTime).getTime();
    const serverNowMs = new Date(data.serverDateTime).getTime();
    serverOffsetMs = serverNowMs - Date.now();
    renderProgress(serverNowMs);

    if (data.ended) {
        renderMidnightSnapshot();
        setCelebrationMode();
    } else {
        renderTimer(data.millisecondsRemaining);
    }
}

async function loadCountdown() {
    try {
        const response = await fetch("/api/countdown", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Countdown request failed with ${response.status}`);
        }

        const data = await response.json();
        syncWithServer(data);
    } catch (error) {
        subtitleEl.textContent = "Could not load the server countdown. The page is still alive, but the API needs attention.";
        console.error(error);
    }
}

function tick() {
    if (targetTimeMs === null) {
        return;
    }

    const estimatedServerNowMs = Date.now() + serverOffsetMs;
    const remainingMs = Math.max(0, targetTimeMs - estimatedServerNowMs);

    renderTimer(remainingMs);
    renderProgress(estimatedServerNowMs);
    serverTimeEl.textContent = new Date(estimatedServerNowMs).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    if (remainingMs === 0) {
        renderMidnightSnapshot();
        setCelebrationMode();
        return;
    }
}

loadCountdown();
tickIntervalId = setInterval(tick, 1000);
refreshIntervalId = setInterval(loadCountdown, 30000);
