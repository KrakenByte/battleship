export function renderBoard(board, containerId, { hideShips = false } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    // clear existing cells
    container.innerHTML = "";

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            // store coordinates for later use
            cellDiv.dataset.row = row;
            cellDiv.dataset.col = col;

            const cell = board.grid[row][col];

            if (cell.state === "occupied") {
                if (!hideShips) {
                    cellDiv.classList.add("occupied");
                } else {
                    // show as empty to hide ship positions
                    cellDiv.classList.add("empty");
                }
            } else if (cell.state === "empty") {
                cellDiv.classList.add("empty");
            } else if (cell.state === "hit") {
                cellDiv.classList.add("hit");
            } else if (cell.state === "miss") {
                cellDiv.classList.add("miss");
            }

            container.appendChild(cellDiv);
        }
    }
}

// Note: Player instantiation and DOM-safe bootstrapping is handled in `src/index.js`.