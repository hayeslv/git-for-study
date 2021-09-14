/*
 * @Author: Lvhz
 * @Date: 2021-09-14 14:31:11
 * @Description: Description
 */
const Direction = require('./Direction.js')
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
    if(this.direction === Direction.N) {
      this.direction = Direction.W
      return 
    } 
    if(this.direction === Direction.W) {
      this.direction = Direction.S
      return 
    }
    if(this.direction === Direction.S) {
      this.direction = Direction.E
      return 
    }
    if(this.direction === Direction.E) {
      this.direction = Direction.W
      return 
    }
  }
}