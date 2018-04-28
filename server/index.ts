import * as WebSocket from 'ws'
import Game from './games/Game'
import { SnakeGame } from './games/SnakeGame'

export interface IStartCommand {
  machineId: string
  playerId: string
  game: string
}

export interface ISpectatorCommand {
  spectatorId: string
}

export interface IGameInputCommand {
  input: string
  machineId: string
}

const gameManager: {
  [machineId: string]: {
    game: Game<any>
    player: WebSocket
    spectators: WebSocket[]
  }
} = {}

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws: any) => {
  ws.on('message', (message: string) => {
    const msg = JSON.parse(message)

    switch (msg.type) {
      case 'start': {
        const { machineId } = msg.payload as IStartCommand
        // TODO: instance a different game based on payload.game
        const game = new SnakeGame()

        game.on('game_end', () => {
          const targets = [...gameManager[machineId].spectators, gameManager[machineId].player]

          targets.forEach(spectator => {
            spectator.send(
              JSON.stringify({
                machineId,
                end: true
              })
            )
          })
        })

        game.on('game_update', update => {
          const targets = [...gameManager[machineId].spectators, gameManager[machineId].player]

          targets.forEach(spectator => {
            spectator.send(
              JSON.stringify({
                machineId,
                ...update
              })
            )
          })
        })

        gameManager[machineId] = {
          game,
          player: ws,
          spectators: gameManager[machineId] ? [...gameManager[machineId].spectators] : []
        }
        break
      }
      case 'spectator_id': {
        // const { spectatorId } = msg.payload as ISpectatorCommand
        Object.keys(gameManager).forEach(machine => {
          const game = gameManager[machine]
          game.spectators.push(ws)
        })
        break
      }
      case 'game_input': {
        const { machineId, input } = msg.payload as IGameInputCommand
        console.log('game_input for', machineId)
        gameManager[machineId].game.onMessage({ type: msg.type, payload: { input } })
        break
      }
    }
  })
})
