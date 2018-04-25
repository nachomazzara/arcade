class Draw {
  constructor (canvas, websocket) {
    this.snakeSize = 10
    this.w = 350
    this.h = 350
    this.score = 0
    this.snake
    this.snakeSize = 10
    this.food
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ws = websocket
    this.direction = 'down'
    this.drawSnake()
    this.createFood()
    this.paint = this.paint.bind(this)
    this.gameloop = setInterval(this.paint, 500)
  }

  setDirection (dir) {
    this.direction = dir
  }

  bodySnake (x, y) {
    this.ctx.fillStyle = 'green'
    this.ctx.fillRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize)
    this.ctx.strokeStyle = 'darkgreen'
    this.ctx.strokeRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize)
  }

  pizza (x, y) {
    this.ctx.fillStyle = 'yellow'
    this.ctx.fillRect(x * this.snakeSize, y * this.snakeSize, this.snakeSize, this.snakeSize)
    this.ctx.fillStyle = 'red'
    this.ctx.fillRect(x * this.snakeSize + 1, y * this.snakeSize + 1, this.snakeSize - 2, this.snakeSize - 2)
  }

  scoreText () {
    var score_text = "Score: " + this.score
    this.ctx.fillStyle = 'blue'
    this.ctx.fillText(score_text, 145, this.h - 5)
  }

  drawSnake () {
    var length = 4
    this.snake = []
    for (var i = length - 1; i >= 0; i--) {
      this.snake.push({x: i, y: 0})
    }
  }

  paint () {
    this.ctx.fillStyle = 'lightgrey'
    this.ctx.fillRect(0, 0, this.w, this.h)
    this.ctx.strokeStyle = 'black'
    this.ctx.strokeRect(0, 0, this.w, this.h)

    // btn.setAttribute('disabled', true)

    var snakeX = this.snake[0].x
    var snakeY = this.snake[0].y

    if (this.direction == 'right') {
      snakeX++
    }
    else if (this.direction == 'left') {
      snakeX--
    }
    else if (this.direction == 'up') {
      snakeY--
    } else if (this.direction == 'down') {
      snakeY++
    }

    if (snakeX == -1 || snakeX == this.w / this.snakeSize || snakeY == -1 || snakeY == this.h / this.snakeSize || this.checkCollision(snakeX, snakeY, this.snake)) {
      this.ctx.clearRect(0, 0, this.w, this.h)
      this.gameloop = clearInterval(this.gameloop)
      return
    }

    if (snakeX == this.food.x && snakeY == this.food.y) {
      var tail = {x: snakeX, y: snakeY} //Create a new head instead of moving the tail
      this.score++

      this.createFood() //Create new food
    } else {
      var tail = this.snake.pop() //pops out the last cell
      tail.x = snakeX
      tail.y = snakeY
    }
    //The snake can now eat the food.
    this.snake.unshift(tail) //puts back the tail as the first cell

    for (var i = 0; i < this.snake.length; i++) {
      this.bodySnake(this.snake[i].x, this.snake[i].y)
    }

    this.pizza(this.food.x, this.food.y)
    this.scoreText()
    this.ws.send(this.canvas.toDataURL())
  }

  createFood () {
    this.food = {
      x: Math.floor((Math.random() * 30) + 1),
      y: Math.floor((Math.random() * 30) + 1)
    }

    for (var i = 0; i > this.snake.length; i++) {
      var snakeX = this.snake[i].x
      var snakeY = this.snake[i].y

      if (this.food.x === snakeX && this.food.y === snakeY || this.food.y === snakeY && this.food.x === snakeX) {
        this.food.x = Math.floor((Math.random() * 30) + 1)
        this.food.y = Math.floor((Math.random() * 30) + 1)
      }
    }
  }

  checkCollision (x, y, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].x === x && array[i].y === y)
        return true
    }
    return false
  }
}

module.exports = Draw
