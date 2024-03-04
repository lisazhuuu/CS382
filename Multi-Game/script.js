// Variables 
var playerBlue = "B";
var playerYellow = "Y";
var currPlayer = playerBlue; // Blue goes first

var gameOver = false; // Keep track on whether game is over or not
var board;
var currColumns; // An extra variable to deal with Gravity

// This board has 6 rows and 7 columns
var rows = 6; 
var columns = 7;

// bBall.addEventListener('dragstart', function(event) {
//     console.log(event)
// })

// When window loads, call function()
window.onload = function() {
    setGame();
    createNewGameButton();


    // HOW TO STOP SWAPPING AFTER SWAPPING ONCE?
    // Drag BLUE
    const bBall = document.getElementById('blueBall');
    const drop2 = document.getElementById('dropZone2');

    bBall.addEventListener('dragstart', event => {
        // Set the data to be dragged
        event.dataTransfer.setData('text/plain', 'blueBall');
    });

    drop2.addEventListener('dragover', event => {
        // Prevent default to allow drop
        event.preventDefault();
    });

    // Add drop event listener to drop zone 2
    drop2.addEventListener('drop', event => {
        // Prevent default action (open as link for some elements)
        event.preventDefault();
        // Get the data, which is the id of the dragged element
        const data = event.dataTransfer.getData('text/plain');
        // Append the dragged element to drop zone 2
        drop2.appendChild(document.getElementById(data));
    });
    

    // Drag YELLOW
    const yBall = document.getElementById('yellowBall');
    const drop1 = document.getElementById('dropZone1');

    yBall.addEventListener('dragstart', event => {
        // Set the data to be dragged
        event.dataTransfer.setData('text/plain', 'yellowBall');
    });

    drop1.addEventListener('dragover', event => {
        // Prevent default to allow drop
        event.preventDefault();
    });

    // Add drop event listener to drop zone 2
    drop1.addEventListener('drop', event => {
        // Prevent default action (open as link for some elements)
        event.preventDefault();
        // Get the data, which is the id of the dragged element
        const data = event.dataTransfer.getData('text/plain');
        // Append the dragged element to drop zone 2
        drop1.appendChild(document.getElementById(data));
    });
}

// Populate tiles (格子) within the board
function setGame() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5]; // Begin with the bottom row

    for (let r = 0; r < rows; r++) { // For every row
        let row = []; // Create a new row
        for (let c = 0; c < columns; c++) { // For every column
            row.push(' '); // JS

            // Add an HTML div named tile
            let tile = document.createElement("div");
            // Keep track of coordinates
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece); // Deal with Click action
            // tile.addEventListener("drag", setPiece); // Deal with Drag action
            // tile.addEventListener("drop", setPiece); // Deal with Drop action
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-"); // This will turn "0-1" format to ["0", "1"] format

    let r =  parseInt(coords[0]); // Parse the coordinate elements into integer
    let c =  parseInt(coords[1]);

    r = currColumns[c];
    if (r < 0) { // When this column is full
        return;
    }

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerBlue) {
        tile.classList.add("blue-piece"); // Put the red piece on board
        currPlayer = playerYellow; // Make two players alternative
        document.getElementById("player-turn").innerText = "Yellow's turn!"; // Update text box
        document.getElementById("player-turn").style.backgroundColor = "yellow";
        document.getElementById("player-turn").style.color = "black";
    } else {
        tile.classList.add("yellow-piece"); // Put the yellow piece on board
        currPlayer = playerBlue; // Make two players alternative
        document.getElementById("player-turn").innerText = "Blue's turn!"; // Update text box
        document.getElementById("player-turn").style.backgroundColor = "rgb(56, 56, 231)";
        document.getElementById("player-turn").style.color = "white";
    }
    r--; // Update r
    currColumns[c] = r; // Update array

    checkWinner();
}

function checkWinner() {
    // For horizontal direction
    for (let r = 0; r < rows; r++) { // Sliding window
        for (let c = 0; c < columns - 3; c++) { // Last possibility of horizontal win is when x = 4 (out of 7 columns)
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2]
                    && board[r][c+2] == board[r][c+3]) { // If there's are 4 in a row horizontally
                    setWinner(r,c);
                    return; // Don't need to wait for other win (vertical or diagnal)
                }
            }
        }
    }

    // For vertical direction
    for (let c = 0; c < columns; c++) { // Sliding window
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c]
                    && board[r+2][c] == board[r+3][c]) { // If there's are 4 in a row horizontally
                    setWinner(r,c);
                    return; // Don't need to wait for other win (vertical or diagnal)
                }
            }
        }
    }

    // For anti-diagnal direction (Right-Bottom)
    for (let r = 0; r < rows - 3; r++) { // Start at 0 and go down
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2]
                    && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r,c);
                    return;
                }
            }
        }
    }

    // For anti-diagnal direction (Right-Up)
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2]
                    && board[r-2][c+2] == board[r-3][c+3]) {
                        setWinner(r,c);
                        return;
                }
            }
        }
    }
}

function setWinner(r,c) {
    let winnerColor = board[r][c] == playerBlue ? "Blue" : "Yellow";

    let winner = document.getElementById("winner");
    winner.innerText = `${winnerColor} Wins!`;

    // Add animation class to the winner element
    winner.classList.add("winner-animation");

    // Set the color of the winner text
    winner.style.color = board[r][c] == playerBlue ? "blue" : "yellow";

    gameOver = true;
}

function createNewGameButton() {
    let button = document.createElement("button");
    button.innerText = "New Game";
    button.addEventListener("click", function() {
        location.reload();
    });
    document.body.appendChild(button);
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text/plain");
    let draggedTile = document.getElementById(data);
    let dropZoneId = event.target.id;
    let dropZone = document.getElementById(dropZoneId);

    // Check if the drop zone already has a piece
    if (dropZone.children.length > 0) {
        // Swap the colors
        if (draggedTile.classList.contains("blue-piece")) {
            draggedTile.classList.remove("blue-piece");
            draggedTile.classList.add("yellow-piece");
        } else if (draggedTile.classList.contains("yellow-piece")) {
            draggedTile.classList.remove("yellow-piece");
            draggedTile.classList.add("blue-piece");
        }
    }

    // Append the dragged tile to the drop zone
    dropZone.appendChild(draggedTile);
}