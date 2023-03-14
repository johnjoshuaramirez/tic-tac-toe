const dom = (() => {
	const container = document.querySelector('#gameboard');
	const boxes = Array.from(document.querySelectorAll('.box'));
	const playText = document.querySelector('#playText');
	const restartButton = document.querySelector('#restartButton');
	const modal = document.querySelector('.modal');
	const startScreen = document.querySelector('.startScreen');
	const x = document.querySelector('#x');
	const o = document.querySelector('#o');

	return {
		get_container: () => container,
		get_boxes: () => boxes,
		get_playText: () => playText,
		get_restartButton: () => restartButton,
		get_modal: () => modal,
		get_startScreen: () => startScreen,
		get_x: () => x,
		get_o: () => o
	};
})();

const gameController = (() => {
	const o_player = '◯';
	const x_player = '✕';
	let array = Array(9);
	let randomIndex = Math.floor(Math.random() * 9);
	let count = 0;
	let currentPlayer = null;
	let aiPlayer = null;
	let gameWinner = null;
	let gameHasWon = false;
	const winLines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	const aiChoice = () => {
		if (!array[randomIndex]) {
			count++;
			dom.get_container().style.pointerEvents = 'auto';
			array[randomIndex] = aiPlayer;
			document.getElementById(randomIndex).innerText = aiPlayer;
			evaluateResult();
			return;
		}

		randomIndex = Math.floor(Math.random() * 9);
		aiChoice();
	};

	const playerPick = e => {
		if (e.target.id === 'x') {
			currentPlayer = x_player;
			aiPlayer = o_player;
			dom.get_startScreen().style.display = 'none';
			dom.get_container().style.display = 'flex';
		}

		if (e.target.id === 'o') {
			currentPlayer = o_player;
			aiPlayer = x_player;
			dom.get_startScreen().style.display = 'none';
			dom.get_container().style.display = 'flex';
			dom.get_container().style.pointerEvents = 'none';
			setTimeout(aiChoice, 700);
		}
	};

	const match = () => {
		for (const line of winLines) {
			const [a, b, c] = line;
			if (array[a] && array[a] === array[b] && array[a] === array[c]) {
				gameWinner = array[a];
				return line;
			}
		}
		return false;
	};

	const evaluateResult = () => {
		if (match()) {
			gameHasWon = true;
			match().forEach(i => {
				document.getElementById(i).style.color = 'white';
			});
			dom.get_container().style.pointerEvents = 'none';
			dom.get_playText().innerText = `${gameWinner} has won!`;
			setTimeout(() => (dom.get_container().style.display = 'none'), 2100);
			setTimeout(() => (dom.get_modal().style.display = 'flex'), 2100);
		}

		if (count === 9) {
			dom.get_container().style.pointerEvents = 'none';
			dom.get_playText().innerText = `Tie Game!`;
			setTimeout(() => (dom.get_container().style.display = 'none'), 2100);
			setTimeout(() => (dom.get_modal().style.display = 'flex'), 2100);
		}
	};

	const restartGame = () => {
		count = 0;
		gameHasWon = false;
		array = Array(9);
		dom.get_playText().innerText = `Let's Play!`;
		dom.get_container().style.pointerEvents = 'auto';
		dom.get_container().style.display = 'none';
		dom.get_modal().style.display = 'none';
		dom.get_startScreen().style.display = 'flex';
		dom.get_boxes().forEach(box => displayController.clearBoxes(box));
		dom.get_restartButton().addEventListener('click', gameController.restartGame);
		dom.get_startScreen().addEventListener('click', playerPick);
	};

	return {
		match,
		aiChoice,
		evaluateResult,
		restartGame,
		get_array: () => array,
		get_currentPlayer: () => currentPlayer,
		get_gameHasWon: () => gameHasWon,
		get_count: () => count,
		increment_count: () => count++,
		set_arrayItem: index => (array[index] = currentPlayer)
	};
})();

const displayController = (() => {
	const boxClicked = e => {
		const id = e.target.id;
		if (!gameController.get_array()[id]) {
			e.target.innerText = gameController.get_currentPlayer();
			gameController.increment_count();
			gameController.set_arrayItem(id);
			gameController.evaluateResult();

			if (gameController.get_gameHasWon()) return;
			if (gameController.get_count() < 9) {
				dom.get_container().style.pointerEvents = 'none';
				setTimeout(gameController.aiChoice, 700);
			}
		}
	};

	const clearBoxes = (box) => {
		box.innerText = '';
		box.style.color = 'goldenrod';
		box.addEventListener('click', boxClicked);
	};

	return {
		boxClicked,
      clearBoxes
	};
})();

gameController.restartGame();
