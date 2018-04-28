import { EventEmitter } from 'events'

export interface IGameConfig {
  updateRate: number
}

abstract class Game<T extends IGameConfig> extends EventEmitter {
  config: T
  gameloop: NodeJS.Timer | null = null

  constructor(config: T) {
    super()
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

  abstract onMessage(msg: any): void
  abstract update(): void
  abstract restart(): void
}

export default Game
