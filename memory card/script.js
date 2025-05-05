const cardSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [...cardSymbols, ...cardSymbols];
let flipped = [];
let lockBoard = false;
let matched = 0;
let flipCount = 0;
let timeLeft = 60;
let timerInterval;
let timerStarted = false; // ✅ NEW: flag to check if timer started

const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const flipsDisplay = document.getElementById('flips');
const matchesDisplay = document.getElementById('matches');
const refreshButton = document.getElementById('refreshButton');

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            setTimeout(() => {
                alert('⏰ Time\'s up! Try again!');
                resetGame();
            }, 100);
        }
    }, 1000);
}

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;

    const front = document.createElement('div');
    front.classList.add('front');
    front.textContent = '?';

    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = symbol;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', () => flipCard(card));

    return card;
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('matched') || flipped.includes(card)) return;

    // ✅ Start timer on first flip
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    card.classList.add('flipped');
    flipped.push(card);
    flipCount++;
    flipsDisplay.textContent = flipCount;

    if (flipped.length === 2) {
        lockBoard = true;
        const [first, second] = flipped;
        if (first.dataset.symbol === second.dataset.symbol) {
            first.classList.add('matched');
            second.classList.add('matched');
            matched++;
            matchesDisplay.textContent = matched;
            flipped = [];
            lockBoard = false;
            if (matched === cardSymbols.length) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    alert('🎉 You Win!');
                    resetGame();
                }, 300);
            }
        } else {
            first.classList.add('shake');
            second.classList.add('shake');

            setTimeout(() => {
                first.classList.remove('shake', 'flipped');
                second.classList.remove('shake', 'flipped');
                flipped = [];
                lockBoard = false;
            }, 800);

        }
    }
}

function setupGame() {
    gameBoard.innerHTML = '';
    cards = [...cardSymbols, ...cardSymbols].sort(() => 0.5 - Math.random());
    cards.forEach(symbol => gameBoard.appendChild(createCard(symbol)));
    timeLeft = 60;
    flipCount = 0;
    matched = 0;
    timerStarted = false; // ✅ Reset timer flag
    timerDisplay.textContent = timeLeft;
    flipsDisplay.textContent = flipCount;
    matchesDisplay.textContent = matched;
    clearInterval(timerInterval);
}

function resetGame() {
    setupGame();
}

refreshButton.addEventListener('click', resetGame);

setupGame();
