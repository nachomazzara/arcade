export interface IGameConfig {
  updateRate: number
}

abstract class Game<T extends IGameConfig> {
  config: T
  gameloop: NodeJS.Timer | null = null

  constructor(config: T) {
    this.config = config
    this.update = this.update.bind(this)
    this.start()
  }

  start() {
    this.gameloop = setInterval(this.update, this.config.updateRate)
  }

  stop() {
    clearInterval(this.gameloop!)
  }

  abstract update(): void
  abstract restart(): void
}

export default Game
