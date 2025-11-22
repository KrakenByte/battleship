import { Gameboard, Cell } from "../src/models/gameboard.js";
import Ship from "../src/models/ship.js";

describe("Gameboard", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  test("initializes a 10x10 grid filled with empty cells", () => {
    expect(board.grid.length).toBe(10);
    for (const row of board.grid) {
      expect(row.length).toBe(10);
      expect(row.every(cell => cell instanceof Cell)).toBe(true);
    }
  });

  test("places a ship at valid coordinates", () => {
    const ship = new Ship(1);
    board.placeShip(ship, 2, 3);

    expect(board.grid[2][3].owner).toBe(ship);
    expect(board.grid[2][3].state).toBe("occupied");
    expect(board.ships).toContain(ship);
    expect(board.shipCount).toBe(1);
  });

  test("hits the ship at specified coordinates", () => {
    const ship = new Ship(1);
    board.placeShip(ship, 1, 1);

    board.receiveAttack(1, 1);
    expect(board.findShipAt(1, 1).hits).toEqual(1);
  });

  test("sinks ship if hit enough times", () => {
    const ship = new Ship(2);
    board.placeShip(ship, 1, 1, "horizontal");

    board.receiveAttack(1, 1);
    expect(ship.hits).toEqual(1);

    board.receiveAttack(1, 2);
    expect(ship.hits).toEqual(2);
    expect(ship.isSunk()).toBeTruthy();
  });

  test("sets cell state to miss if there's no ship at specified coordinates", () => {
    board.receiveAttack(4, 4);
    expect(board.grid[4][4].state).toEqual("miss");
  });

  test("throws an error for out-of-bounds coordinates", () => {
    const ship = new Ship(1);
    expect(() => board.placeShip(ship, 15, 0)).toThrow(RangeError);
    expect(() => board.placeShip(ship, -1, 0)).toThrow(RangeError);
  });

  test("throws an error when placing a ship overlapping another (horizontal)", () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(2);

    board.placeShip(ship1, 0, 0, "horizontal");

    expect(() => board.placeShip(ship2, 0, 2, "horizontal"))
      .toThrow("Ship overlaps another ship");
  });

  test("throws an error when placing a ship overlapping another (vertical)", () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(2);

    board.placeShip(ship1, 0, 0, "vertical");

    expect(() => board.placeShip(ship2, 2, 0, "vertical"))
      .toThrow("Ship overlaps another ship");
  });

  test("does NOT allow placing a ship fully on top of another", () => {
    const ship1 = new Ship(4);
    const ship2 = new Ship(4);

    board.placeShip(ship1, 5, 5, "horizontal");

    expect(() => board.placeShip(ship2, 5, 5, "horizontal")).toThrow();
  });

  test("does NOT allow partial overlap in mixed directions", () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(3);

    board.placeShip(ship1, 2, 2, "horizontal");
    expect(() => board.placeShip(ship2, 0, 3, "vertical")).toThrow();
  });

  test("allows valid adjacent placement that is not overlapping", () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(3);

    board.placeShip(ship1, 4, 4, "horizontal");
    expect(() => board.placeShip(ship2, 3, 4, "horizontal")).not.toThrow();
  });

  test("findShipAt returns -1 for invalid coordinates", () => {
    expect(board.findShipAt(-1, 0)).toBe(-1);
    expect(board.findShipAt(0, 20)).toBe(-1);
  });

  test("receiveAttack does nothing for out-of-bounds coordinates", () => {
    expect(board.receiveAttack(99, 99)).toBeUndefined();
  });

  test("receiveAttack on empty cell leaves owner null", () => {
    board.receiveAttack(3, 3);
    expect(board.grid[3][3].owner).toBeNull();
    expect(board.grid[3][3].state).toBe("miss");
  });

  test("throws error for invalid direction string", () => {
    const ship = new Ship(3);
    expect(() => board.placeShip(ship, 0, 0, "diagonal")).toThrow();
  });

  test("throws error when ship does not fit vertically", () => {
    const ship = new Ship(5);
    expect(() => board.placeShip(ship, 8, 0, "vertical")).toThrow();
  });

  test("throws error when ship does not fit horizontally", () => {
    const ship = new Ship(5);
    expect(() => board.placeShip(ship, 0, 7, "horizontal")).toThrow();
  });

  test("receiveAttack marks miss when hitting a sunk ship again", () => {
    const ship = new Ship(1);
    board.placeShip(ship, 2, 2);

    board.receiveAttack(2, 2); // sink
    board.receiveAttack(2, 2); // should mark miss

    expect(board.grid[2][2].state).toBe("miss");
  });
  test("checkIfAllShipsAreSunk returns true only when all ships are sunk", () => {
    const ship1 = new Ship(2);
    const ship2 = new Ship(3);
    board.placeShip(ship1, 0, 0, "horizontal");
    board.placeShip(ship2, 1, 0, "vertical");
    // Sink ship1
    board.receiveAttack(0, 0);
    board.receiveAttack(0, 1);
    expect(board.checkIfAllShipsAreSunk()).toBe(false);
    // Sink ship2
    board.receiveAttack(1, 0);
    board.receiveAttack(2, 0);
    board.receiveAttack(3, 0);
    expect(board.checkIfAllShipsAreSunk()).toBe(true);
  });
});