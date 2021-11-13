/*
WORLD DATA
array: the world itself where 1's are walls and 0's are open space
width: segment width of the room
height: segment height of the room
segmentSize: size of the segments to be drawn
initialPlayerPosition: starting player position is unique to each world
colorCeiling: color of the ceiling
colorFloor: color of the floor
horizon: horizon line

*/

class World {
  constructor() {
    this.array = [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,1,1,0,1,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,0,0,1,0,0,1,0,1,0,1],
      [1,0,0,0,1,0,1,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    this.width = 0,
    this.height = 0,
    this.segmentSize = 50,
    this.initialPlayerPosition = createVector(225, 75),
    this.colorCeiling = [0, 0.5, 0.5, 1],
    this.colorFloor = [0, 0.2, 0.8, 1],
    this.horizon = 0.5,
    this.wallHeight = 4000
  }

  // initialize the world
  setup() {
    // update width, height, and horizon variables
    this.width = this.array[0].length;
    this.height = this.array.length;

    // create the canvas
    var canvas = document.getElementById("canvas");
    canvas.width = this.width * this.segmentSize;
    canvas.height = this.height * this.segmentSize * 2;
  }
}
