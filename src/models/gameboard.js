import { Ship } from "./ship.js";

class Cell {
  state;
  owner;
  constructor() {
    this.owner = null;   // either a Ship or null
    this.state = "empty"; // "empty" | "occupied" | "hit" | "miss"
  }
}

class Gameboard {
  shipCount;
  ships;
  grid;

  constructor() {
    this.shipCount = 0;
    this.ships = [];
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => new Cell())
    );
  }

  placeShip(ship, x, y, direction = "horizontal") {
    if (!this.#checkValidCoord(x, y)) {
      throw new RangeError(`(${x}, ${y}) : coordinates out of bounds`);
    }

    if (!this.#checkValidPlacement(x, y, ship.length, direction)) {
      throw new Error(`Ship of length ${ship.length} does not fit at (${x}, ${y}) in direction ${direction}`);
    }

    if (this.#checkOverlap(x, y, ship.length, direction)) {
      throw new Error(`Ship overlaps another ship at (${x}, ${y})`);
    }

    for (let i = 0; i < ship.length; i++) {
      const cx = direction === "vertical" ? x + i : x;
      const cy = direction === "horizontal" ? y + i : y;

      const cell = this.grid[cx][cy];
      cell.owner = ship;
      cell.state = "occupied";
    }

    this.ships.push(ship);
    this.shipCount++;
  }

  findShipAt(x, y) {
    if (!this.#checkValidCoord(x, y)) return -1;
    const cell = this.grid[x][y];
    return cell.owner ?? -1;
  }

  receiveAttack(x, y) {
    if (!this.#checkValidCoord(x, y)) return;

    const cell = this.grid[x][y];
    const owner = cell.owner;

    if (owner === null) {
      cell.state = 'miss';
      return;
    }

    if (!(owner instanceof Ship)) {
      throw new TypeError('receiveAttack expects a Ship instance at the target cell');
    }

    if (owner.isSunk()) {
      cell.state = 'miss';
      return;
    }

    owner.hit();
    cell.state = 'hit';
  }

  printBoard() {
    let output = "♯  0 1 2 3 4 5 6 7 8 9\n";

    for (let x = 0; x < 10; x++) {
      let row = `${x}  `;

      for (let y = 0; y < 10; y++) {
        const cell = this.grid[x][y];

        let symbol;
        switch (cell.state) {
          case "empty":
            symbol = ".";
            break;
          case "occupied":
            symbol = "⛴";
            break;
          case "hit":
            symbol = "♰";
            break;
          case "miss":
            symbol = "✘";
            break;
          default:
            symbol = "?";
        }

        row += symbol + " ";
      }

      output += row + "\n";
    }
    console.log(output);
  }

  checkIfAllShipsAreSunk() {
    return this.ships.every(ship => ship.isSunk());
  }

  #checkValidCoord(x, y) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.grid.length &&
      y >= 0 &&
      y < this.grid[0].length
    );
  }

  #checkValidPlacement(x, y, length, direction) {
    if (direction === "horizontal") {
      return y + length <= 10;
    } else if (direction === "vertical") {
      return x + length <= 10;
    }
    return false;
  }

  #checkOverlap(x, y, length, direction) {
    for (let i = 0; i < length; i++) {
      const cx = direction === "vertical" ? x + i : x;
      const cy = direction === "horizontal" ? y + i : y;

      if (this.grid[cx][cy].owner !== null) {
        return true;
      }
    }
    return false;
  }
}

export { Gameboard, Cell };