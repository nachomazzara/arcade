export enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
  DOWN = 'down',
  UP = 'up'
}

export const config = {
  snakeSize: 10,
  w: 350,
  h: 350,
  direction: Direction.DOWN,
  updateRate: 100,
}
