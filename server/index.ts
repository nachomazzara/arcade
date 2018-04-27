import * as WebSocket  from 'ws'
import { SnakeGame } from './games/SnakeGame'
const { createCanvas } = require('canvas')

const wss = new WebSocket.Server({ port: 8080 })
wss.on('connection', (ws) => {
  const canvas = createCanvas(350, 350)
  let game = new SnakeGame(canvas, ws)
  ws.on('message', (message: string) => {
    if (message === 'retry') {
      game.stop()
      game.restart()
    }
  })
})
