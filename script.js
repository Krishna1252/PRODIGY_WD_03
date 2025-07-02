const cells = document.querySelectorAll(".cell");
const gameMessage = document.getElementById("gameMessage");
const restartButton = document.getElementById("restartButton");
const newGameButton = document.getElementById("newGameButton");
const clearScoreButton = document.getElementById("clearScoreButton");

const modePVPBtn = document.getElementById("modePVP");
const modeAIBtn = document.getElementById("modeAI");

let currentPlayer = "x";
let gameActive = true;
let scoreX = 0;
let scoreO = 0;
let gameMode = "1v1"; // default

const scoreXDisplay = document.getElementById("scoreX");
const scoreODisplay = document.getElementById("scoreO");

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Mode button toggles
modePVPBtn.addEventListener("click", () => {
  gameMode = "1v1";
  modePVPBtn.classList.add("active");
  modeAIBtn.classList.remove("active");
  newGame();
});

modeAIBtn.addEventListener("click", () => {
  gameMode = "1vAI";
  modeAIBtn.classList.add("active");
  modePVPBtn.classList.remove("active");
  newGame();
});

// Handle cell click
cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== "") return;

  makeMove(cell, currentPlayer);

  if (!gameActive) return;

  // If vs AI and it's AI's turn
  if (gameMode === "1vAI" && currentPlayer === "o") {
    setTimeout(aiMove, 400);
  }
}

// Make move for a player
function makeMove(cell, player) {
  cell.classList.add(player);
  cell.textContent = player.toUpperCase();

  if (checkWin(player)) {
    gameMessage.textContent = `Player ${player.toUpperCase()} wins!`;
    updateScore(player);
    gameActive = false;
  } else if ([...cells].every(cell => cell.textContent !== "")) {
    gameMessage.textContent = "It's a Draw!";
    gameActive = false;
  } else {
    currentPlayer = player === "x" ? "o" : "x";
    gameMessage.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
  }
}

// Random AI move
function aiMove() {
  if (!gameActive) return;

  const emptyCells = [...cells].filter(cell => cell.textContent === "");
  if (emptyCells.length === 0) return;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(randomCell, "o");
}

// Check for win
function checkWin(player) {
  return winningCombinations.some(combination =>
    combination.every(index =>
      cells[index].classList.contains(player)
    )
  );
}

// Update scoreboard
function updateScore(player) {
  if (player === "x") {
    scoreX++;
    scoreXDisplay.textContent = scoreX;
  } else {
    scoreO++;
    scoreODisplay.textContent = scoreO;
  }
}

// Restart just the round
function restartGame() {
  cells.forEach(cell => {
    cell.className = "cell";
    cell.textContent = "";
  });
  currentPlayer = "x";
  gameActive = true;
  gameMessage.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;

  // AI starts if mode is 1vAI and AI is player X (optional tweak)
  if (gameMode === "1vAI" && currentPlayer === "o") {
    setTimeout(aiMove, 400);
  }
}

// Reset board + scores
function newGame() {
  scoreX = 0;
  scoreO = 0;
  scoreXDisplay.textContent = "0";
  scoreODisplay.textContent = "0";
  restartGame();
}

// Clear only the scores
function clearScore() {
  scoreX = 0;
  scoreO = 0;
  scoreXDisplay.textContent = "0";
  scoreODisplay.textContent = "0";
}

// Button listeners
restartButton.addEventListener("click", restartGame);
newGameButton.addEventListener("click", newGame);
clearScoreButton.addEventListener("click", clearScore);

// Initial Message
gameMessage.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
