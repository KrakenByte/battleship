class Ship {
  #hits;
  length;
  coords;
  constructor(length) {
    if (length <= 0) {
        throw new RangeError("Ship length must be greater than 0");
    }
    this.#hits = 0;
    this.length = length; 
  }
  get hits() {
    return this.#hits;
  }
  hit() {
    if (!this.isSunk()) {
      this.#hits++;
    }
  }
  isSunk() {
    return this.hits >= this.length;
  }
}

module.exports = Ship;