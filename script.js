// Elements from DOM
const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

// Variables for the game
let cardsArray = [];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let gameStarted = false;
let timer;

// Variables for levels
let level = 1; // Start at level 1
let cardsPerLevel = 4; // Start with 4 pairs of cards

// Card faces (we use simple emojis for this example)
const allCardFaces = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍉', '🍑', '🍍', '🥝', '🍋', '🍏', '🍈'];

// Create the game board with shuffled cards
function initializeGame() {
    const selectedCardFaces = allCardFaces.slice(0, cardsPerLevel); // Choose cards based on level
    const shuffledCards = shuffle([...selectedCardFaces, ...selectedCardFaces]); // Duplicate and shuffle cards
    gameBoard.innerHTML = ''; // Clear the board

    shuffledCards.forEach(face => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.face = face;
        card.innerHTML = face;

        // Make cards not clickable until the game starts
        card.classList.add('disabled');  // Add a class to disable clicks initially
        card.addEventListener('click', flipCard);

        gameBoard.appendChild(card);
    });

    score = 0;
    matchedCards = [];
    updateScore();
}

// Shuffle the cards
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// Flip a card
function flipCard() {
    if (!gameStarted || this.classList.contains('disabled')) return; // Ignore if the game is not started
    if (this.classList.contains('flipped') || flippedCards.length === 2) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Check if the flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.face === card2.dataset.face) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        updateScore();
        checkGameOver();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Update the score
function updateScore() {
    score = matchedCards.length / 2;
    scoreDisplay.innerText = `Score: ${score}`;
}

// Timer logic
function startTimer() {
    gameStarted = true;
    let startTime = Date.now();

    timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');
        timerDisplay.innerText = `Timer: ${minutes}:${seconds}`;
    }, 1000);
}

// Restart the game
function restartGame() {
    clearInterval(timer);
    flippedCards = [];
    gameStarted = false;
    initializeGame();
    timerDisplay.innerText = 'Timer: 00:00'; // Reset timer display
    startBtn.style.display = 'inline-block'; // Show start button again
}

// Check if the game is over
function checkGameOver() {
    if (matchedCards.length === cardsPerLevel * 2) { // Vérifie si toutes les paires ont été trouvées
        clearInterval(timer);

        if (level === 5) { // Si on est au dernier niveau (ajusté pour le nombre total de niveaux)
            Swal.fire({
                title: 'Félicitations!',
                text: 'Tu as accompli toutes les étapes.',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Recommencer',
                cancelButtonText: 'Rejouer',
                customClass: {
                    confirmButton: 'btn-recommencer',  // Classe pour le bouton "Suivant"
                    cancelButton: 'btn-rejouer'    // Classe pour le bouton "Rejouer"
                },
                buttonsStyling: false // Désactiver les styles par défaut pour utiliser les styles personnalisés
            }).then((result) => {
                if (result.isConfirmed) {
                    // Recommence depuis le premier niveau
                    level = 1; // Remet au premier niveau
                    cardsPerLevel = Math.min(level + 3, allCardFaces.length); // Réinitialise le nombre de cartes
                    initializeGame();  // Réinitialise le jeu avec de nouvelles cartes
                    startBtn.style.display = 'inline-block'; // Montre le bouton "Start Game" pour démarrer le nouveau niveau
                    gameStarted = false; // Empêche le jeu de commencer automatiquement
                } else {
                    // Rejoue le niveau actuel
                    restartGame();
                }
            });
        } else {
            // Utilisation de SweetAlert2 pour un message de fin de niveau plus joli
            Swal.fire({
                title: 'Bravo!',
                text: `Vous avez terminé le niveau ${level} avec un score de ${score}.`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Suivant',
                cancelButtonText: 'Rejouer',
                customClass: {
                    confirmButton: 'btn-suivant',  // Classe pour le bouton "Suivant"
                    cancelButton: 'btn-rejouer'    // Classe pour le bouton "Rejouer"
                },
                buttonsStyling: false // Désactiver les styles par défaut pour utiliser les styles personnalisés
            }).then((result) => {
                if (result.isConfirmed) {
                    // Passe au niveau suivant
                    level++;
                    cardsPerLevel = Math.min(level + 3, allCardFaces.length); // Augmente le nombre de cartes par niveau
                    initializeGame();  // Réinitialise le jeu avec de nouvelles cartes
                    startBtn.style.display = 'inline-block'; // Montre le bouton "Start Game" pour démarrer le nouveau niveau
                    gameStarted = false; // Empêche le jeu de commencer automatiquement
                } else {
                    // Rejoue le niveau actuel
                    restartGame();
                }
            });
        }
    }
}

// Event listener for restart button
restartBtn.addEventListener('click', restartGame);

// Event listener for start button
startBtn.addEventListener('click', () => {
    if (!gameStarted) {
        // Enable cards to be flipped after clicking start
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.classList.remove('disabled'));

        startTimer();
        startBtn.style.display = 'none'; // Hide the start button after game starts
        gameStarted = true; // Indique que le jeu a commencé
    }
});

// Initialize the game when the page loads
initializeGame();

// // Elements from DOM
// const gameBoard = document.getElementById('game-board');
// const restartBtn = document.getElementById('restart-btn');
// const startBtn = document.getElementById('start-btn');
// const timerDisplay = document.getElementById('timer');
// const scoreDisplay = document.getElementById('score');

// // Variables for the game
// let cardsArray = [];
// let flippedCards = [];
// let matchedCards = [];
// let score = 0;
// let gameStarted = false;
// let timer;

// // Card faces (we use simple emojis for this example)
// const cardFaces = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍉', '🍑', '🍍'];

// // Create the game board with shuffled cards
// function initializeGame() {
//     const shuffledCards = shuffle([...cardFaces, ...cardFaces]); // Duplicate and shuffle cards
//     gameBoard.innerHTML = ''; // Clear the board

//     shuffledCards.forEach(face => {
//         const card = document.createElement('div');
//         card.classList.add('card');
//         card.dataset.face = face;
//         card.innerHTML = face;

//         // Make cards not clickable until the game starts
//         card.classList.add('disabled');  // Add a class to disable clicks initially
//         card.addEventListener('click', flipCard);

//         gameBoard.appendChild(card);
//     });

//     score = 0;
//     matchedCards = [];
//     updateScore();
// }

// // Shuffle the cards
// function shuffle(array) {
//     return array.sort(() => 0.5 - Math.random());
// }

// // Flip a card
// function flipCard() {
//     if (!gameStarted || this.classList.contains('disabled')) return; // Ignore if the game is not started
//     if (this.classList.contains('flipped') || flippedCards.length === 2) return;

//     this.classList.add('flipped');
//     flippedCards.push(this);

//     if (flippedCards.length === 2) {
//         checkForMatch();
//     }
// }

// // Check if the flipped cards match
// function checkForMatch() {
//     const [card1, card2] = flippedCards;

//     if (card1.dataset.face === card2.dataset.face) {
//         matchedCards.push(card1, card2);
//         flippedCards = [];
//         updateScore();
//         checkGameOver();
//     } else {
//         setTimeout(() => {
//             card1.classList.remove('flipped');
//             card2.classList.remove('flipped');
//             flippedCards = [];
//         }, 1000);
//     }
// }

// // Update the score
// function updateScore() {
//     score = matchedCards.length / 2;
//     scoreDisplay.innerText = `Score: ${score}`;
// }

// // Timer logic
// function startTimer() {
//     gameStarted = true;
//     let startTime = Date.now();

//     timer = setInterval(() => {
//         const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
//         const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
//         const seconds = String(elapsedTime % 60).padStart(2, '0');
//         timerDisplay.innerText = `Timer: ${minutes}:${seconds}`;
//     }, 1000);
// }

// // Restart the game
// function restartGame() {
//     clearInterval(timer);
//     flippedCards = [];
//     gameStarted = false;
//     initializeGame();
//     timerDisplay.innerText = 'Timer: 00:00'; // Reset timer display
//     startBtn.style.display = 'inline-block'; // Show start button again
// }

// // Check if the game is over
// function checkGameOver() {
//     if (matchedCards.length === cardFaces.length * 2) { // Adjusted for all pairs
//         clearInterval(timer);
//         // Utilisation de SweetAlert2 pour un message de fin plus joli
//         Swal.fire({
//             title: 'Bravo!',
//             text: `Vous avez terminé avec un score de ${score}.`,
//             icon: 'success',
//             confirmButtonText: 'Rejouer'
//         }).then(() => {
//         //alert(`Game Over! You finished with a score of ${score}.`);
//         startBtn.style.display = 'inline-block'; // Show start button again
//     })
// }
// }

// // Event listener for restart button
// restartBtn.addEventListener('click', restartGame);

// // Event listener for start button
// startBtn.addEventListener('click', () => {
//     if (!gameStarted) {
//         // Enable cards to be flipped after clicking start
//         const cards = document.querySelectorAll('.card');
//         cards.forEach(card => card.classList.remove('disabled'));

//         startTimer();
//         startBtn.style.display = 'none'; // Hide the start button after game starts
//     }
// });

// // Initialize the game when the page loads
// initializeGame();
