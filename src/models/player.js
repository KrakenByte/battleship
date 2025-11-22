const Gameboard = require("./gameboard");
const Ship = require("./ship");

class Player {
    constructor(type = "human") {
        this.type = type;
    }
    board = new Gameboard();
}
module.exports = Player;