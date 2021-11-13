// global variables
var player;
var world;
var players = new Array(25);
var socket;

// Default values for the position of a player
// and the rotation of a player
function setup() {
  player = newPlayer();
  world = newWorld();

  defaultPlayer(player);

  // setup draw functions
  default2dWorld(world);

  socket = io.connect('http://localhost:3000');
  socket.on('move',recieveServer);
}

// updates the canvas about 60 times per second
function draw() {
  updatePlayer(player);
  updateServer(player);

  draw2dWorld(world);
  draw2dPlayer(player);
  drawPlayers();
}

// set the default position and rotation for the player
function defaultPlayer(p) {

  p.pos.x = 4*world.segmentSize + world.segmentSize/2;
  p.pos.y = 2*world.segmentSize + world.segmentSize/2;
  p.rot.x = 1;
  p.rot.y = 0;
}

// set up the drawing for the worlds
function default2dWorld() {

  createCanvas(500,500);
}

// establish a connection with the server
function connectionServer() {

}

// listen for input from the user
// position will be an (x, y) vector
// rotation will be a float number
function userInput() {

}

// update the player's position and rotation with the recieved input
// this includes updating the camera attached to the player
function updatePlayer(p) {
  //var check = p.pos;
  //var vectorCollisionCheck = createVector(0,0);

  // update p's position
  if (keyIsDown(LEFT_ARROW)) {
    // vectorCollisionCheck = rotation2D(p.face, -PI/2);
    // vectorCollisionCheck = add2D(vectorCollisionCheck, p.pos);

    var relativePos = createVector(0,0);
    copy2DVector(relativePos, p.rot);

    increase2DVector(relativePos, p.vel);
    rotation2DVector(relativePos, -PI/2);

    add2DVectors(p.pos, relativePos);
  }

  if (keyIsDown(RIGHT_ARROW)) {
    // vectorCollisionCheck = rotation2D(p.face, PI/2);
    // vectorCollisionCheck = add2D(vectorCollisionCheck, p.pos);

    var relativePos = createVector(0,0);
    copy2DVector(relativePos, p.rot);

    increase2DVector(relativePos, p.vel);
    rotation2DVector(relativePos, PI/2);

    add2DVectors(p.pos, relativePos);
  }

  if (keyIsDown(UP_ARROW)) {
    // vectorCollisionCheck = rotation2D(p.face, 0);
    // vectorCollisionCheck = add2D(vectorCollisionCheck, p.pos);

    var relativePos = createVector(0,0);
    copy2DVector(relativePos, p.rot);

    increase2DVector(relativePos, p.vel);
    rotation2DVector(relativePos, 0);

    add2DVectors(p.pos, relativePos);
  }

  if (keyIsDown(DOWN_ARROW)) {
    // vectorCollisionCheck = rotation2D(p.face, PI);
    // vectorCollisionCheck = add2D(vectorCollisionCheck, p.pos);

    var relativePos = createVector(0,0);
    copy2DVector(relativePos, p.rot);

    increase2DVector(relativePos, p.vel);
    rotation2DVector(relativePos, PI);

    add2DVectors(p.pos, relativePos);
  }

  collisionCheck(p,world);

  // update player's rotation
  if (keyIsDown(65)) {
    rotation2DVector(p.rot, p.angVel * -PI/32);
  }
  if (keyIsDown(68)) {
    rotation2DVector(p.rot, p.angVel * PI/32);
  }
}

// send the new position and rotation for the player
// to the server
function updateServer(p) {
  console.log('Sending: ' + p.pos.x + ',' + p.pos.y);

  var data = {
    x: p.pos.x,
    y: p.pos.y
  }

  socket.emit('move', data);
}

// grab any player positions and rotations for foreign players
// from the server
function recieveServer(data) {
  console.log(data.x);

  players = data;
//
//  for (i=0, i<players.length, i++) {
//    if (players[i].id == data.id) {
//      break;
//    }
//  }
}

// draw the 2d representation of the wolrd
function draw2dWorld(w) {

  // default background color is black
  background(0);

  // cycle through the 'chunks' of the world, which are represented
  // by numbers in the array
  for (col=0; col<w.width; col++) {
    for (row=0; row<w.height; row++) {
      if (w.arr[col][row] == 1) {
        fill('purple');
        rect(row * w.segmentSize, col * w.segmentSize, w.segmentSize, w.segmentSize);
      } else {
        fill('green');
        rect(row * w.segmentSize, col * w.segmentSize, w.segmentSize, w.segmentSize);
      }
    }
  }
}

// draw the camera view of world
function drawWorld() {

}

// draw 2d representation of player position and rotation
function draw2dPlayer(p) {

  // draw a circle at the player's position
  fill('white');
  circle(p.pos.x, p.pos.y, p.colRadius * 2);

  // draw a line that represents the player's normal facing
  // add the facing vector and the position vector together
  var normal = createVector(p.normalMag * p.rot.x, p.normalMag * p.rot.y);
  add2DVectors(normal, p.pos);

  line(p.pos.x, p.pos.y, normal.x, normal.y);
}

// draw any foreign players
function drawPlayers() {
  //for (i=0,i<players.length,i++) {
    //if (players[i] != undefined) {
      fill('grey');
      circle(players.x, players.y, 30);
    //}
  //}
}

// IMPROVEMENTS
// turn off controlling scroll bars with keys
// NORMALIZE diagonal movement
