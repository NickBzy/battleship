import { Ship } from "./Ship"

describe("Ship class", () => {
  test("initializes with correct length and defaults", () => {
    const ship = new Ship(3)
    expect(ship.length).toBe(3)
    expect(ship.hits).toBe(0)
    expect(ship.sunk).toBe(false)
  })

  test("hit() increases hit count", () => {
    const ship = new Ship(2)
    ship.hit()
    expect(ship.getHits()).toBe(1)
  })

  test("sunk when a ship of length 3 gets hit 3 times", () => {
    const ship = new Ship(3)
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBe(false)
    ship.hit()
    expect(ship.isSunk()).toBe(true)
  })
})
