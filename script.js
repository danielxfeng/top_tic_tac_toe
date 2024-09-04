// Represents a board.
function Board() {
    const size = 3;
    const board = [];

    // Init a Board.
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i].push(Cell());
        }
    }

    // The method to return a board.
    const getBoard = () => board;

    // Print out the board.
    const printBoard = () => {
        console.log("Current Board:");
        board.forEach((row) => {
            console.log(row.map((cell) => cell.getValue()).join(","));
        })
    }

    // One move. Return -1 for illegal move, otherwise update UI and return 0;
    const move = (player, row, col) => {
        if (!board[row][col].isEmpty()) {
            return -1;
        }
        board[row][col].move(player);
        return 0;
    }

    return { getBoard, printBoard, move };
}

// Represents a cell.
function Cell() {
    let cell = 0;

    // Return the value of the cell.
    const getValue = () => cell;

    // Return if the cell is empty.
    const isEmpty = () => cell === 0;

    // Are two cells equal?
    const equal = (otherCell) => cell === otherCell.getValue();

    // Just a move.
    const move = (player) => { cell = player };

    return { getValue, isEmpty, equal, move };
}

// Represents the players.
function Players(player1Name, player2Name) {
    const p1 = 1;
    const p2 = 2;
    let p1Name = player1Name;
    let p2Name = player2Name;
    let currPlayer = p1;

    // Return the player's name by given id.
    const getName = (p) => {
        return p === 1 ? p1Name : p2Name;
    }

    // Return the current player.
    const getCurrPlayer = () => currPlayer;

    // Change a player's name.
    const changeName = (p, pName) => {
        if (p === p1) {
            p1Name = pName;
        } else {
            p2Name = pName;
        }
    }

    // Switch and return the current player.
    const switchPlayer = () => {
        let element = document.getElementById(`curr_player_${currPlayer}`);
        element.innerHTML = "";
        currPlayer = currPlayer === p1 ? p2 : p1;
        element = document.getElementById(`curr_player_${currPlayer}`);
        element.textContent = "This is your turn.";
        return currPlayer;
    }

    return { getName, getCurrPlayer, switchPlayer, changeName };
}

// Game logic.
function Game() {
    const board = Board();
    const players = Players("player1", "player2");
    const size = 3;

    // Draw a board;
    const drawBoard = () => {
        let b = document.getElementById("board");
        b.innerHTML = "";
        for (let i = 0; i < size; i++) {
            let row = document.createElement("div");
            row.className = "row";
            row.id = `row-${i}`;
            for (let j = 0; j < size; j++) {
                let c = document.createElement("div");
                c.className = "cell";
                c.id = `cell-${i}-${j}`;
                c.addEventListener("click", (() => {
                    return () => playByHTML(i, j);
                })());
                c.classList.remove('disabled');
                row.appendChild(c);
            }
            b.appendChild(row);
        }
    }

    // Draw the players;
    const drawPlayer = () => {
        let p1 = document.getElementById("p1_name");
        let p2 = document.getElementById("p2_name");
        p1.innerHTML = '<form onsubmit="return game.changeName(event, 1)"><input id="playerinput_1" type="text" value="player1"/><button type="submit">OK</button></form>';
        p2.innerHTML = '<form onsubmit="return game.changeName(event, 2)"><input id="playerinput_2" type="text" value="player2"/><button type="submit">OK</button></form>';
    }

    // Change the player's name.
    function changeName(e, player) {
        e.preventDefault();
        let dom = document.getElementById(`p${player}_name`);
        let value = document.getElementById(`playerinput_${player}`).value;
        dom.innerHTML = `<p>${value}</p>`;
        players.changeName(player, value);
    }

    // Disable a board when it's end.
    const disableBoard = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cell = document.getElementById(`cell-${i}-${j}`);
                cell.classList.add('disabled');
            }
        }
    };

    // Enable a board when a new game starts.
    const enableBoard = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cell = document.getElementById(`cell-${i}-${j}`);
                cell.classList.remove('disabled');
            }
        }
    };

    // Return player when there is a winner, 0 when there is a tie, otherwise return null.
    const getWinner = () => {
        let b = board.getBoard();
        for (let i = 0; i < b.length; i++) {
            // Win by row?
            if (!b[i][0].isEmpty() && b[i][0].equal(b[i][1]) && b[i][0].equal(b[i][2])) {
                return b[i][0].getValue();
            }
            // Win by column?
            if (!b[0][i].isEmpty() && b[0][i].equal(b[1][i]) && b[0][i].equal(b[2][i])) {
                return b[0][i].getValue();
            }
        }
        // Win by cross?
        if (!b[1][1].isEmpty()
            && ((b[0][0].equal(b[1][1]) && b[0][0].equal(b[2][2]))
                || (b[2][0].equal(b[1][1]) && b[2][0].equal(b[0][2])))) {
            return b[1][1].getValue();
        }
        // Not End?
        for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < b.length; j++) {
                if (b[i][j].isEmpty()) {
                    return null;
                }
            }
        }
        // It's a tie.
        return 0;
    }

    // Play a round.
    const playRound = (row, col) => {
        let currPlayer = players.getCurrPlayer();
        let res = board.move(currPlayer, row, col);
        if (res === 0) {
            let c = document.getElementById(`cell-${row}-${col}`);
            c.innerHTML = currPlayer === 1 ? "<p>O</p>" : "<p>X</p>";
        }
        return res;
    }


    // Play the game by HTML.
    const playByHTML = (row, col) => {
        if (playRound(row, col) === -1) {
            alert(`Illegal Move at ${row}, ${col}.`);
            return;
        }
        let winner = getWinner();
        if (winner === null) {
            players.switchPlayer();
            return;
        }
        let msg = winner === 0 ? "Game over, it's a tie." : `Game over, the winner is ${players.getName(winner)}.`;
        let info = document.getElementById("info");
        info.textContent = msg;
        disableBoard();
    }

    drawBoard();
    drawPlayer();
    element = document.getElementById(`curr_player_1`);
    element.textContent = "This is your turn.";
    let info = document.getElementById("info");
    info.textContent = "";

    return { playByHTML, enableBoard, changeName };
}

function newGame() {
    game = Game();
    game.enableBoard();
}

let game = Game();