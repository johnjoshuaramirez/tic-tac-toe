const gameBoard = (() => {
	return {
		count: 0,
		o_player: '◯',
		x_player: '✕',
		currentPlayer: null,
		aiPlayer: null,
		array: Array(9),
      gameWinner: null,
      gameHasWon: false,
		container: document.querySelector('#gameboard'),
		boxes: Array.from(document.querySelectorAll('.box')),
		playText: document.querySelector('#playText'),
		restartButton: document.querySelector('#restartButton'),
		modal: document.querySelector('.modal'),
		startScreen: document.querySelector('.startScreen'),
		x: document.querySelector('#x'),
		o: document.querySelector('#o'),
		randomIndex: Math.floor(Math.random() * 9),
		winLines: [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		]
	};
})();

const gameController = (() => {
	const match = () => {
		for (const line of gameBoard.winLines) {
			const { array } = gameBoard;
			const [a, b, c] = line;
			if (array[a] && array[a] === array[b] && array[a] === array[c]) {
				gameBoard.gameWinner = array[a]
            // console.log(line[a]);
				return line;
			}
		}
		return false;
	};

	const pickChoice = e => {
		if (e.target.id === 'x') {
			gameBoard.currentPlayer = gameBoard.x_player;
			gameBoard.aiPlayer = gameBoard.o_player;
			gameBoard.startScreen.style.display = 'none';
			gameBoard.container.style.display = 'flex';
		}

		if (e.target.id === 'o') {
			gameBoard.currentPlayer = gameBoard.o_player;
			gameBoard.aiPlayer = gameBoard.x_player;
			gameBoard.startScreen.style.display = 'none';
			gameBoard.container.style.display = 'flex';

         gameBoard.container.style.pointerEvents = 'none';
         setTimeout(gameController.aiChoice, 700);
		}
	};

	const aiChoice = () => {
		if (!gameBoard.array[gameBoard.randomIndex]) {
         gameBoard.count++;
         gameBoard.container.style.pointerEvents = 'auto';
			gameBoard.array[gameBoard.randomIndex] = gameBoard.aiPlayer;
			document.getElementById(gameBoard.randomIndex).innerText = gameBoard.aiPlayer;
			gameController.evaluateResult();
			return;
		}

		gameBoard.randomIndex = Math.floor(Math.random() * 9);
		aiChoice();
	};

	const evaluateResult = () => {
		if (gameController.match()) {
         gameBoard.gameHasWon = true;
			gameController.match().forEach(id => {
				document.getElementById(id).style.color = 'white';
			});
			gameBoard.container.style.pointerEvents = 'none';
			gameBoard.playText.innerText = `${gameBoard.gameWinner} has won!`;
			setTimeout(() => (gameBoard.container.style.display = 'none'), 2100);
			setTimeout(() => (gameBoard.modal.style.display = 'flex'), 2100);
			return;
		}

		if (gameBoard.count === 9) {
			gameBoard.container.style.pointerEvents = 'none';
			gameBoard.playText.innerText = `Tie Game!`;
			setTimeout(() => (gameBoard.container.style.display = 'none'), 2100);
			setTimeout(() => (gameBoard.modal.style.display = 'flex'), 2100);
			return;
		}
	};

	const restartGame = () => {
		gameBoard.count = 0;
		gameBoard.playText.innerText = `Let's Play!`;
		gameBoard.array = Array(9);
		gameBoard.container.style.pointerEvents = 'auto';
		gameBoard.container.style.display = 'none';
		gameBoard.modal.style.display = 'none';
		gameBoard.startScreen.style.display = 'flex';
      gameBoard.gameHasWon = false;
		gameBoard.boxes.forEach(box => {
			box.innerText = '';
			box.style.color = 'goldenrod';
			box.addEventListener('click', displayController.boxClicked);
		});
		gameBoard.restartButton.addEventListener('click', gameController.restartGame);
		gameBoard.startScreen.addEventListener('click', pickChoice);
	};

	return {
		match,
		aiChoice,
      evaluateResult,
		restartGame
	};
})();

const displayController = (() => {
	const boxClicked = e => {
		const id = e.target.id;
		if (!gameBoard.array[id]) {
			gameBoard.count++;
			gameBoard.array[id] = gameBoard.currentPlayer;
			e.target.innerText = gameBoard.currentPlayer;

			gameController.evaluateResult();

         if (gameBoard.gameHasWon) return;

         if (gameBoard.count < 9) {
            gameBoard.container.style.pointerEvents = 'none';
            setTimeout(gameController.aiChoice, 700);
         }
		}
	};

	return {
		boxClicked
	};
})();

gameController.restartGame();

// console.log(randomIndex);
