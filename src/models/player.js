import { Gameboard } from "./gameboard.js";

class Player {
    constructor(type = "human") {
        this.type = type;
    }
    board = new Gameboard();
}

export { Player };