class Player {
  constructor(type) {
    this.availableMoves = []
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.availableMoves.push([x, y])
      }
    }
    this.shuffleMoves()
    this.type = type
    this.turn = false
  }

  shuffleMoves() {
    for (let i = this.availableMoves.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.availableMoves[i], this.availableMoves[j]] = [
        this.availableMoves[j],
        this.availableMoves[i],
      ]
    }
  }

  getTurn() {
    return this.turn
  }

  setTurn() {
    this.turn = !this.turn
  }

  attack(x, y, enemyBoard) {
    return enemyBoard.receiveAttack(x, y)
  }

  randomAttack(enemyBoard) {
    if (this.availableMoves.length === 0) return null

    const [x, y] = this.availableMoves.pop()
    return enemyBoard.receiveAttack(x, y)
  }
}

export { Player }
