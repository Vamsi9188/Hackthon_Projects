const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');

let grid;
let score = 0;

function createBoard() {
    grid = [];
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            grid[i][j] = 0;
            createTile(i, j, 0);
        }
    }
    addNewTile();
    addNewTile();
    updateBoard();
}

function createTile(row, col, value) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.row = row;
    tile.dataset.col = col;
    tile.dataset.value = value;
    gameBoard.appendChild(tile);
}

function updateBoard() {
    gameBoard.querySelectorAll('.tile').forEach(tile => {
        const row = tile.dataset.row;
        const col = tile.dataset.col;
        const value = grid[row][col];
        tile.dataset.value = value;
        tile.textContent = value > 0 ? value : '';
    });
    scoreElement.textContent = score;
}

function addNewTile() {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyTiles.push({ row: i, col: j });
            }
        }
    }

    if (emptyTiles.length === 0) return;

    const newTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[newTile.row][newTile.col] = Math.random() < 0.9 ? 2 : 4;
}

function moveTiles(direction) {
    let moved = false;
    if (direction === 'up' || direction === 'down') {
        for (let col = 0; col < 4; col++) {
            let merged = [false, false, false, false];
            for (let row = direction === 'up' ? 1 : 2; direction === 'up' ? row < 4 : row >= 0; direction === 'up' ? row++ : row--) {
                if (grid[row][col] === 0) continue;
                let targetRow = direction === 'up' ? row - 1 : row + 1;
                while (targetRow >= 0 && targetRow < 4 && grid[targetRow][col] === 0) {
                    targetRow = direction === 'up' ? targetRow - 1 : targetRow + 1;
                }
                if (targetRow >= 0 && targetRow < 4 && grid[targetRow][col] === grid[row][col] && !merged[targetRow]) {
                    grid[targetRow][col] *= 2;
                    grid[row][col] = 0;
                    score += grid[targetRow][col];
                    merged[targetRow] = true;
                    moved = true;
                } else {
                    targetRow = direction === 'up' ? targetRow + 1 : targetRow - 1;
                    if (targetRow !== row) {
                        grid[targetRow][col] = grid[row][col];
                        grid[row][col] = 0;
                        moved = true;
                    }
                }
            }
        }
    } else if (direction === 'left' || direction === 'right') {
        for (let row = 0; row < 4; row++) {
            let merged = [false, false, false, false];
            for (let col = direction === 'left' ? 1 : 2; direction === 'left' ? col < 4 : col >= 0; direction === 'left' ? col++ : col--) {
                if (grid[row][col] === 0) continue;
                let targetCol = direction === 'left' ? col - 1 : col + 1;
                while (targetCol >= 0 && targetCol < 4 && grid[row][targetCol] === 0) {
                    targetCol = direction === 'left' ? targetCol - 1 : targetCol + 1;
                }
                if (targetCol >= 0 && targetCol < 4 && grid[row][targetCol] === grid[row][col] && !merged[targetCol]) {
                    grid[row][targetCol] *= 2;
                    grid[row][col] = 0;
                    score += grid[row][targetCol];
                    merged[targetCol] = true;
                    moved = true;
                } else {
                    targetCol = direction === 'left' ? targetCol + 1 : targetCol - 1;
                    if (targetCol !== col) {
                        grid[row][targetCol] = grid[row][col];
                        grid[row][col] = 0;
                        moved = true;
                    }
                }
            }
        }
    }

    if (moved) {
        addNewTile();
        updateBoard();
        if (checkGameOver()) {
            alert('Game Over! Final Score: ' + score);
            restartGame();
        }
    }
}

function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
            if (i > 0 && grid[i][j] === grid[i - 1][j]) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
            if (j > 0 && grid[i][j] === grid[i][j - 1]) return false;
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
        }
    }
    return true;
}

function restartGame() {
    score = 0;
    gameBoard.innerHTML = '';
    createBoard();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') moveTiles('up');
    if (e.key === 'ArrowDown') moveTiles('down');
    if (e.key === 'ArrowLeft') moveTiles('left');
    if (e.key === 'ArrowRight') moveTiles('right');
});

restartButton.addEventListener('click', restartGame);

createBoard();
