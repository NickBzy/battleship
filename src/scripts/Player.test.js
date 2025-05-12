import { Player } from "./Player"

const mockBoard = () => ({
  receiveAttack: jest.fn().mockReturnValue(true),
})

describe("Player class", () => {
  test("initializes with 100 available moves", () => {
    const player = new Player("human")
    expect(player.availableMoves.length).toBe(100)
  })

  test("toggle turn works correctly", () => {
    const player = new Player("human")
    expect(player.getTurn()).toBe(false)
    player.setTurn()
    expect(player.getTurn()).toBe(true)
    player.setTurn()
    expect(player.getTurn()).toBe(false)
  })

  test("attack calls receiveAttack on enemy board", () => {
    const player = new Player("human")
    const enemyBoard = mockBoard()
    const result = player.attack(2, 3, enemyBoard)

    expect(enemyBoard.receiveAttack).toHaveBeenCalledWith(2, 3)
    expect(result).toBe(true)
  })

  test("randomAttack pops a move and attacks", () => {
    const player = new Player("computer")
    const initialLength = player.availableMoves.length
    const enemyBoard = mockBoard()

    const result = player.randomAttack(enemyBoard)

    expect(enemyBoard.receiveAttack).toHaveBeenCalled()
    expect(player.availableMoves.length).toBe(initialLength - 1)
    expect(result).toBe(true)
  })

  test("randomAttack returns null if no moves left", () => {
    const player = new Player("computer")
    player.availableMoves = []
    const enemyBoard = mockBoard()
    const result = player.randomAttack(enemyBoard)
    expect(result).toBe(null)
  })
})
