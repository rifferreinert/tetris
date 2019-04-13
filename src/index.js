import * as gameInfo from './store/gameInfo'
import { configureStore } from './store'
import drawGame from './drawGame'
import { KEY } from './constants'
import { fetchLocalHighScore, getNumberOfLines } from './store/score'
import { getDropSpeedInMS, incrementStartingLevel } from './store/level'
import { moveDown, moveLeft, moveRight, rotate } from './store/tetromino'

const store = configureStore()
const { dispatch } = store

store.subscribe(() => {
  drawGame(store.getState())
  if (typeof Qualtrics !== 'undefined') {
    Qualtrics.SurveyEngine.setEmbeddedData('row_count', getNumberOfLines(store.getState()));
  }
})

dispatch(gameInfo.resizeGame())
dispatch(fetchLocalHighScore())
start()

window.addEventListener('resize', () => dispatch(gameInfo.resizeGame()))
document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', handleKeyUp)

function start() {
  if (gameInfo.isGameStarted(store.getState())) {
    dispatch(moveDown())
  }
  setTimeout(start, getDropSpeedInMS(store.getState()))
}

function handleKeyDown(e) {
  const isGameStarted = gameInfo.isGameStarted(store.getState())
  if (isGameStarted) {
    switch (e.keyCode) {
      case KEY.LEFT:
        e.preventDefault();
        dispatch(moveLeft())
        break
      case KEY.RIGHT:
        e.preventDefault();
        dispatch(moveRight())
        break
      case KEY.DOWN:
        e.preventDefault();
        if (!boring) {
          dispatch(moveDown())
          dispatch(gameInfo.setIsSoftDropping(true))
        }
        break
      case KEY.UP:
        e.preventDefault();
        dispatch(rotate())
        break
    }
  } else {
    switch (e.keyCode) {
      case KEY.SPACE:
        dispatch(gameInfo.startGame())
        break
      case KEY.I:
        dispatch(incrementStartingLevel())
        break
    }
  }
}

function handleKeyUp(e) {
  if (gameInfo.isGameStarted(store.getState()) && e.keyCode === KEY.DOWN) {
    dispatch(gameInfo.setIsSoftDropping(false))
  }
}
