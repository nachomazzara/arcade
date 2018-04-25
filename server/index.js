const WebSocket = require('ws')
const Draw = require('./snake/draw.js')
const { createCanvas } = require('canvas')


const wss = new WebSocket.Server({ port: 8989 })
wss.on('connection', (ws) => {
  const canvas = createCanvas(200, 200)
  let draw = new Draw(canvas, ws)

  ws.on('message', (message) => {
    console.log(message)
    if (message === 'retry') {
      draw = new Draw(canvas, ws)
    } else {
      draw.setDirection(message)
    }
  })
})
