const games = {
    streetRunner: 'streetRunnerGame',
    taxiDodge: 'taxiDodgeGame',
    memoryMatch: 'memoryMatchGame',
    typingMaster: 'typingMasterGame',
    treasureHunt: 'treasureHuntGame',
    streetQuiz: 'streetQuizGame',
};

const gameContainer = document.getElementById('gameContainer');
const miniGames = document.querySelectorAll('.mini-game');

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function playGame(gameName) {
    const selectedGame = games[gameName];
    if (!selectedGame) return;

    gameContainer.classList.remove('hidden');
    miniGames.forEach((game) => game.classList.add('hidden'));
    document.getElementById(selectedGame).classList.remove('hidden');

    if (gameName === 'streetRunner') startStreetRunner();
    if (gameName === 'taxiDodge') startTaxiDodge();
    if (gameName === 'memoryMatch') startMemoryMatch();
    if (gameName === 'typingMaster') startTypingMaster();
    if (gameName === 'treasureHunt') startTreasureHunt();
    if (gameName === 'streetQuiz') startStreetQuiz();
}

function closeGame() {
    gameContainer.classList.add('hidden');
    miniGames.forEach((game) => game.classList.add('hidden'));
}

// Street Runner game
let runnerAnimationFrame;
let runnerGameState = {
    score: 0,
    lives: 3,
    playerX: 80,
    playerY: 250,
    playerWidth: 50,
    playerHeight: 50,
    coins: [],
    obstacles: [],
    gameOver: false,
};

function startStreetRunner() {
    const canvas = document.getElementById('runnerCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('runnerScore');
    const livesEl = document.getElementById('runnerLives');

    runnerGameState = {
        score: 0,
        lives: 3,
        playerX: 80,
        playerY: 250,
        playerWidth: 50,
        playerHeight: 50,
        coins: [],
        obstacles: [],
        gameOver: false,
    };

    scoreEl.textContent = runnerGameState.score;
    livesEl.textContent = runnerGameState.lives;

    const movePlayer = (event) => {
        if (event.key === 'ArrowUp' || event.key === 'w') runnerGameState.playerY -= 45;
        if (event.key === 'ArrowDown' || event.key === 's') runnerGameState.playerY += 45;
        runnerGameState.playerY = Math.max(20, Math.min(310, runnerGameState.playerY));
    };

    document.addEventListener('keydown', movePlayer);

    const spawnCoin = () => {
        if (runnerGameState.gameOver) return;
        const coin = {
            x: canvas.width,
            y: 40 + Math.random() * 260,
            r: 12,
        };
        runnerGameState.coins.push(coin);
    };

    const spawnObstacle = () => {
        if (runnerGameState.gameOver) return;
        const obstacle = {
            x: canvas.width,
            y: 50 + Math.random() * 260,
            width: 30,
            height: 30 + Math.random() * 50,
        };
        runnerGameState.obstacles.push(obstacle);
    };

    const update = () => {
        if (runnerGameState.gameOver) return;

        const player = runnerGameState;

        player.coins.forEach((coin) => {
            coin.x -= 6;
            if (
                coin.x - coin.r < player.playerX + player.playerWidth &&
                coin.x + coin.r > player.playerX &&
                coin.y - coin.r < player.playerY + player.playerHeight &&
                coin.y + coin.r > player.playerY
            ) {
                player.score += 10;
                coin.x = -100;
            }
        });

        player.obstacles.forEach((obs) => {
            obs.x -= 6;
            if (
                obs.x < player.playerX + player.playerWidth &&
                obs.x + obs.width > player.playerX &&
                obs.y < player.playerY + player.playerHeight &&
                obs.y + obs.height > player.playerY
            ) {
                player.lives -= 1;
                obs.x = -200;
                if (player.lives <= 0) {
                    player.gameOver = true;
                    alert('Game Over! Final Score: ' + player.score);
                    closeGame();
                    return;
                }
            }
        });

        player.coins = player.coins.filter((coin) => coin.x > -20);
        player.obstacles = player.obstacles.filter((obs) => obs.x > -50);

        scoreEl.textContent = player.score;
        livesEl.textContent = player.lives;
        drawRunnerScene();

        if (Math.random() < 0.03) spawnCoin();
        if (Math.random() < 0.02) spawnObstacle();

        runnerAnimationFrame = requestAnimationFrame(update);
    };

    const drawRunnerScene = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#08111d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#1f2937';
        for (let i = 0; i < 10; i++) {
            ctx.fillRect(i * 90, 320, 50, 80);
        }

        ctx.fillStyle = '#fbbf24';
        runnerGameState.coins.forEach((coin) => {
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#ef4444';
        runnerGameState.obstacles.forEach((obs) => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });

        ctx.fillStyle = '#34d399';
        ctx.fillRect(
            runnerGameState.playerX,
            runnerGameState.playerY,
            runnerGameState.playerWidth,
            runnerGameState.playerHeight
        );
    };

    drawRunnerScene();
    update();
}

// Taxi Dodge game
let taxiGameInterval;
let taxiGameState = {
    score: 0,
    time: 60,
    playerX: 80,
    playerY: 180,
    cars: [],
    gameOver: false,
};

function startTaxiDodge() {
    clearInterval(taxiGameInterval);
    const canvas = document.getElementById('taxiCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('taxiScore');
    const timeEl = document.getElementById('taxiTime');

    taxiGameState = {
        score: 0,
        time: 60,
        playerX: 80,
        playerY: 180,
        cars: [],
        gameOver: false,
    };

    scoreEl.textContent = taxiGameState.score;
    timeEl.textContent = taxiGameState.time;

    const movePlayer = (event) => {
        if (taxiGameState.gameOver) return;
        if (event.key === 'ArrowUp' || event.key === 'w') taxiGameState.playerY -= 35;
        if (event.key === 'ArrowDown' || event.key === 's') taxiGameState.playerY += 35;
        taxiGameState.playerY = Math.max(30, Math.min(330, taxiGameState.playerY));
    };

    document.addEventListener('keydown', movePlayer);

    const spawnCar = () => {
        if (taxiGameState.gameOver) return;
        taxiGameState.cars.push({
            x: canvas.width,
            y: 30 + Math.random() * 300,
            width: 35,
            height: 28,
            color: Math.random() > 0.5 ? '#ef4444' : '#fbbf24',
        });
    };

    const updateTaxi = () => {
        if (taxiGameState.gameOver) return;

        taxiGameState.cars.forEach((car) => {
            car.x -= 7;
            if (
                car.x < taxiGameState.playerX + 40 &&
                car.x + car.width > taxiGameState.playerX &&
                car.y < taxiGameState.playerY + 50 &&
                car.y + car.height > taxiGameState.playerY
            ) {
                taxiGameState.score -= 20;
                car.x = -200;
            }
        });

        taxiGameState.cars = taxiGameState.cars.filter((car) => car.x > -100);
        taxiGameState.score += 1;
        scoreEl.textContent = taxiGameState.score;
        drawTaxiScene();
    };

    const drawTaxiScene = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#1f2937';
        for (let i = 0; i < 8; i++) {
            ctx.fillRect(i * 110, 0, 25, canvas.height);
        }

        ctx.fillStyle = '#fbbf24';
        taxiGameState.cars.forEach((car) => {
            ctx.fillRect(car.x, car.y, car.width, car.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(car.x + 6, car.y + 7, 8, 12);
            ctx.fillRect(car.x + 21, car.y + 7, 8, 12);
            ctx.fillStyle = '#fbbf24';
        });

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(taxiGameState.playerX, taxiGameState.playerY, 40, 50);
    };

    drawTaxiScene();
    taxiGameInterval = setInterval(() => {
        if (taxiGameState.time <= 0) {
            clearInterval(taxiGameInterval);
            taxiGameState.gameOver = true;
            alert('Time Up! Final Score: ' + taxiGameState.score);
            closeGame();
            return;
        }
        taxiGameState.time -= 1;
        timeEl.textContent = taxiGameState.time;
        updateTaxi();
        if (Math.random() < 0.1) spawnCar();
    }, 120);
}

// Memory Match game
let memoryCards = [];
let memoryFlipped = [];
let memoryLock = false;
let memoryScore = 0;

function startMemoryMatch() {
    const grid = document.getElementById('memoryGrid');
    const matchesEl = document.getElementById('memoryMatches');
    const symbols = ['🏙️', '🗽', '🌮', '🎸', '🚀', '🌉'];
    memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    memoryFlipped = [];
    memoryLock = false;
    memoryScore = 0;
    matchesEl.textContent = '0';
    grid.innerHTML = '';

    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.textContent = '?';
        card.addEventListener('click', () => flipMemoryCard(card));
        grid.appendChild(card);
    });
}

function flipMemoryCard(card) {
    if (memoryLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    memoryFlipped.push(card);

    if (memoryFlipped.length === 2) {
        memoryLock = true;
        const [first, second] = memoryFlipped;

        if (first.dataset.symbol === second.dataset.symbol) {
            first.classList.add('matched');
            second.classList.add('matched');
            memoryFlipped = [];
            memoryLock = false;
            memoryScore += 1;
            document.getElementById('memoryMatches').textContent = memoryScore;

            if (memoryScore === 6) {
                alert('You won the Memory Match!');
                closeGame();
            }
        } else {
            setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                first.textContent = '?';
                second.textContent = '?';
                memoryFlipped = [];
                memoryLock = false;
            }, 700);
        }
    }
}

// Typing Master game
const typingWords = ['NewYork', 'Broadway', 'Sunset', 'Route66', 'Chicago', 'Hollywood', 'Detroit', 'LasVegas', 'Austin', 'Seattle'];
let typingCurrentWord = '';
let typingStartTime = null;
let typingCorrect = 0;
let typingTotal = 0;

function startTypingMaster() {
    const input = document.getElementById('typingInput');
    const wordDisplay = document.getElementById('typingWord');
    const wpmEl = document.getElementById('typingWPM');
    const accEl = document.getElementById('typingAccuracy');

    typingCurrentWord = typingWords[Math.floor(Math.random() * typingWords.length)];
    wordDisplay.textContent = typingCurrentWord;
    input.value = '';
    input.focus();
    typingStartTime = Date.now();
    typingCorrect = 0;
    typingTotal = 0;
    wpmEl.textContent = '0';
    accEl.textContent = '100';

    input.oninput = () => {
        const typed = input.value.trim();
        if (typed === typingCurrentWord) {
            typingCorrect += 1;
            typingTotal += 1;
            const elapsed = (Date.now() - typingStartTime) / 60000;
            const wpm = Math.max(0, Math.round((typingCorrect / Math.max(elapsed, 0.1))));
            const accuracy = Math.round((typingCorrect / Math.max(typingTotal, 1)) * 100);
            wpmEl.textContent = wpm;
            accEl.textContent = accuracy;

            typingCurrentWord = typingWords[Math.floor(Math.random() * typingWords.length)];
            wordDisplay.textContent = typingCurrentWord;
            input.value = '';
        } else if (typed.length > typingCurrentWord.length) {
            typingTotal += 1;
            const accuracy = Math.round((typingCorrect / Math.max(typingTotal, 1)) * 100);
            accEl.textContent = accuracy;
        }
    };
}

// Treasure Hunt game
const treasureLocations = ['🏛️', '🌮', '🎤', '🌃', '🎯'];
let treasureFound = 0;
let treasureScore = 0;

function startTreasureHunt() {
    const map = document.getElementById('treasureMap');
    const foundEl = document.getElementById('treasureFound');
    const scoreEl = document.getElementById('treasureScore');
    treasureFound = 0;
    treasureScore = 0;
    foundEl.textContent = '0';
    scoreEl.textContent = '0';
    map.innerHTML = '';

    const cells = Array.from({ length: 25 }, (_, i) => {
        const cell = document.createElement('button');
        cell.className = 'treasure-cell';
        cell.textContent = '❔';
        cell.addEventListener('click', () => revealTreasure(cell));
        map.appendChild(cell);
        return cell;
    });

    const treasureIndices = new Set();
    while (treasureIndices.size < 5) {
        treasureIndices.add(Math.floor(Math.random() * cells.length));
    }

    cells.forEach((cell, index) => {
        cell.dataset.treasure = treasureIndices.has(index);
    });
}

function revealTreasure(cell) {
    if (cell.classList.contains('found')) return;

    const isTreasure = cell.dataset.treasure === 'true';
    if (isTreasure) {
        cell.textContent = '💎';
        treasureFound += 1;
        treasureScore += 100;
        document.getElementById('treasureFound').textContent = treasureFound;
        document.getElementById('treasureScore').textContent = treasureScore;
        cell.classList.add('found');

        if (treasureFound === 5) {
            alert('Treasure Hunt Complete!');
            closeGame();
        }
    } else {
        cell.textContent = '💥';
        cell.classList.add('found');
    }
}

// Street Quiz game
const quizBank = [
    {
        question: 'Which city is famous for the Hollywood Walk of Fame?',
        options: ['Los Angeles', 'Chicago', 'New York', 'Miami'],
        answer: 'Los Angeles',
    },
    {
        question: 'What is the name of the famous road in the US often called “the Main Street of America”?',
        options: ['Route 66', 'Sunset Blvd', 'Broadway', 'Park Avenue'],
        answer: 'Route 66',
    },
    {
        question: 'Which city is known for the Statue of Liberty?',
        options: ['New York City', 'Boston', 'Seattle', 'Atlanta'],
        answer: 'New York City',
    },
    {
        question: 'Which city is home to the Space Needle?',
        options: ['Seattle', 'San Francisco', 'Austin', 'Denver'],
        answer: 'Seattle',
    },
    {
        question: 'Which street is famous in the entertainment world in Los Angeles?',
        options: ['Sunset Boulevard', 'Wall Street', 'Main Street', 'Penn Avenue'],
        answer: 'Sunset Boulevard',
    },
];

let quizIndex = 0;
let quizScore = 0;

function startStreetQuiz() {
    quizIndex = 0;
    quizScore = 0;
    document.getElementById('quizCurrent').textContent = '1';
    document.getElementById('quizScore').textContent = '0';
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const content = document.getElementById('quizContent');
    const current = quizBank[quizIndex];

    if (!current) {
        content.innerHTML = `<h3>Quiz Complete!</h3><p>Your final score: ${quizScore}/${quizBank.length}</p><button class="btn btn-primary" onclick="startStreetQuiz()">Play Again</button>`;
        return;
    }

    document.getElementById('quizCurrent').textContent = (quizIndex + 1);
    content.innerHTML = `
        <div class="quiz-question">${current.question}</div>
        ${current.options.map((option) => `<button class="quiz-option" onclick="checkQuizAnswer('${option}')">${option}</button>`).join('')}
    `;
}

function checkQuizAnswer(option) {
    const current = quizBank[quizIndex];
    if (option === current.answer) quizScore += 1;
    document.getElementById('quizScore').textContent = quizScore;
    quizIndex += 1;
    renderQuizQuestion();
}

// mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(runnerAnimationFrame);
    clearInterval(taxiGameInterval);
});
