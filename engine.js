/*
P3DE ENGINE
Pseudo 3D engine I have been working on for quite some time
I've tried to use as little outside help as possible
no tutorials, no outside code, just what I can come up with to mimick a
game engine of the past
*/

// IMPROVEMENTS
// turn off controlling scroll bars with keys
// NORMALIZE diagonal movement

// global variables
var player;
var camerA;
var world;

// function that runs before setup
function preload() {
  // disable scrollbar
  document.body.style.overflow = "hidden";
  // load in textures
  //prisonN.crossOrigin = "";
  //prisonN = loadImage("prisonN.png");
  //prisonW = loadImage("prisonW.png");
}

// Default values for the position of a player
// and the rotation of a player
function setup() {
  player = new Player();
  camerA = new Camera();
  world = new World();

  player.setup(world);
  camerA.setup(player);
  world.setup();
}

// updates the canvas about 60 times per second
function draw() {
  player.update(world);
  camerA.update(player);

  //worldRender3D(world, camerA);
  //objectsRender3D(world);

  worldRender2D(world);
  playerRender2D(player);
  cameraRender2D(camerA);
}
