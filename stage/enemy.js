/*
ENEMY CLASS
Refactor Date: 18/07/21

Description:

Data
*/

// class syntax helps simplify method construction
class Enemy extends Character {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error ("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    super(name),
    this.movement = createVector(0,0),
    this.future_position = createVector(0,0),
    this.future_check = createVector(0,0),
    this.angularVelocity = 0.9,
    this.surrounding = new Array(9)
  }
