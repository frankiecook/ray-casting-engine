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
let world;
let menu;
let gl;
let program;
let positionAttributeLocation;
let positionBuffer;
let colorBuffer;
let colorLocation;
let positionLocation;

let texcoordLocation;
let texcoordBuffer;
let textureLocation;
let lightingBuffer;

let resolutionLocation;
let lightingLocation;
let time;
let then;

function resize() {
  console.log("Error?");
  // update controls
  updateControls();

  //update the ceiling and floor texture 
  world.surroundings[0].updateClipCoordsCeiling();
  world.surroundings[1].updateClipCoordsFloor();

  //update the rays
  world.player.camera.updateNumOfRays();
  world.player.camera.updateViewDistance();
}

// setup the mobile controls
function setupControls() {
  let fire = document.getElementById("fire");
  fire.addEventListener('touchstart', fireWeapon, false);
  fire.addEventListener('mousedown', fireWeapon, false);

  let joyStick = document.getElementById("joystick");
  joyStick.addEventListener('touchmove', function touchMove() {
    let x = event.touches[0].clientX;
    let y = event.touches[0].clientY;
    world.player.isMobile = true;
    
    // calculate normalized vector from button center to touch point
    // touch vector from origin - button center 
    let touch_vec = createVector(x, y);
    let rect = joyStick.getBoundingClientRect();
    let button_vec = createVector((rect.right - rect.left) / 2, (rect.bottom - rect.top) / 2);
    button_vec.x += rect.left;
    button_vec.y += rect.top;
    button_vec.x *= -1;
    button_vec.y *= -1;

    let new_vec = createVector(0, 0);
    add2DVectors(new_vec, touch_vec);
    add2DVectors(new_vec, button_vec);
    new_vec.y *= -1;

    let mag_nv = magnitude2DVector(new_vec);

    // normalize and adjust the vector
    new_vec.x /= mag_nv;
    new_vec.y /= mag_nv;
    
    // update movement vector
    world.player.setMovement(new_vec.x, new_vec.y);
  }, false);
  joyStick.addEventListener('touchend', function touchEnd() {
    console.log("end");

    // set movement and rotation to zero
    world.player.setMovement(0, 0);
    world.player.rotateRight = false;
    world.player.rotateLeft = false;
    world.player.isMobile = false;
  }, false);

  let fullscreen = document.getElementById("fullscreen");
  var ro = new ResizeObserver(entries => {
    resize();
  });

  // Observe one or multiple elements
  ro.observe(fullscreen);

  fullscreen.onclick = function openFullscreen() {

    if (document.fullscreenElement || document.webkitFullscreenElement ||
      document.mozFullScreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    } else {
      let elem = document.getElementById('controls_container');
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    }
  }
}

function fireWeapon() {
  world.player.weapon.fire();
}

function updateControls() {
  let joystick = document.getElementById("joystick");
  let knob = document.getElementById("knob");
  let knob_vec = createVector(0, 0);

  knob_vec.x = (1 + world.player.movement.x) * (joystick.clientWidth / 2);
  knob_vec.y = (1 - world.player.movement.y) * (joystick.clientWidth / 2);

  knob_vec.x -= (knob.clientWidth) / 2;
  knob_vec.y -= (knob.clientHeight) / 2;

  knob.style.top = knob_vec.y + 'px';
  knob.style.left = knob_vec.x + 'px';
}

// function that runs before setup
function preload() {
  // disable scrollbar
  document.body.style.overflow = "hidden";
}

// Default values for the position of a player
// and the rotation of a player
function setup() {
  // destroy the default canvas
  removeDrawArea();

  // import world
  initWorld("world_05");

  setupControls();

  // initialize webgl
  // request animation frame for the main loop
  initWebgl();
}

// updates the canvas about 60 times per second
function main() {

  // update the player, camera, and world
  world.player.update(world, world.player.camera);
  world.player.camera.update();
  world.player.weapon.update();
  world.update();

  // update the texture coords and clip coords
  let positionsTexCoords = [];
  let positionsClipCoords = [];
  let lightingValues = [];

  for (let object of world.renderObjects) {
    positionsClipCoords.push(...object.getClipCoords());
    positionsTexCoords.push(...object.getTexCoords());

    for (let count = 0; count < 6; count++) {
        lightingValues.push(object.brightness);
        lightingValues.push(object.brightness);
        lightingValues.push(object.brightness);
        lightingValues.push(1);
    }
  }
  


  // update webgl
  // Create a buffer for lighting
  lightingBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, lightingBuffer);
  // Put the lighting values in the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...lightingValues]), gl.STATIC_DRAW);

  // update webgl
  // Create a buffer for positions
  positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put the positions in the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...positionsClipCoords]), gl.STATIC_DRAW);

  // provide texture coordinates for the rectangle.
  texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  // Set Texcoords.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...positionsTexCoords]), gl.STATIC_DRAW);

  // Pseudo-3D render world
  worldRender3D(world, world.player.camera);

  requestAnimationFrame(main);
}

function removeDrawArea() {
  // Wrap noCanvas() in a try-catch
  // to prevent error in case there
  // exists no canvas to remove
  try {
    noCanvas();
  } catch (e) {
    print("No canvas found to remove");
    print(e);
  }
}

function initWorld(name) {
  let cur_world = eval(name);

  world = new World("world", cur_world.array, cur_world.initial_position, cur_world.initial_normal);
  world.setup();

  cur_world.initial_entities();
  cur_world.initial_environment();

  let camera_x = new Camera("player_camera");
  let player = new Player("frankie");
  player.attachCamera(camera_x);
  player.setMaxItems(10);
  world.attachPlayer(player);

  // temp
  let pistol = new Weapon("pistol");

  pistol.setup();
  pistol.ammo = 100000;//.setAmmo(100);
  pistol.owner = world.player;// setOwner(player);
  pistol.cooldown_default = 30;//.setCooldownDefault(5);
  world.player.weapon = pistol;
}

function initWebgl() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} **/
  var canvas = document.querySelector("#glcanvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    // no webgl
    throw new Error ("No Webgl");
  }

  // setup GLSL program
  program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // look up where the vertex data needs to go.
  positionLocation = gl.getAttribLocation(program, "a_position");
  texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // lookup uniforms
  resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  // lookup uniforms
  textureLocation = gl.getUniformLocation(program, "u_texture");

  // lookup floats
  lightingLocation = gl.getAttribLocation(program, "vLight");

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  var image = new Image();
  image.src = "../../textures/textureatlas5.png";
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    requestAnimationFrame(main);
  });

  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);

  // Get the starting time.
  then = 0;
}
