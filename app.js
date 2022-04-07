const editButtonPlayer1 = document.getElementById("edit-button-player-1");
const editButtonPlayer2 = document.getElementById("edit-button-player-2");
const cancelButton = document.getElementById("cancel-button");
const backdropElement = document.getElementById("backdrop");
const formElement = document.querySelector("form");
const errorOutputElement = document.getElementById("error");
const startNewGameBtnElement = document.getElementById("start-game-btn");
const gameAreaElement = document.getElementById("game-section");
const gameFieldElements = document.querySelectorAll("#game li");
const activePlayerNameElement = document.getElementById("active-player-name");
const gameOverElement = document.getElementById("game-over");
let editedPlayer = 0;
let activeplayer = 0;
let currentRound = 1;
let gameIsOver = false;

const players = [
  {
    name: "",
    symbol: "X",
  },
  {
    name: "",
    symbol: "O",
  },
];

const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

function resetGameStatus(){
  activeplayer = 0;
  currentRound = 1;
  gameIsOver = false;
  gameOverElement.firstElementChild.innerHTML = '<h2>You Won, <span id="winner-name">Player Name</span></h2>'
  gameOverElement.style.display = 'none';

  let gameBoardIndex = 0;
  for(let i = 0; i < 3; i++){
    for(let j = 0 ; j < 3 ; j++){
      gameData[i][j] = 0 ;
      const gameBoardItemElement = gameFieldElements[gameBoardIndex];
      gameBoardItemElement.textContent = '';
      gameBoardItemElement.classList.remove('disabled');
      gameBoardIndex++;
    }
  }
}

function editFuntion(event) {
  editedPlayer = +event.target.dataset.playerid;
  document.getElementById("backdrop").style.display = "block";
  document.querySelector(".modal").style.display = "block";
}

function cancelFunction() {
  document.getElementById("backdrop").style.display = "none";
  document.querySelector(".modal").style.display = "none";
  errorOutputElement.textContent = "";
  formElement.firstElementChild.lastElementChild.value = "";
}

function savePlayerName(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const enteredPlayerName = formData.get("playerName").trim();

  if (!enteredPlayerName) {
    errorOutputElement.textContent = "Enter Valid Name";
    return;
  }

  const updatedPlayerDataElement = document.getElementById(
    "player-" + editedPlayer + "-data"
  );
  updatedPlayerDataElement.children[1].textContent = enteredPlayerName;

  players[editedPlayer - 1].name = enteredPlayerName;

  cancelFunction();
}

function startNewGame() {
  if (players[0].name === "" || players[1].name === "") {
    alert("Please set custom player names for both players");
    return;
  }

  resetGameStatus();

  activePlayerNameElement.textContent = players[activeplayer].name;
  gameAreaElement.style.display = "block";
}

function switchPlayer() {
  if (activeplayer === 0) {
    activeplayer = 1;
  } else if (activeplayer === 1) {
    activeplayer = 0;
  }
  activePlayerNameElement.textContent = players[activeplayer].name;
}

function selectGameField(event) {

  if(gameIsOver){
    return;
  }

  const selectedField = event.target;

  const selectedColumn = selectedField.dataset.col - 1;
  const selectedRow = selectedField.dataset.row - 1;

  if (gameData[selectedRow][selectedColumn] > 0) {
    alert("Please select an empty field!");
    return;
  }

  selectedField.textContent = players[activeplayer].symbol;
  selectedField.classList.add("disabled");

  gameData[selectedRow][selectedColumn] = activeplayer + 1;

  const winnerID = checkForGameOver();
  
  if(winnerID !== 0 ){
    endGame(winnerID)
  }

  currentRound++;
  switchPlayer();
}

function checkForGameOver() {
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[0][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  if (
    gameData[0][0] &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }

  if (
    gameData[2][0] &&
    gameData[2][0] === gameData[1][1] &&
    gameData[1][1] === gameData[0][2]
  ) {
    return gameData[2][0];
  }

  if (currentRound === 9) {
    return -1;
  }
  return 0;
}

function endGame(winnerID) {
  gameIsOver = true;
  gameOverElement.style.display = "block";

  if (winnerID > 0) {
    const winnerName = players[winnerID - 1].name;
    gameOverElement.firstElementChild.firstElementChild.textContent =
      winnerName;
  } else {
    gameOverElement.firstElementChild.textContent = `It's a Draw!`;
  }
}

editButtonPlayer1.addEventListener("click", editFuntion);
editButtonPlayer2.addEventListener("click", editFuntion);
cancelButton.addEventListener("click", cancelFunction);
backdropElement.addEventListener("click", cancelFunction);
formElement.addEventListener("submit", savePlayerName);
startNewGameBtnElement.addEventListener("click", startNewGame);

for (const gameFieldElement of gameFieldElements) {
  gameFieldElement.addEventListener("click", selectGameField);
}
