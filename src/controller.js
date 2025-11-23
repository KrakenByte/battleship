import { Player } from "./models/player.js";
import { Ship } from "./models/ship.js";
import { renderBoard } from "./renderer.js";

function placeFleetRandomly(board, { noTouch = false } = {}) {
  const shipLengths = [5, 4, 3, 3, 2];

  for (const length of shipLengths) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      attempts++;
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      try {
        // if noTouch is requested, ensure surrounding cells are clear (no adjacency)
        if (noTouch) {
          if (!canPlaceShipWithoutTouching(board, x, y, length, direction)) {
            continue;
          }
        }

        const ship = new Ship(length);
        board.placeShip(ship, x, y, direction);
        placed = true;
      } catch (e) {
        // placement failed, try again
      }
    }
    if (!placed) {
      throw new Error(`Could not place ship of length ${length}`);
    }
  }
}

function canPlaceShipWithoutTouching(board, x, y, length, direction) {
  // Determine ship coverage
  const startX = direction === 'vertical' ? x : x;
  const startY = direction === 'horizontal' ? y : y;
  const endX = direction === 'vertical' ? x + length - 1 : x;
  const endY = direction === 'horizontal' ? y + length - 1 : y;

  // Calculate padded rectangle (one cell around ship)
  const padStartX = Math.max(0, startX - 1);
  const padStartY = Math.max(0, startY - 1);
  const padEndX = Math.min(board.grid.length - 1, endX + 1);
  const padEndY = Math.min(board.grid[0].length - 1, endY + 1);

  // Ensure all cells in padded rectangle have no owner
  for (let rx = padStartX; rx <= padEndX; rx++) {
    for (let ry = padStartY; ry <= padEndY; ry++) {
      if (board.grid[rx][ry].owner !== null) return false;
    }
  }

  // Also ensure the ship would fit within bounds (board.placeShip checks this, but pre-check here)
  if (startX < 0 || startY < 0) return false;
  if (endX >= board.grid.length || endY >= board.grid[0].length) return false;

  return true;
}

function pickRandomUntriedCell(board) {
  let x, y;
  do {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
  } while (board.grid[x][y].state === "hit" || board.grid[x][y].state === "miss");
  return { x, y };
}

export function initGame(playerGridId = "player-grid", computerGridId = "computer-grid") {
  const player = new Player("human");
  const computer = new Player("computer");

  // populate both boards; keep player's ships separated (no touching)
  placeFleetRandomly(player.board, { noTouch: true });
  placeFleetRandomly(computer.board);


  // initial render (hide computer ships)
  renderBoard(player.board, playerGridId, { hideShips: false });
  renderBoard(computer.board, computerGridId, { hideShips: true });

  const compGrid = document.getElementById(computerGridId);
  const playerGrid = document.getElementById(playerGridId);
  const statusEl = document.getElementById('game-message');
  const turnEl = document.getElementById('turn-indicator');
  const regenBtn = document.getElementById('regen-player');

  let busy = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text || '';
  }

  function setTurn(text) {
    if (turnEl) turnEl.textContent = text || '';
  }

  function setDisabled(el, disabled) {
    if (!el) return;
    if (disabled) el.classList.add('disabled');
    else el.classList.remove('disabled');
  }

  // initial UI
  setTurn('Current Turn: You');
  setStatus('Place your attack on the computer board.');

  if (compGrid) {
    compGrid.addEventListener("click", (ev) => {
      if (busy) return;
      const cellEl = ev.target.closest('.cell');
      if (!cellEl) return;
      const x = Number(cellEl.dataset.row);
      const y = Number(cellEl.dataset.col);

      // ignore already tried cells
      const target = computer.board.grid[x][y];
      if (target.state === 'hit' || target.state === 'miss') return;

      // Player attacks computer
      computer.board.receiveAttack(x, y);
      renderBoard(computer.board, computerGridId, { hideShips: true });

      // Check win
      if (computer.board.checkIfAllShipsAreSunk()) {
        setStatus('You win!');
        setTurn('Game Over');
        setDisabled(compGrid, true);
        setDisabled(playerGrid, true);
        busy = true;
        return;
      }

      // Computer turn: show waiting state and disable input
      busy = true;
      setTurn('Current Turn: Computer');
      setStatus('Computer is thinking...');
      setDisabled(compGrid, true);
      setDisabled(playerGrid, true);

      setTimeout(() => {
        const { x: cx, y: cy } = pickRandomUntriedCell(player.board);
        player.board.receiveAttack(cx, cy);
        renderBoard(player.board, playerGridId, { hideShips: false });

        if (player.board.checkIfAllShipsAreSunk()) {
          setStatus('Computer wins!');
          setTurn('Game Over');
          setDisabled(compGrid, true);
          setDisabled(playerGrid, true);
          busy = true;
          return;
        }

        // back to player
        busy = false;
        setTurn('Current Turn: You');
        setStatus('Your move.');
        setDisabled(compGrid, false);
        setDisabled(playerGrid, false);
      }, 600);
    });
  }

  // Regenerate player's ships on demand
  if (regenBtn) {
    regenBtn.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      setStatus('Shuffling your ships...');
      setDisabled(compGrid, true);
      setDisabled(playerGrid, true);

      // create a fresh player board and place ships no-touch
      const tmp = new Player('human');
      placeFleetRandomly(tmp.board, { noTouch: true });
      player.board = tmp.board;
      renderBoard(player.board, playerGridId, { hideShips: false });

      setTimeout(() => {
        setStatus('Your ships have been shuffled.');
        setDisabled(compGrid, false);
        setDisabled(playerGrid, false);
        busy = false;
      }, 200);
    });
  }

  return { player, computer };
}
