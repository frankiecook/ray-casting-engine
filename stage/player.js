/*
PLAYER
Refactor Date: 11/11/21

Description:
class for player

Data
position: player position
normal: player normal
visualNormanlMagnitude: magnitude of the normal when rendering the player
velocity: player velocity
angularVelocity: player angular velocity
radius: collision radius of player
rayLength: length of each ray?
surrounding: surrounding area around the player
*/

var checkX;
var checkY;
var checkX2;
var checkY2;
var checkX5;
var checkY5;
var checkX7;
var checkY7;

// class syntax helps simplify method construction
class Player {
  constructor() {
    this.position = createVector(0, 0),
    this.normal = createVector(.5, -.5),
    this.velocity = 2,
    this.angularVelocity = 0.5,
    this.radius = 10,
    this.visualNormalMagnitude = 15,
    this.surrounding = new Array(8)
  }

  // initialize the player
  setup(currentWorld) {
    copy2DVector(this.position, currentWorld.initialPlayerPosition);
  }

  update(world) {
    // update the surroundings
    var playerSegPos = createVector((this.position.x - (this.position.x % world.segmentSize)) / world.segmentSize,
                                  (this.position.y - (this.position.y % world.segmentSize)) / world.segmentSize);

    // a trigger that sets off a function for setting these would be more useful
    // only update the surroundings when the player moves to a new world segment
    this.surrounding[0] = world.array[playerSegPos.y - 1][playerSegPos.x - 1];
    this.surrounding[1] = world.array[playerSegPos.y - 1][playerSegPos.x];
    this.surrounding[2] = world.array[playerSegPos.y - 1][playerSegPos.x + 1];
    this.surrounding[3] = world.array[playerSegPos.y][playerSegPos.x - 1];
    this.surrounding[4] = world.array[playerSegPos.y][playerSegPos.x + 1];
    this.surrounding[5] = world.array[playerSegPos.y + 1][playerSegPos.x - 1];
    this.surrounding[6] = world.array[playerSegPos.y + 1][playerSegPos.x];
    this.surrounding[7] = world.array[playerSegPos.y + 1][playerSegPos.x + 1];

    // update player's rotation
    // nothing should stop a player from rotating
    // KEY [65]: A
    // KEY [68]: D
    if (keyIsDown(65)) {
      rotation2DVector(player.normal, player.angularVelocity * -PI/32);
    }
    if (keyIsDown(68)) {
      rotation2DVector(player.normal, player.angularVelocity * PI/32);
    }

    // create variables to check a player's position
    var relativePosLeft = createVector(0,0);
    var relativePosRight = createVector(0,0);
    var relativePosUp = createVector(0,0);
    var relativePosDown = createVector(0,0);
    var keyPressed = false;

    var futurePos = createVector(0,0);
    copy2DVector(futurePos, this.position);

    // update player's position
    // the updated position will have to be checked for collision
    if (keyIsDown(LEFT_ARROW)) {
      copy2DVector(relativePosLeft, player.normal);
      rotation2DVector(relativePosLeft, -PI/2);
      keyPressed = true;
    } else // else if statements account for when opposite directions are press
            // some glitch was happening that I can't fix

    if (keyIsDown(RIGHT_ARROW)) {
      copy2DVector(relativePosRight, player.normal);
      rotation2DVector(relativePosRight, PI/2);
      keyPressed = true;
    }

    if (keyIsDown(UP_ARROW)) {
      copy2DVector(relativePosUp, player.normal);
      rotation2DVector(relativePosUp, 0);
      keyPressed = true;
    } else

    if (keyIsDown(DOWN_ARROW)) {
      copy2DVector(relativePosDown, player.normal);
      rotation2DVector(relativePosDown, PI);
      keyPressed = true;
    }

    if (keyPressed) {
      add2DVectors(relativePosLeft, relativePosRight);
      add2DVectors(relativePosUp, relativePosDown);
      add2DVectors(relativePosLeft, relativePosUp);
      normalize2DVector(relativePosLeft);
      scalar2DVector(relativePosLeft, this.velocity);
      add2DVectors(futurePos, relativePosLeft);

      var futurePosCheckForward = createVector(0,0);
      var futurePosCheckBackward = createVector(0,0);
      var futurePosCheckRight = createVector(0,0);
      var futurePosCheckLeft = createVector(0,0);

      copy2DVector(futurePosCheckForward, futurePos);
      copy2DVector(futurePosCheckBackward, futurePos);
      copy2DVector(futurePosCheckRight, futurePos);
      copy2DVector(futurePosCheckLeft, futurePos);

      futurePosCheckForward.y -= player.radius;
      futurePosCheckBackward.y += player.radius;
      futurePosCheckRight.x += player.radius;
      futurePosCheckLeft.x -= player.radius;
    }

    // update the player's position
    //copy2DVector(player.position, futurePos);

    // new update player's position
    var wallOrigin = createVector(0, 0);
    var wallCorner;
    var distance = createVector(0, 0);

    // loop through surroundings for spots that contain a wall
    // calculate that walls origin
    // check if the updated player position crosses into that wall
    // cases:
    // 0 | 1 | 2
    // 3 | P | 4
    // 5 | 6 | 7
    for (var i = 0; i < this.surrounding.length; i++) {

      if (this.surrounding[i] == 1) {
        // make this a switch case plz
        switch(i) {
          case 0:
            // figure out coordinates of the wall
            wallOrigin = createVector(playerSegPos.x - 1, playerSegPos.y - 1);
            scalar2DVector(wallOrigin, world.segmentSize);

            // calculate the inner wall corner position
            // this will be different on a case by case basis
            wallCorner = createVector(wallOrigin.x + world.segmentSize, wallOrigin.y + world.segmentSize);

            // check if the distance between the player and corner is less than the radius
            copy2DVector(distance, futurePos);
            distance = multiply2DVectors(distance, -1);
            add2DVectors(distance, wallCorner);

            if (magnitude2DVector(distance) <= this.radius) {

              if (Math.abs(futurePos.x - wallCorner.x) < Math.abs(futurePos.y - wallCorner.y)) {
                futurePos.y = wallCorner.y + this.radius;
              } else {
                futurePos.x = wallCorner.x + this.radius;
              }
            }
            break;

          case 1:
            wallOrigin = createVector(playerSegPos.x, playerSegPos.y - 1);
            scalar2DVector(wallOrigin, world.segmentSize);

            // y value
            if (futurePos.y - (wallOrigin.y + world.segmentSize) <= this.radius
                && wallOrigin.x <= futurePos.x <= wallOrigin.x + world.segmentSize) {
              futurePos.y = wallOrigin.y + world.segmentSize + this.radius;
            }
            break;

          case 2:
            wallOrigin = createVector(playerSegPos.x + 1, playerSegPos.y - 1);
            scalar2DVector(wallOrigin, world.segmentSize);

            // calculate the inner wall corner position
            // this will be different on a case by case basis
            wallCorner = createVector(wallOrigin.x, wallOrigin.y + world.segmentSize);

            // check if the distance between the player and corner is less than the radius
            copy2DVector(distance, futurePos);
            distance = multiply2DVectors(distance, -1);
            add2DVectors(distance, wallCorner);

            if (magnitude2DVector(distance) <= this.radius) {

              if (Math.abs(futurePos.x - wallCorner.x) < Math.abs(futurePos.y - wallCorner.y)) {
                futurePos.y = wallCorner.y + this.radius;
              } else {
                futurePos.x = wallCorner.x - this.radius;
              }
            }
            break;

          case 3:
            wallOrigin = createVector(playerSegPos.x - 1, playerSegPos.y);
            scalar2DVector(wallOrigin, world.segmentSize);

            // x value
            if (futurePos.x - (wallOrigin.x + world.segmentSize) <= this.radius
                && wallOrigin.y <= futurePos.y <= wallOrigin.y + world.segmentSize) {
              futurePos.x = wallOrigin.x + this.radius + world.segmentSize;
            }
            break;

          case 4:
            wallOrigin = createVector(playerSegPos.x + 1, playerSegPos.y);
            scalar2DVector(wallOrigin, world.segmentSize);

            // x value
            if (wallOrigin.x - futurePos.x <= this.radius
                && wallOrigin.y <= futurePos.y <= wallOrigin.y +world.segmentSize) {
              futurePos.x = wallOrigin.x - this.radius;
            }
            break;

          case 5:
            wallOrigin = createVector(playerSegPos.x - 1, playerSegPos.y + 1);
            scalar2DVector(wallOrigin, world.segmentSize);

            // calculate the inner wall corner position
            // this will be different on a case by case basis
            wallCorner = createVector(wallOrigin.x + world.segmentSize, wallOrigin.y);

            // check if the distance between the player and corner is less than the radius
            copy2DVector(distance, futurePos);
            distance = multiply2DVectors(distance, -1);
            add2DVectors(distance, wallCorner);

            if (magnitude2DVector(distance) <= this.radius) {

              if (Math.abs(futurePos.x - wallCorner.x) < Math.abs(futurePos.y - wallCorner.y)) {
                futurePos.y = wallCorner.y - this.radius;
              } else {
                futurePos.x = wallCorner.x + this.radius;
              }
            }
            break;

          case 6:
            wallOrigin = createVector(playerSegPos.x, playerSegPos.y + 1);
            scalar2DVector(wallOrigin, world.segmentSize);

            // y value
            if (wallOrigin.y - futurePos.y <= this.radius
                && wallOrigin.x <= futurePos.x <= wallOrigin.x + world.segmentSize) {
              futurePos.y = wallOrigin.y - this.radius;
            }
            break;

          case 7:
            wallOrigin = createVector(playerSegPos.x + 1, playerSegPos.y + 1);
            scalar2DVector(wallOrigin, world.segmentSize);

            // calculate the inner wall corner position
            // this will be different on a case by case basis
            wallCorner = createVector(wallOrigin.x, wallOrigin.y);

            // check if the distance between the player and corner is less than the radius
            copy2DVector(distance, futurePos);
            distance = multiply2DVectors(distance, -1);
            add2DVectors(distance, wallCorner);

            if (magnitude2DVector(distance) <= this.radius) {

              if (Math.abs(futurePos.x - wallCorner.x) < Math.abs(futurePos.y - wallCorner.y)) {
                futurePos.y = wallCorner.y - this.radius;
              } else {
                futurePos.x = wallCorner.x - this.radius;
              }
            }
            break;
        }
      }
    }
    copy2DVector(player.position, futurePos);
  }
}
