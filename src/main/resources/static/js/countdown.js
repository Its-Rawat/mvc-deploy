const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const targetTextEl = document.getElementById("targetText");
const serverTimeEl = document.getElementById("serverTime");
const celebrationPanelEl = document.getElementById("celebrationPanel");
const cheerTrackEl = document.getElementById("cheerTrack");
const progressTextEl = document.getElementById("progressText");
const progressFillEl = document.getElementById("progressFill");
const fireworksCanvas = document.getElementById("fireworksCanvas");
const fireworksContext = fireworksCanvas.getContext("2d");

const valueEls = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

let targetTimeMs = null;
let serverOffsetMs = 0;
let celebrationMode = false;
let fireworksStarted = false;
let particles = [];

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
    startFireworks();
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
        renderTimer(0);
        setCelebrationMode();
    } else {
        renderTimer(data.millisecondsRemaining);
    }
}

function resizeFireworksCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

function createBurst() {
    const x = Math.random() * fireworksCanvas.width;
    const y = (Math.random() * fireworksCanvas.height * 0.45) + 40;
    const palette = ["#ffb703", "#ff6b6b", "#7ae582", "#f7f1e8"];

    for (let index = 0; index < 28; index += 1) {
        const angle = (Math.PI * 2 * index) / 28;
        const speed = 1.5 + Math.random() * 3.2;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            size: 2 + Math.random() * 3,
            color: palette[index % palette.length]
        });
    }
}

function animateFireworks() {
    fireworksContext.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    particles = particles.filter((particle) => particle.alpha > 0.02);

    particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.015;
        particle.alpha *= 0.985;

        fireworksContext.globalAlpha = particle.alpha;
        fireworksContext.fillStyle = particle.color;
        fireworksContext.beginPath();
        fireworksContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        fireworksContext.fill();
    });

    fireworksContext.globalAlpha = 1;

    if (celebrationMode) {
        if (Math.random() < 0.08) {
            createBurst();
        }
        requestAnimationFrame(animateFireworks);
    } else {
        fireworksContext.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        fireworksStarted = false;
    }
}

function startFireworks() {
    if (fireworksStarted) {
        return;
    }

    fireworksStarted = true;
    resizeFireworksCanvas();
    for (let index = 0; index < 3; index += 1) {
        createBurst();
    }
    requestAnimationFrame(animateFireworks);
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
        setCelebrationMode();
    }
}

window.addEventListener("resize", resizeFireworksCanvas);

loadCountdown();
setInterval(tick, 1000);
setInterval(loadCountdown, 30000);
