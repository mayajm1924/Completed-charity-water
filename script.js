// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the internal drawing resolution
canvas.width = 360;
canvas.height = 640;

// Optional: keep the canvas responsive in layout
canvas.style.width = '100%';
canvas.style.height = 'auto';

// Draw the sky background
ctx.fillStyle = '#8BD1CB';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function drawCloud(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x + 0.12 * width, y + 0.70 * height);
    ctx.bezierCurveTo(
        x + 0.02 * width, y + 0.72 * height,
        x + 0.05 * width, y + 0.50 * height,
        x + 0.16 * width, y + 0.42 * height
    );
    ctx.bezierCurveTo(
        x + 0.07 * width, y + 0.30 * height,
        x + 0.14 * width, y + 0.16 * height,
        x + 0.30 * width, y + 0.18 * height
    );
    ctx.bezierCurveTo(
        x + 0.35 * width, y + 0.04 * height,
        x + 0.52 * width, y + 0.04 * height,
        x + 0.58 * width, y + 0.16 * height
    );
    ctx.bezierCurveTo(
        x + 0.72 * width, y + 0.08 * height,
        x + 0.88 * width, y + 0.16 * height,
        x + 0.92 * width, y + 0.30 * height
    );
    ctx.bezierCurveTo(
        x + 0.98 * width, y + 0.44 * height,
        x + 0.96 * width, y + 0.60 * height,
        x + 0.84 * width, y + 0.66 * height
    );
    ctx.bezierCurveTo(
        x + 0.88 * width, y + 0.80 * height,
        x + 0.70 * width, y + 0.88 * height,
        x + 0.55 * width, y + 0.88 * height
    );
    ctx.bezierCurveTo(
        x + 0.48 * width, y + 0.96 * height,
        x + 0.30 * width, y + 0.92 * height,
        x + 0.24 * width, y + 0.84 * height
    );
    ctx.bezierCurveTo(
        x + 0.14 * width, y + 0.92 * height,
        x + 0.02 * width, y + 0.84 * height,
        x + 0.12 * width, y + 0.70 * height
    );
    ctx.closePath();
    ctx.fillStyle = '#fffbf0';
    ctx.fill();
}
// Draw one classic fluff cloud near the top of the scene
const cloudWidth = 180;
const cloudHeight = 180;
const cloudX = (canvas.width - cloudWidth) / 2;
const cloudY = 100;

const raindrops = [];
let cloudClickCount = 0;

function drawScene() {
    ctx.fillStyle = '#8BD1CB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCloud(ctx, cloudX, cloudY, cloudWidth, cloudHeight);
    drawRaindrops(ctx);
}

function createRaindrops(count) {
    for (let i = 0; i < count; i += 1) {
        raindrops.push({
            x: cloudX + 20 + Math.random() * (cloudWidth - 40),
            y: cloudY + cloudHeight * 0.75,
            speed: 3 + Math.random() * 2,
            length: 10 + Math.random() * 8,
        });
    }
}

function drawRaindrops(ctx) {
    ctx.strokeStyle = 'rgba(1, 154, 249, 0.85)';
    ctx.lineWidth = 2;
    raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();
    });
}

function updateRaindrops() {
    for (let i = raindrops.length - 1; i >= 0; i -= 1) {
        const drop = raindrops[i];
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
            raindrops.splice(i, 1);
        }
    }
}

canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    const cloudHitBox = {
        left: cloudX,
        right: cloudX + cloudWidth,
        top: cloudY,
        bottom: cloudY + cloudHeight * 0.8,
    };

    if (x >= cloudHitBox.left && x <= cloudHitBox.right && y >= cloudHitBox.top && y <= cloudHitBox.bottom) {
        createRaindrops(6);
        cloudClickCount += 1;

        if (cloudClickCount > 5) {
            if (cloudClickCount % 5 === 0) {
                addCurrency(2);
            }
        }
    }
});

const scoreTimerEl = document.getElementById('scoreTimer');
const currencyValueEl = document.getElementById('currencyValue');
const dayCounterEl = document.getElementById('dayCounter');
const refreshTimerButton = document.getElementById('refreshTimer');
let elapsedSeconds = 0;
let currency = 0;
let currentDay = 1;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateScorePanel() {
    scoreTimerEl.textContent = formatTime(elapsedSeconds);
    currencyValueEl.textContent = currency;
    dayCounterEl.textContent = currentDay;
}

function emitConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';

    const colors = ['#FFC907', '#2E9DF7', '#4FCB53', '#FF902A', '#F5402C'];
    const pieceCount = 40;

    for (let i = 0; i < pieceCount; i += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[i % colors.length];
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        piece.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
        container.appendChild(piece);
    }

    document.body.appendChild(container);
    setTimeout(() => {
        container.remove();
    }, 3000);
}

function addCurrency(amount) {
    const previousCurrency = currency;
    currency += amount;
    updateScorePanel();

    if (previousCurrency < 50 && currency >= 50) {
        emitConfetti();
    }
}

refreshTimerButton.addEventListener('click', () => {
    elapsedSeconds = 0;
    updateScorePanel();
});

updateScorePanel();
setInterval(() => {
    elapsedSeconds = (elapsedSeconds + 1) % 180;
    if (elapsedSeconds === 0) {
        currentDay += 1;
    }
    updateScorePanel();
}, 1000);

const wheatItems = document.querySelectorAll('.wheat-icon');
wheatItems.forEach(wheat => {
    wheat.addEventListener('click', () => {
        console.log('Water added!');
        addCurrency(1);
    });
});

function animate() {
    updateRaindrops();
    drawScene();
    requestAnimationFrame(animate);
}

animate();