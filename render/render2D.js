/*
RENDER 2D
I want to draw multiple aspects about the game in 2D
- player, world, camera
- I am not sure if I should have these as functions for each class or keep them seperate in this file
*/

// renders a 2D representation of the world
function worldRender2D(world) {
  // variables
  var negativeBorder = 1;
  var color;
  var width = world.segmentSize - negativeBorder;
  var height = world.segmentSize - negativeBorder;
  var pos_x;
  var pos_y;
  var positions_colors = new Array(world.height * world.width * 2);
  var positions_colors_two = new Array(world.width * 2);


  // cycle through the 'chunks' of the world, which are represented
  // by numbers in the array
  for (let col = 0; col < world.width; col++) {
    for (let row = 0; row < world.height; row++) {
      if (world.array[row][col] == 1) {
        color = [1, 0, 1, 1]; // purple
      } else {
        color = [0, 1, 0, 1]; // green
      }

      // update position of rectangle
      pos_x = row * world.segmentSize + negativeBorder;
      pos_y = col * world.segmentSize + negativeBorder;
      positions_colors[(col * world.height + row) * 2] = [pos_y, pos_x, width, height];
      positions_colors[(col * world.height + row) * 2 + 1] = color;
    }
  }

  // draw the rectangles
  rectMain(pos_x, pos_y, width, height, color, positions_colors);

/*
  // draw horizontal grid
  for (let col = 0; col < world.width; col++) {
    var width = col * 50;
    var height = world.height * 50;

    // save each ray from camera to collision
    positions_colors_two[col * 2] = [width,
                               0,
                               width,
                               height];
    positions_colors_two[col * 2 + 1] = [0, 0, 0, 1] // black
  }

  lineMain(0, 0, 0, 0, [0, 0, 0, 1], positions_colors_two);

  // draw vertical grid
  for (let row = 0; row < world.height; row++) {
    var width = world.width * 50;
    var height = row * 50;

    // save each ray from camera to collision
    positions_colors_two[row * 2] = [0,
                               height,
                               width,
                               height];
    positions_colors_two[row * 2 + 1] = [0, 0, 0, 1] // black
  }

  lineMain(0, 0, 0, 0, [0, 0, 0, 1], positions_colors_two);
  */
}

// renders a 2D representation of the player
function playerRender2D(player) {
  rectMain(player.position.x - player.radius, player.position.y - player.radius, player.radius * 2, player.radius * 2, [1, 1, 1, 1]);
  lineMain(player.position.x,
           player.position.y,
           player.position.x + player.normal.x * player.visualNormalMagnitude,
           player.position.y + player.normal.y * player.visualNormalMagnitude,
           [0, .5, .5, 1]);
}

// renders a 2D representation of the camera
function cameraRender2D(camera) {
  // draw the view
  //fill('white');
  //line(camera.viewLeftCoord.x, camera.viewLeftCoord.y, camera.viewRightCoord.x, camera.viewRightCoord.y);
  //lineff(camera.viewLeftCoord.x, camera.viewLeftCoord.y, camera.viewRightCoord.x, camera.viewRightCoord.y, "blue");

  // draw each ray
  var curRay;
  var positions_colors = new Array(camera.rays.length * 2);

  for (var i = 0; i < camera.rays.length; i++) {
    curRay = createVector(0,0);
    copy2DVector(curRay, camera.rays[i].position);

    // save each ray from camera to collision
    positions_colors[i * 2] = [camera.position.x,
                               camera.position.y,
                               curRay.x,
                               curRay.y * -1];
    positions_colors[i * 2 + 1] = [0, 0, 0, 1] // black
  }

  lineMain(0, 0, 0, 0, [0, 0, 0, 1], positions_colors);

  // draw a marker for each rays collision origin and face
  var positions_colors_origin = new Array(camera.numOfRays * 2);
  var curOrigin;
  for (var i = 0; i < camera.numOfRays; i++) {
    curOrigin = camera.rays[i].collisionOrigin;
    positions_colors_origin[i * 2] = [curOrigin.x,
                                     curOrigin.y,
                                     6,
                                     6];
    positions_colors_origin[i * 2 + 1] = [0, .8, .5, 1] // idk
  }

  rectMain(0, 0, 0, 0, [0, 0, 0, 1], positions_colors_origin);

  // draw a marker for each collision face
  var positions_colors_face = new Array(camera.numOfRays * 2);
  var curOrigin;
  var curFace;
  for (var i = 0; i < camera.numOfRays; i++) {
    curOrigin = camera.rays[i].collisionOrigin;
    curFace = camera.rays[i].collisionFace;

    if (curFace == 1) {
      curOrigin.x += 50;
      curOrigin.y += 25;
    } else if (curFace == 2) {
      curOrigin.x += 25;
      curOrigin.y += 50;
    } else if (curFace == 3) {
      curOrigin.y += 25;
    } else {
      curOrigin.x += 25;
    }

    positions_colors_face[i * 2] = [curOrigin.x,
                                     curOrigin.y,
                                     6,
                                     6];
    positions_colors_face[i * 2 + 1] = [.8, .1, .2, 1] // idk
  }

  rectMain(0, 0, 0, 0, [0, 0, 0, 1], positions_colors_face);

  // draw different parts of the camera for visualization
  //var r = 5;
  // camera position
  //fill("yellow");
  //circle(camera.position.x, camera.position.y, r);
  //circleff(camera.position.x, camera.position.y, r, "yellow");
  // camera view screen
  //fill("red");
  //circle(camera.viewLeftCoord.x, camera.viewLeftCoord.y, r);
  //circle(camera.viewRightCoord.x, camera.viewRightCoord.y, r);
  //circleff(camera.viewLeftCoord.x, camera.viewLeftCoord.y, r, "red");
  //circleff(camera.viewRightCoord.x, camera.viewRightCoord.y, r, "red");
}
