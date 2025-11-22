function renderBoard(board, containerId) {
    const container = document.getElementById(containerId);
    for (let row = 0; row < 10; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        for (let col = 0; col < 10; col++) {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            const cell = board.grid[row][col];
            switch (cell.state) {
                case "empty":
                    cellDiv.classList.add("empty");
                    break;
                case "occupied":
                    cellDiv.classList.add("occupied");
                    break;
                case "hit":
                    cellDiv.classList.add("hit");
                    break;
                case "miss":
                    cellDiv.classList.add("miss");
                    break;
            }
            rowDiv.appendChild(cellDiv);
        }
        container.appendChild(rowDiv);
    }
}

const player = new Player("human");
const computer = new Player("computer");

renderBoard(player.board, "player-board");
renderBoard(computer.board, "computer-board");