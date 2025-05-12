import { Gameboard } from "./Gameboard"
import { Ship } from "./Ship"

describe("Gameboard Class", () => {
  test("initialize Gameboard with correct size and defaults", () => {
    const gameboard = new Gameboard()
    expect(gameboard.board.length).toBe(10)
    expect(gameboard.board[0].length).toBe(10)
    expect(gameboard.board[0][0]).toBe(null)
    expect(gameboard.board[7][7]).toBe(null)
  })

  test("placeship function places ship in correct spot", () => {
    const ship = new Ship(4)
    const gameboard = new Gameboard()
    expect(gameboard.placeShip(ship, 0, 0, "x")).toBe(true)
    expect(gameboard.placeShip(ship, 1, 1, "y")).toBe(true)
    // Place ship where another ship is already placed should not work
    expect(gameboard.placeShip(ship, 3, 0, "x")).toBe(false)
    // Place ship at edge of board where not enough space is given should not work
    expect(gameboard.placeShip(ship, 7, 0, "x")).toBe(false)
    expect(gameboard.placeShip(ship, 0, 7, "y")).toBe(false)
  })

  test("receiveAttack function launches an attack on a specific coordinate", () => {
    const ship = new Ship(4)
    const gameboard = new Gameboard()
    gameboard.placeShip(ship, 0, 0, "x")
    // Launches attack on ship
    expect(ship.getHits()).toBe(0)
    expect(gameboard.receiveAttack(0, 0)).toBe(true)
    expect(ship.getHits()).toBe(1)
    // Two attacks on same coordinate should return false
    expect(gameboard.receiveAttack(0, 0)).toBe(false)
    expect(ship.getHits()).toBe(1)
    // An attack on a coordinate where no ships are placed should return true
    expect(gameboard.receiveAttack(0, 1)).toBe(true)
    expect(ship.getHits()).toBe(1)
  })

  test("stillHasShips function returns true if at least one ship still present on board", () => {
    const ship = new Ship(4)
    const gameboard = new Gameboard()
    // test before any ships have been placed
    expect(gameboard.stillHasShips()).toBe(false)
    gameboard.placeShip(ship, 0, 0, "x")
    // test when ship has just been placed
    expect(gameboard.stillHasShips()).toBe(true)
    // hit ship completely
    expect(gameboard.receiveAttack(0, 0)).toBe(true)
    expect(gameboard.receiveAttack(1, 0)).toBe(true)
    expect(gameboard.receiveAttack(2, 0)).toBe(true)
    expect(gameboard.receiveAttack(3, 0)).toBe(true)
    expect(ship.isSunk()).toBe(true)
    expect(gameboard.stillHasShips()).toBe(false)
  })
})
