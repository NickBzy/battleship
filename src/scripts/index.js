import "../styles/styles.css"
import "../styles/placeShips.css"
import "../styles/game.css"
import { Gameboard } from "./Gameboard"
import { Player } from "./Player"
import { Ship } from "./Ship"

const bgVideo = document.querySelector("#bg-video")
bgVideo.playbackRate = 0.5

const inputName = document.querySelector("input")
const errMsg = document.querySelector(".error-msg")

const playerBoard = new Gameboard()
const shipTrackDisplay = document.querySelector("#number")
let currentShipIndex = 0

function placeBoard() {
  const ship2 = new Ship(2)
  const ship31 = new Ship(3)
  const ship32 = new Ship(3)
  const ship4 = new Ship(4)
  const ship5 = new Ship(5)
  const shipsToPlace = [ship2, ship31, ship32, ship4, ship5]

  const board = document.querySelector(".place-board")
  const directionSelect = document.querySelector("#direction")

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div")
      cell.classList.add("place-cell")
      cell.dataset.x = x
      cell.dataset.y = y
      board.appendChild(cell)

      cell.addEventListener("click", () => {
        const dir = directionSelect.value
        const shipLength = shipsToPlace[currentShipIndex].getLength()
        const ship = shipsToPlace[currentShipIndex]
        if (canPlace(x, y, shipLength, dir)) {
          placeShip(x, y, shipLength, dir, ship)
          if (++currentShipIndex >= shipsToPlace.length) {
            closePlaceModal()
            closeHomepage()
            openGamepage()
          }
        }
      })
      cell.addEventListener("mouseenter", () => {
        if (currentShipIndex >= shipsToPlace.length) return
        const dir = directionSelect.value
        const shipLength = shipsToPlace[currentShipIndex].getLength()
        if (canPlace(x, y, shipLength, dir)) {
          for (let i = 0; i < shipLength; i++) {
            const hoverCell =
              dir === "x"
                ? document.querySelector(`[data-x="${x + i}"][data-y="${y}"]`)
                : document.querySelector(`[data-x="${x}"][data-y="${y + i}"]`)
            hoverCell?.classList.add("hover-preview")
          }
        }
      })

      cell.addEventListener("mouseleave", () => {
        document.querySelectorAll(".hover-preview").forEach((cell) => {
          cell.classList.remove("hover-preview")
        })
      })
    }
  }
}

function canPlace(x, y, length, dir) {
  if (dir === "x") {
    if (x + length > 10) return false
    for (let i = 0; i < length; i++) {
      if (playerBoard.board[x + i][y] !== null) return false
    }
  } else {
    if (y + length > 10) return false
    for (let i = 0; i < length; i++) {
      if (playerBoard.board[x][y + i] !== null) return false
    }
  }
  return true
}

function placeShip(x, y, length, dir, ship) {
  for (let i = 0; i < length; i++) {
    const cell =
      dir === "x"
        ? document.querySelector(`[data-x="${x + i}"][data-y="${y}"]`)
        : document.querySelector(`[data-x="${x}"][data-y="${y + i}"]`)
    cell.classList.add("occupied")
  }
  playerBoard.placeShip(ship, x, y, dir)
  shipTrackDisplay.innerText = currentShipIndex + 1
}

function checkValidity(input, message) {
  if (!input.checkValidity()) {
    message.innerHTML = input.validationMessage
    return false
  }
  return true
}

function openPlaceModal() {
  const btn = document.querySelector(".go")
  const placeModal = document.querySelector(".place-ships-modal")
  btn.addEventListener("click", function (event) {
    event.preventDefault()
    if (checkValidity(inputName, errMsg) === false) return
    if (placeModal.classList.contains("active")) {
      placeModal.classList.remove("active")
    } else {
      placeModal.classList.add("active")
      const playerName = document.querySelector("#name")
      playerName.innerText = inputName.value
    }
  })
}

function closePlaceModal() {
  const placeModal = document.querySelector(".place-ships-modal")
  placeModal.classList.remove("active")
}

function closeHomepage() {
  const homepage = document.querySelector(".homepage")
  homepage.classList.add("hidden")
}

function openGamepage() {
  bgVideo.playbackRate = 0.7
  const playerName = document.querySelector("#name-player")
  playerName.innerText = inputName.value
  const gamepage = document.querySelector(".game")
  gamepage.classList.remove("hidden")
  const board = document.querySelector(".place-board")
  const playerSide = document.querySelector(".player")
  playerSide.appendChild(board)
  const cpuBoard = placeEnemyBoard()
  const player = new Player("human")
  const cpu = new Player("computer")
  startGame(player, cpu, playerBoard, cpuBoard)
}

function placeEnemyBoard() {
  const cpuBoard = new Gameboard()
  const cpuDomBoard = document.createElement("div")
  cpuDomBoard.classList.add("enemy-board")
  const cpuDiv = document.querySelector(".cpu")

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div")
      cell.classList.add("enemy-cell")
      cell.dataset.x = x
      cell.dataset.y = y
      cpuDomBoard.appendChild(cell)
    }
  }
  cpuDiv.appendChild(cpuDomBoard)

  const shipsToPlace = [2, 3, 3, 4, 5]

  shipsToPlace.forEach((length) => {
    let placed = false
    while (!placed) {
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 10)
      const dir = Math.random() < 0.5 ? "x" : "y"
      const ship = new Ship(length)
      if (cpuBoard.placeShip(ship, x, y, dir)) {
        for (let i = 0; i < length; i++) {
          const cellSelector =
            dir === "x"
              ? `[data-x="${x + i}"][data-y="${y}"]`
              : `[data-x="${x}"][data-y="${y + i}"]`
          const cell = cpuDomBoard.querySelector(cellSelector)
          cell?.classList.add("has-ship")
        }
        placed = true
      }
    }
  })

  return cpuBoard
}

function startGame(player, enemy, playerBoard, enemyBoard) {
  const enemyCells = document.querySelectorAll(".enemy-cell")

  enemyCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const x = parseInt(cell.dataset.x)
      const y = parseInt(cell.dataset.y)

      // Prevent clicking same cell again
      if (cell.classList.contains("hit") || cell.classList.contains("miss"))
        return

      const result = enemyBoard.receiveAttack(x, y)
      cell.classList.add(result ? "hit" : "miss")

      // Check if enemy has any ships left
      if (!enemyBoard.stillHasShips()) {
        alert("You win!")
        return
      }

      // Enemy's turn
      setTimeout(() => {
        const move = player.availableMoves[player.availableMoves.length - 1] // Peek
        const [x, y] = move
        const attackResult = player.randomAttack(playerBoard)

        const targetCell = document.querySelector(
          `.place-cell[data-x="${x}"][data-y="${y}"]`
        )

        if (targetCell) {
          targetCell.classList.add(attackResult ? "hit" : "miss")
        }

        if (!playerBoard.stillHasShips()) {
          alert("CPU wins!")
        }
      }, 500)
    })
  })
}

openPlaceModal()
placeBoard()
