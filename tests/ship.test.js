import { Ship } from "../src/ship";

describe('Ship class', () => {
  test('creates a ship with the given length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
  });

  test('throws error if length is 0 or less', () => {
    expect(() => new Ship(0)).toThrow(RangeError);
    expect(() => new Ship(-5)).toThrow('Ship length must be greater than 0');
  });

  test('hit() increments hits', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test('isSunk() returns false until ship is fully hit', () => {
    const ship = new Ship(2);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('hit() does nothing if ship is already sunk', () => {
    const ship = new Ship(1);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
    ship.hit(); // extra hit shouldn't increase count
    expect(ship.hits).toBe(1);
  });
});