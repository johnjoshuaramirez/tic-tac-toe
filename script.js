const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6]
];

const cellElements = document.querySelectorAll("[data-cell]");
const winningMessageElement = document.querySelector("#winning-message");
const winningMessageText = document.querySelector("[winning-message]");
const restartButton = document.querySelector("#restart-button");

let circleTurn;

startGame();

restartButton.addEventListener("click", startGame)

function startGame() {
   circleTurn = false;
   cellElements.forEach(cell => {
      cell.textContent = "";
      cell.classList.remove(X_CLASS);
      cell.classList.remove(X_CLASS);
      cell.classList.remove(O_CLASS);
      cell.removeEventListener("click", handleClick)
      cell.addEventListener("click", handleClick, { once: true });
   });
   winningMessageElement.classList.remove("show");
}

function handleClick(e) {
   const cell = e.target;
   const currentClass = circleTurn ? O_CLASS : X_CLASS;

   placeMark(cell, currentClass);
   if (checkWin(currentClass)) {
      endGame(false);
   } else if (isDraw()) {
      endGame(true);
   } else {
      swapTurns();
   }
}

function endGame(draw) {
   if (draw) {
      winningMessageText.innerText = "Draw!";
   } else {
      winningMessageText.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
   }
   winningMessageElement.classList.add("show");
}

function isDraw() {
   return [...cellElements].every(cell => {
      return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
   });
}

function placeMark(cell, currentClass) {
   cell.classList.add(currentClass);
   cell.innerText = currentClass;
}

function swapTurns() {
   circleTurn = !circleTurn;
}

function checkWin(currentClass) {
   return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
         return cellElements[index].classList.contains(currentClass);
      });
   });
}