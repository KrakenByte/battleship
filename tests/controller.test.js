import { initGame } from "../src/controller.js";

describe('Controller', () => {
  beforeEach(() => {
    // reset DOM
    document.body.innerHTML = '';
    // create required DOM nodes
    const playerGrid = document.createElement('div');
    playerGrid.id = 'player-grid';
    document.body.appendChild(playerGrid);

    const computerGrid = document.createElement('div');
    computerGrid.id = 'computer-grid';
    document.body.appendChild(computerGrid);

    const turn = document.createElement('p');
    turn.id = 'turn-indicator';
    document.body.appendChild(turn);

    const status = document.createElement('p');
    status.id = 'game-message';
    document.body.appendChild(status);
  });

  test('initializes both boards with 5 ships each', () => {
    const { player, computer } = initGame('player-grid', 'computer-grid');
    expect(player.board.shipCount).toBe(5);
    expect(computer.board.shipCount).toBe(5);
  });

  test('player ships do not touch (no adjacency)', () => {
    const { player } = initGame('player-grid', 'computer-grid');
    const grid = player.board.grid;

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const owner = grid[x][y].owner;
        if (owner === null) continue;

        // check 8 neighbors for different owners
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= 10 || ny >= 10) continue;
            const nOwner = grid[nx][ny].owner;
            if (nOwner !== null && nOwner !== owner) {
              throw new Error(`Ships touch at (${x},${y}) and (${nx},${ny})`);
            }
          }
        }
      }
    }
  });

  test('clicking computer cell registers attack and computer responds', () => {
    jest.useFakeTimers();

    const { player, computer } = initGame('player-grid', 'computer-grid');

    const compGrid = document.getElementById('computer-grid');
    expect(compGrid).toBeTruthy();

    // pick first cell element
    const cell = compGrid.querySelector('.cell');
    expect(cell).toBeTruthy();

    // map to board coords
    const x = Number(cell.dataset.row);
    const y = Number(cell.dataset.col);

    // initial state should be empty or occupied
    const before = computer.board.grid[x][y].state;

    // click it
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // after click, computer board cell should be hit or miss
    const after = computer.board.grid[x][y].state;
    expect(['hit', 'miss']).toContain(after);

    // advance timers to let computer move
    jest.advanceTimersByTime(700);

    // player board should have at least one cell marked hit or miss
    const playerHasResult = player.board.grid.flat().some(c => c.state === 'hit' || c.state === 'miss');
    expect(playerHasResult).toBe(true);

    jest.useRealTimers();
  });
});
