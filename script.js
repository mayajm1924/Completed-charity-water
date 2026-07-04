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
let milestoneBanner = null;

function drawScene() {
    ctx.fillStyle = '#8BD1CB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCloud(ctx, cloudX, cloudY, cloudWidth, cloudHeight);
    drawRaindrops(ctx);
    drawMilestoneBanner(ctx);
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

function drawMilestoneBanner(ctx) {
    if (!milestoneBanner) return;

    const progress = (Date.now() - milestoneBanner.startedAt) / 3000;
    const alpha = progress < 1 ? 1 - progress : 0;
    milestoneBanner.alpha = alpha;

    if (alpha <= 0) {
        milestoneBanner = null;
        return;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 28px "PT Serif", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fffdf5';
    ctx.strokeStyle = '#2E9DF7';
    ctx.lineWidth = 4;
    ctx.strokeText(milestoneBanner.text, canvas.width / 2, 180);
    ctx.fillText(milestoneBanner.text, canvas.width / 2, 180);
    ctx.restore();
}

function showMilestoneBanner() {
    const messages = ['Yay! More Rain', 'Rain, rain, stay today!', 'Thank you for the rain!'];
    const text = messages[Math.floor(Math.random() * messages.length)];
    milestoneBanner = {
        text,
        startedAt: Date.now(),
        alpha: 1,
    };
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

        if (cloudClickCount === 25) {
            showMilestoneBanner();
        }

        if (cloudClickCount % requiredCloudClicksForHydration === 0) {
            addCurrency(2);
        }
    }
});

const scoreTimerEl = document.getElementById('scoreTimer');
const currencyValueEl = document.getElementById('currencyValue');
const dayCounterEl = document.getElementById('dayCounter');
const refreshTimerButton = document.getElementById('refreshTimer');
const startOverlayEl = document.getElementById('startOverlay');
const startGameButton = document.getElementById('startGameButton');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const difficultyHintEl = document.getElementById('difficultyHint');
const groundPlainEl = document.querySelector('.ground-plain');
const upgradeOverlayEl = document.getElementById('upgradeOverlay');
const upgradeCards = document.querySelectorAll('.upgrade-card');
const closeUpgradeMenuButton = document.getElementById('closeUpgradeMenuButton');
const difficultySettings = {
    easy: { threshold: 50, celebrationStep: 50, label: 'Easy' },
    medium: { threshold: 100, celebrationStep: 100, label: 'Medium' },
    hard: { threshold: 200, celebrationStep: 200, label: 'Hard' },
};
let elapsedSeconds = 0;
let currency = 0;
let currentDay = 1;
let timerIntervalId = null;
let gameStarted = false;
let selectedDifficulty = 'easy';
let waterDistributionTechLevel = 0;
let villageEfficiencyLevel = 0;
let requiredCloudClicksForHydration = 5;
let upgradeMenuOpen = false;
let flowerRewardUnlocked = false;

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

function updateDifficultySelection() {
    const selectedSetting = difficultySettings[selectedDifficulty];

    difficultyButtons.forEach(button => {
        const isActive = button.dataset.difficulty === selectedDifficulty;
        button.classList.toggle('active', isActive);
    });

    if (difficultyHintEl) {
        difficultyHintEl.textContent = `Daily goal: ${selectedSetting.threshold} points`;
    }

    updateFlowerRewardVisualState();
}

function updateFlowerRewardVisualState() {
    if (!groundPlainEl) return;

    const shouldShowFlowers = selectedDifficulty === 'hard' && flowerRewardUnlocked;
    groundPlainEl.classList.toggle('flowers-visible', shouldShowFlowers);
}

function emitConfetti() {
    const celebrationSound = new Audio('img/lolo_s-mistery-474083.mp3');
    celebrationSound.play().catch(() => {
        // Ignore autoplay restrictions and continue the game.
    });

    showUpgradeMenu();

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

function setGroundState(isHealthy) {
    if (!groundPlainEl) return;

    groundPlainEl.classList.remove('dry');

    if (isHealthy) {
        groundPlainEl.classList.remove('dry-grass');
    } else {
        groundPlainEl.classList.add('dry-grass');
    }
}

function showUpgradeMenu() {
    if (!upgradeOverlayEl) return;

    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }

    upgradeMenuOpen = true;
    upgradeOverlayEl.classList.remove('hidden');
    updateUpgradeButtons();
}

function hideUpgradeMenu() {
    if (!upgradeOverlayEl) return;

    upgradeMenuOpen = false;
    upgradeOverlayEl.classList.add('hidden');

    if (gameStarted && !timerIntervalId) {
        timerIntervalId = setInterval(() => {
            elapsedSeconds = (elapsedSeconds + 1) % 180;
            if (elapsedSeconds === 0) {
                evaluateDayOutcome();
            }
            updateScorePanel();
        }, 1000);
    }
}

function getUpgradeCost() {
    return 50 * currentDay;
}

function updateUpgradeButtons() {
    upgradeCards.forEach(card => {
        const cost = getUpgradeCost();
        const costValue = card.querySelector('.upgrade-cost-value');
        if (costValue) {
            costValue.textContent = cost;
        }

        const canAfford = currency >= cost;
        card.classList.toggle('disabled', !canAfford);
        card.disabled = !canAfford;
    });
}

function purchaseUpgrade(upgradeKey) {
    const cost = getUpgradeCost();
    if (currency < cost) return;

    currency -= cost;
    updateScorePanel();

    if (upgradeKey === 'distribution') {
        waterDistributionTechLevel += 1;
        requiredCloudClicksForHydration = Math.max(1, 5 - waterDistributionTechLevel);
    } else if (upgradeKey === 'village') {
        villageEfficiencyLevel += 1;
    }

    updateUpgradeButtons();
}

function applyVillageBonus() {
    if (villageEfficiencyLevel > 0 && currentDay % 3 === 0) {
        currency += 5;
        updateScorePanel();
        updateUpgradeButtons();
    }
}

function addCurrency(amount) {
    const previousCurrency = currency;
    const celebrationStep = difficultySettings[selectedDifficulty].celebrationStep;
    currency += amount;
    updateScorePanel();

    if (selectedDifficulty === 'hard' && !flowerRewardUnlocked && currency >= 100) {
        flowerRewardUnlocked = true;
        updateFlowerRewardVisualState();
    }

    const prevTier = Math.floor(previousCurrency / celebrationStep);
    const newTier = Math.floor(currency / celebrationStep);
    if (newTier > prevTier) {
        for (let t = prevTier + 1; t <= newTier; t += 1) {
            emitConfetti();
        }
        setGroundState(true);
    }
}

function evaluateDayOutcome() {
    const dailyGoal = difficultySettings[selectedDifficulty].threshold;
    const dayBeforeAdvance = currentDay;

    console.log('Day-end check', {
        currency,
        currentDay,
        dayCounter: dayCounterEl.textContent,
        dailyGoal,
    });

    if (currency >= dailyGoal) {
        setGroundState(true);
    } else {
        const failSound = new Audio('img/freesound_community-pixel-sound-effect-3-82880 Game over.mp3');
        failSound.play().catch(() => {
            // Ignore autoplay restrictions and continue the game.
        });
        setGroundState(false);
    }

    currentDay += 1;
    if (dayBeforeAdvance % 3 === 0) {
        applyVillageBonus();
    }
}

function showStartOverlay() {
    startOverlayEl.classList.remove('hidden');
}

function hideStartOverlay() {
    startOverlayEl.classList.add('hidden');
}

function startSkyCycle() {
    const skyContainer = document.querySelector('.game-container');
    if (!skyContainer) return;
    skyContainer.style.animationPlayState = 'running';
}

function resetSkyCycle() {
    const skyContainer = document.querySelector('.game-container');
    if (!skyContainer) return;
    skyContainer.style.animationPlayState = 'paused';
    skyContainer.style.backgroundColor = '#FFCC99';
    skyContainer.style.animationPlayState = 'running';
}

function startTimer() {
    if (timerIntervalId || upgradeMenuOpen) return;

    gameStarted = true;
    hideStartOverlay();
    startSkyCycle();
    timerIntervalId = setInterval(() => {
        elapsedSeconds = (elapsedSeconds + 1) % 180;
        if (elapsedSeconds === 0 && !upgradeMenuOpen) {
            // three minutes passed — evaluate performance for the completed day
            evaluateDayOutcome();
        }
        updateScorePanel();
    }, 1000);
}

function stopTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }
    gameStarted = false;
}

refreshTimerButton.addEventListener('click', () => {
    // Restart game: reset timer, points and day
    const startSound = new Audio('img/49447089-game-start-317318.mp3');
    startSound.play().catch(() => {
        // Ignore autoplay restrictions and continue the game.
    });

    stopTimer();
    elapsedSeconds = 0;
    currency = 0;
    currentDay = 1;
    waterDistributionTechLevel = 0;
    villageEfficiencyLevel = 0;
    requiredCloudClicksForHydration = 5;
    cloudClickCount = 0;
    flowerRewardUnlocked = false;
    setGroundState(true);
    updateScorePanel();
    updateFlowerRewardVisualState();
    hideUpgradeMenu();
    resetSkyCycle();
    showStartOverlay();
});

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedDifficulty = button.dataset.difficulty;
        updateDifficultySelection();
    });
});

startGameButton.addEventListener('click', () => {
    startTimer();
});

upgradeCards.forEach(card => {
    card.addEventListener('click', () => {
        purchaseUpgrade(card.dataset.upgrade);
    });
});

closeUpgradeMenuButton.addEventListener('click', () => {
    hideUpgradeMenu();
});

updateScorePanel();
updateDifficultySelection();
updateFlowerRewardVisualState();
showStartOverlay();

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