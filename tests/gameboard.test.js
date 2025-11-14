import { Gameboard, Cell } from "../src/gameboard.js";
import Ship from "../src/ship.js";

describe("Gameboard", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  test("initializes a 10x10 grid filled with null", () => {
    expect(board.grid.length).toBe(10);
    for (const row of board.grid) {
      expect(row.length).toBe(10);
      expect(row.every(cell => cell instanceof Cell)).toBe(true);
    }
  });

  test("places a ship at valid coordinates", () => {
    const ship = new Ship();
    const mockCell = new Cell();
    mockCell.state = "occupied";
    mockCell.owner = ship;
    board.placeShip(ship, 2, 3);
    expect(board.grid[2][3]).toStrictEqual(mockCell);
    expect(board.ships).toContain(ship);
    expect(board.shipCount).toBe(1);
  });

  test("hits the ship at specified coordinates", () => {
    const ship = new Ship();
    board.placeShip(ship, 1, 1);
    board.receiveAttack(1, 1);
    expect(board.findShipAt(1, 1).hits).toEqual(1);
  })

  test("sinks ship if hit enough times", () => {
    const ship = new Ship(2);
    board.placeShip(ship, 1, 1);
    board.receiveAttack(1, 1);
    expect(ship.hits).toEqual(1);
    board.receiveAttack(1, 1);
    expect(ship.hits).toEqual(2);
    expect(ship.isSunk()).toBeTruthy();
    board.receiveAttack(1, 1);
    expect(ship.hits).toEqual(2);
  })

  test("set cell state to miss if there's no ship at specified coordinates", () => {
    const ship = new Ship();
    board.placeShip(ship, 1, 1);
    board.receiveAttack(4, 4); // Empty cell
    expect(board.grid[4][4].state).toEqual("miss");
  })

  test("throws an error for out-of-bounds coordinates", () => {
    const ship = new Ship();
    expect(() => board.placeShip(ship, 15, 0)).toThrow(RangeError);
    expect(() => board.placeShip(ship, -1, 0)).toThrow(RangeError);
  });

  test("checkValidCoord should return correct boolean values", () => {
    // Use reflection to test private method (indirectly)
    expect(() => board.placeShip({}, 9, 9)).not.toThrow();
    expect(() => board.placeShip({}, 10, 9)).toThrow();
  });

  test("throws error if receiveAttack argument is not a ship instance", () => {
    const fakeShip = {};
    board.placeShip(fakeShip, 1, 1);
     expect(() => board.receiveAttack(1, 1)).toThrow(TypeError);
  });
});
