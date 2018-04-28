import { config, Direction } from '../snake/config'
import Game from './Game'
const { createCanvas } = require('canvas')

export interface ISnakeGameConfig {
  snakeSize: number
  w: number
  h: number
  direction: Direction
  updateRate: number
}

export class SnakeGame extends Game<ISnakeGameConfig> {
  score: number = 0
  canvas: any
  ctx: any
  w: number
  h: number
  direction: Direction = config.direction
  snakeSize: number = config.snakeSize
  food: any
  skipRate: number = 6
  snake:
    | {
        x: number
        y: number
      }[]
    | null = null

  constructor() {
    super(config)
    this.w = config.w
    this.h = config.h
    this.canvas = createCanvas(350, 350)
    this.ctx = this.canvas.getContext('2d')
    this.initialize()
  }

  initialize() {
    this.direction = config.direction
    this.snakeSize = config.snakeSize
    this.score = 0
    this.drawSnake()
    this.createFood()
  }

  restart() {
    this.initialize()
    this.start()
  }

  onMessage(msg: any) {
    this.setDirection(msg.payload.input as Direction)
  }

  setDirection(dir: Direction) {
    switch (dir) {
      case 'left':
        if (this.direction !== 'right') {
          this.direction = dir
        }
        break

      case 'right':
        if (this.direction !== 'left') {
          this.direction = dir
        }
        break

      case 'up':
        if (this.direction !== 'down') {
          this.direction = dir
        }
        break

      case 'down':
        if (this.direction !== 'up') {
          this.direction = dir
        }
        break
    }
  }

  bodySnake(x: number, y: number) {
    this.ctx.fillStyle = 'green'
    this.ctx.fillRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize)
    this.ctx.strokeStyle = 'darkgreen'
    this.ctx.strokeRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize)
  }

  pizza(x: number, y: number) {
    this.ctx.fillStyle = 'yellow'
    this.ctx.fillRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize)
    this.ctx.fillStyle = 'red'
    this.ctx.fillRect(x * this.snakeSize + 1, y * this.snakeSize + 1, this.snakeSize - 2, this.snakeSize - 2)
  }

  drawSnake() {
    var length = 4
    this.snake = []
    for (var i = length - 1; i >= 0; i--) {
      this.snake.push({ x: i, y: 0 })
    }
  }

  update() {
    if (this.skipRate < 1) {
      this.skipRate++
      return
    }
    this.skipRate = 0
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.w, this.h)
    this.ctx.strokeStyle = 'black'
    this.ctx.strokeRect(0, 0, this.w, this.h)

    // btn.setAttribute('disabled', true)

    var snakeX = this.snake![0].x
    var snakeY = this.snake![0].y

    if (this.direction === 'right') {
      snakeX++
    } else if (this.direction === 'left') {
      snakeX--
    } else if (this.direction === 'up') {
      snakeY--
    } else if (this.direction === 'down') {
      snakeY++
    }

    if (
      snakeX === -1 ||
      snakeX === this.w / this.snakeSize ||
      snakeY === -1 ||
      snakeY === this.h / this.snakeSize ||
      this.checkCollision(snakeX, snakeY, this.snake!)
    ) {
      this.ctx.clearRect(0, 0, this.w, this.h)
      this.stop()
      this.emit('game_end')
      return
    }
    let tail
    if (snakeX === this.food.x && snakeY === this.food.y) {
      tail = { x: snakeX, y: snakeY } //Create a new head instead of moving the tail
      this.score++

      this.createFood() //Create new food
    } else {
      tail = this.snake!.pop() //pops out the last cell
      tail!.x = snakeX
      tail!.y = snakeY
    }
    //The snake can now eat the food.
    this.snake!.unshift(tail!) //puts back the tail as the first cell

    for (let i = 0; i < this.snake!.length; i++) {
      this.bodySnake(this.snake![i].x, this.snake![i].y)
    }

    this.pizza(this.food.x, this.food.y)
    this.emit('game_update', {
      score: this.score,
      src: this.canvas.toDataURL(),
      updateRate: this.config.updateRate
    })
  }

  createFood() {
    this.food = {
      x: Math.floor(Math.random() * 30 + 1),
      y: Math.floor(Math.random() * 30 + 1)
    }

    for (var i = 0; i > this.snake!.length; i++) {
      const snakeX = this.snake![i].x
      const snakeY = this.snake![i].y

      if ((this.food.x === snakeX && this.food.y === snakeY) || (this.food.y === snakeY && this.food.x === snakeX)) {
        this.food.x = Math.floor(Math.random() * 30 + 1)
        this.food.y = Math.floor(Math.random() * 30 + 1)
      }
    }
  }

  checkCollision(x: number, y: number, array: { x: number; y: number }[]) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].x === x && array[i].y === y) return true
    }
    return false
  }
}
