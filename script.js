
// create player function
const createPlayer = (name, marker) => {
    return { name, marker };
}


// gameBoard module
const gameBoard = (() => {
    board = ['', '', '',
        '', '', '',
        '', '', ''];

    const getBoardIndex = (index) => {
        return board[index];
    }

    const setBoardIndex = (index, marker) => {
        board[index] = marker;
    }

    const resetBoard = () => {
        for (i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }

    return { getBoardIndex, setBoardIndex, resetBoard }
})()


const displayController = (() => {
    const gameFields = document.querySelectorAll('.field');
    const display = document.getElementById('display');
    const resetButton = document.getElementById('reset-button');

    gameFields.forEach((field) => {
        field.addEventListener('click', (e) => {
            if (field.textContent !== '') return;
            if (gameController.isGameOver()) return;
            let fieldIndex = e.target.dataset.index;
            gameBoard.setBoardIndex(fieldIndex, gameController.getActivePlayerMarker())
            setMarkerAttribute(e, gameController.getActivePlayerMarker());

            if (gameController.checkWinner(gameController.getActivePlayerMarker)) {
                gameController.endGame(false);
            } else if (gameController.isDraw()) {
                gameController.endGame(true);
            } else {
                gameController.endTurn();
            }
            renderGameboard();
        })
    })

    const setMarkerAttribute = (e, marker) => {
        e.target.dataset.marker = gameController.getActivePlayerMarker();
    }

    const renderGameboard = () => {
        for (let i = 0; i < gameFields.length; i++) {
            gameFields[i].textContent = gameBoard.getBoardIndex(i);
        }
    }

    return { gameFields, renderGameboard, display, resetButton }
})()



const gameController = (() => {
    // Set initial variables  
    const playerOne = createPlayer('Player One', 'X');
    const playerTwo = createPlayer('Player Two', 'O');
    let round = 1;
    let activePlayer = playerOne;
    let gameOver = false;

    const checkWinner = (getActivePlayerMarker) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]


        return winConditions.some(combination => {
            return combination.every(index => {
                return displayController.gameFields[index].dataset.marker === getActivePlayerMarker();
            })
        })
    }

    const getActivePlayerMarker = () => {
        return activePlayer.marker;
    }


    function endTurn() {
        activePlayer === playerOne ? activePlayer = playerTwo : activePlayer = playerOne;
        round += 1;
        displayController.display.textContent = `${activePlayer.name}'s turn`
    }

    const endGame = (draw) => {
        if (draw) {
            displayController.display.textContent = `It's a draw!`;
            displayController.resetButton.classList.remove('reset-hide');
            displayController.resetButton.classList.add('reset-show');
            gameOver = true;
        } else {
            displayController.display.textContent = `${gameController.getActivePlayerMarker()} wins!`
            displayController.resetButton.classList.remove('reset-hide');
            displayController.resetButton.classList.add('reset-show');
            gameOver = true;
        }
    }

    const isDraw = () => {
        return round === 9;
    }

    const isGameOver = () => {
        return gameOver;
    }


    const resetGameboard = () => {
        round = 1;
        activePlayer = playerOne;
        gameOver = false;
        displayController.resetButton.classList.remove('reset-show');
        displayController.resetButton.classList.add('reset-hide');
        displayController.display.textContent = '';
        for (i = 0; i < displayController.gameFields.length; i++) {
            delete displayController.gameFields[i].dataset.marker;
        }
        gameBoard.resetBoard();
        displayController.renderGameboard();
    }

    displayController.resetButton.addEventListener('click', resetGameboard);

    return { getActivePlayerMarker, checkWinner, endTurn, endGame, isDraw, isGameOver, resetGameboard };
})()

//test making a variable public and trying to change it in another module. i.e. recreate error to see why it was occurring