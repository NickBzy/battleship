class Ship {
  constructor(length) {
    this.length = length
    this.hits = 0
    this.sunk = false
  }

  hit() {
    this.hits += 1
  }

  isSunk() {
    if (this.hits === this.length) return true
    else return false
  }

  getLength() {
    return this.length
  }

  getHits() {
    return this.hits
  }

  getSunk() {
    return this.sunk
  }
}

export { Ship }
