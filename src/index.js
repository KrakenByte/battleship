const Ship = require('./ship.js');
const Gameboard = require("./gameboard.js").Gameboard;

const board = new Gameboard()
board.placeShip(new Ship(2), 1, 4)
board.receiveAttack(1, 4)
board.printBoard()