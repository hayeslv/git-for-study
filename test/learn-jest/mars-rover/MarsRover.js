/*
 * @Author: Lvhz
 * @Date: 2021-09-14 14:31:11
 * @Description: Description
 */
const { turnLeft, turnRight } = require('./DirectionMap.js')
module.exports = class MarsRover {
  constructor(position, direction) {
    this.position = position
    this.direction = direction
  }
  getState() {
    return {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      direction: this.direction
    }
  }
  turnLeft() {
    this.direction = turnLeft(this.direction)
  }
  turnRight() {
    this.direction = turnRight(this.direction)
  }
}