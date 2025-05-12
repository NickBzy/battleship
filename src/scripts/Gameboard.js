import { Ship } from "./Ship"
class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null))
  }

  placeShip(ship, startPointX, startPointY, direction) {
    if (direction === "x" && startPointX + ship.length > this.board.length)
      return false
    if (direction === "y" && startPointY + ship.length > this.board[0].length)
      return false
    // Check every space is unoccupied for the ship to be placed
    for (let i = 0; i < ship.length; i++) {
      if (direction === "x") {
        if (this.board[startPointX + i][startPointY] !== null) return false
      } else if (direction === "y") {
        if (this.board[startPointX][startPointY + i] !== null) return false
      }
    }

    for (let i = 0; i < ship.length; i++) {
      if (direction === "x") {
        this.board[startPointX + i][startPointY] = ship
      } else if (direction === "y") {
        this.board[startPointX][startPointY + i] = ship
      }
    }
    return true
  }

  receiveAttack(x, y) {
    // Check if spot is already hit
    if (this.board[x][y] === "X") return false
    else if (this.board[x][y] instanceof Ship) {
      this.board[x][y].hit()
      this.board[x][y] = "X"
      return true
    } else if (this.board[x][y] === null) {
      this.board[x][y] = "X"
      return false
    }
  }

  stillHasShips() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] instanceof Ship) return true
      }
    }
    return false
  }
}

export { Gameboard }
