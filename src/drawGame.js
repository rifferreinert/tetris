import { BOARD, COLORS } from './constants'
import { forEachBlock } from './utils'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
document.body.appendChild(canvas)

let blockSize

export default function drawGame (state) {
  resizeCanvas(canvas, state)
  drawGrid(state)
  if (state.gameInfo.started) {
    drawCurrentTetrimino(state)
  } else {
    drawStartScreen(state)
  }
}

function drawStartScreen (state) {
  ctx.fillStyle = 'black'
  ctx.fillText('Press <space> to start', blockSize * 1.5,
    (BOARD.HEIGHT * blockSize) / 2.1)
  if (state.gameInfo.gameOver) {
    ctx.fillText('Game over', blockSize * 3.4, (BOARD.HEIGHT * blockSize) / 4)
  }
}

function drawGrid (state) {
  state.grid.forEach((row, y) => {
    row.forEach((color, x) => {
      drawGridSquare(x, y, color)
    })
  })
}

function drawCurrentTetrimino (state) {
  const { tetromino } = state
  forEachBlock(tetromino, (x, y) => {
    drawGridSquare(x, y, tetromino.color)
  })
}

function drawGridSquare (x, y, color) {
  color = color || COLORS.LIGHT_GRAY
  drawSquare(x * blockSize, y * blockSize, blockSize, color)
}

function drawSquare (x, y, width, color) {
  ctx.beginPath()
  ctx.rect(x, y, width, width)
  ctx.fillStyle = color
  ctx.strokeStyle = COLORS.LIGHT_GRAY
  ctx.lineWidth = blockSize / 10
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}

function getPixelRatio () {
  const ctx = document.createElement('canvas').getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1
  return dpr / bsr
}

function resizeCanvas (canvas, state) {
  const { width, height } = state.gameInfo
  const ratio = getPixelRatio()
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
  blockSize = height / 20
  ctx.font = `${blockSize / 2}px "Roboto Mono", monospace`
}
