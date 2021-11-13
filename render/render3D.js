/*
RENDER 2D
collection of functions for rendering calculations in 3D
*/

// render the 3D representation of the world
function worldRender3D(world, camera) {
  //renderCeiling(world);
  //renderFloor(world);
  renderWalls(world, camera);
}

function renderWalls(world, camera) {
  var canvas = document.getElementById("canvas");

  // variables for creating walls
  var wallSegmentWidth = world.width * world.segmentSize / camera.numOfRays;
  var horizonHeight = (canvas.height / 2) * world.horizon;
  var magnitude;
  var brightness;
  var colors = new Array(camera.numOfRays);
  var rgb;
  var curRay = createVector(0,0);
  var curRayToView = createVector(0,0);

  var alpha;
  var length;
  var distortedMagnitude;
  var viewSize = Math.ceil(camera.viewDistance * tan((camera.FOV / 2) * Math.PI / 180) * 2);
  var viewSegmentSize = viewSize / (camera.numOfRays - 1);
  var segmentHeight;

  var vertex1;
  var vertex2;
  var x1;
  var y1;
  var x2;
  var y2;
  var source;

  var brightnessArray = new Array(camera.numOfRays);

  // draw walls that represent the magnitude of camera rays
  for (var i = 0; i < camera.numOfRays; i++) {
    // grab current ray
    copy2DVector(curRay, camera.rays[(camera.numOfRays - 1) - i]);

    // calculate the magnitude
    length = viewSegmentSize * ((camera.numOfRays - 1) / 2 - i);
    alpha = atan(length / camera.viewDistance);
    distortedMagnitude = magnitude2DVector(curRay);
    magnitude = Math.trunc(cos(alpha) * distortedMagnitude);
    // draw a segment for the current ray
    if (magnitude < camera.renderDistance) {
      segmentHeight = (world.wallHeight / magnitude) * camera.viewDistance;

      brightness = 255 - Math.trunc(255 * (1 - segmentHeight / camera.renderDistance));
      rgb = 'rgb('.concat(brightness.toString()).concat(',').concat(brightness.toString()).concat(',').concat(brightness.toString()).concat(')');
      brightnessArray[i] = brightness;
      colors[i] = [0, 1, 0, 1];

      x1 = i * wallSegmentWidth;
      y1 = horizonHeight - segmentHeight / 2;
      x2 = x1 + wallSegmentWidth;
      y2 = y1 + segmentHeight;
      camera.segmentVertices[i].x = Math.trunc(x1);
      camera.segmentVertices[i].y = Math.trunc(y1);
      camera.segmentVertices[i + camera.numOfRays].x = Math.trunc(x2);
      camera.segmentVertices[i + camera.numOfRays].y = Math.trunc(y2);

      //drawRectMain("textures/ceiling.png", [0.2, 0.3, 0], createVector(x1, y1), createVector(x2, y2));
      //circleff(x2, y2, 5, "blue");
    } else {
      //noStroke();
      //fill('black');
      //square(i * wallSegmentWidth, horizonHeight, 50, 5);
    }

    //webGLTest2(camera.segmentVertices);
    vertex1 = camera.segmentVertices[i];
    vertex2 = camera.segmentVertices[i + camera.numOfRays];
    if (vertex2.y > canvas.height / 2) {
      vertex2.y = canvas.height / 2;
    }
  }
  //console.log(i + "-"+camera.segmentVertices[14]);
  source = "textures/PrisonW.png";
  drawSegment(colors, brightnessArray, camera.segmentVertices);
  // if render 2D is turned off, this will cover  any renders that extend into that area
  //stroke(1);
  //fill('green');
  //square(0, 0, canvas.width, canvas.height / 2);
  }


// render ceilings
function renderCeiling(world) {
  //fill(world.colorCeiling);
  //square(0, world.height * world.segmentSize, canvas.width, world.height * world.segmentSize / 2);
  var canvas = document.getElementById("canvas");
  //rectMain(0, canvas.height * 2 / 4, canvas.width, canvas.height * 1 / 4, canvas.colorCeiling);
  var vertex1 = createVector(0, 0);
  var vertex2 = createVector(canvas.width, (canvas.height / 2) / 2);
  var source = "textures/ceiling.png";
  drawRectMain(source, world.colorCeiling, vertex1, vertex2);
}

// render floors
function renderFloor(world) {
  //fill(world.colorFloor);
  //square(0, canvas.height / 2 + world.height * world.segmentSize / 2, canvas.width, world.height * world.segmentSize / 2);
  //rectMain(0, canvas.height / 2 + world.height * world.segmentSize / 2, canvas.width, world.height * world.segmentSize / 2);
  var canvas = document.getElementById("canvas");
  var vertex1 = createVector(0, (canvas.height / 2) / 2);
  var vertex2 = createVector(canvas.width, (canvas.height / 2));
  var source = "textures/floor.png";
  drawRectMain(source, world.colorFloor, vertex1, vertex2);
}
