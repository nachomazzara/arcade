const WebSocket = require('ws')
const Draw = require('./snake/draw.js')
const { createCanvas } = require('canvas')

const wss = new WebSocket.Server({ port: 8989 })
wss.on('connection', ws => {
  const canvas = createCanvas(350, 350)
  let draw = new Draw(canvas, ws)

  ws.on('message', message => {
    if (message === 'retry') {
      draw.endGame()
      draw = new Draw(canvas, ws)
    } else {
      draw.setDirection(message)
    }
  })
})
