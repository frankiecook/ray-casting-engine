/*
CAMERA
Refactor Date: 12/11/21

Description:
Contains the class for creating a camera

Data:
position        : location of camera is the same as the player
normal          : normal of camera is the same as the player
viewLeftCoord   : left point of the view port's lense
viewRightCoord  : right point of the view port's lense
rays            : array that stores all rays extended from the camera
raysToView      : collection of rays that extend fromt he player to the view port's lense
segmentVertices : idk, something in the render 3D
numOfRays       : number of rays extended from the camera
viewDistance    : distance of view port's lense from the camera
renderDistance  : how far the rays travel
FOV             : Field of view in degrees

Functions:
constructor(): builds the object with predefined variablesd
setup(): set up aspects of a newly created camera
*/
var DEBUG_KEYBOARD_UPDATE_VIEW_DISTANCE = false;
var DEBUG_KEYBOARD_UPDATE_RAYS = false;

class Camera extends Physical {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error ("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    super(name),
    this.viewLeftCoord = createVector(0, 0),
    this.viewRightCoord = createVector(0, 0),
    this.rays = [],
    this.raysToView = [],
    this.segmentVertices,
    this.numOfRays,
    this.viewDistance,
    this.renderDistance,
    this.FOV
  }

  // setup variables for the camera
  setup() {
    // set variables
    this.updateNumOfRays();
    this.setRenderDistance(450);
    this.setFOV(Math.trunc(60));// 2 * 17.7914));//2 * 38.65980825));//2 * 26.565051177078)); //66
    this.updateViewDistance();

    // set the size of each array for keeping track of the rays
    this.setRaysLength(this.numOfRays);
    this.setRaysToViewLength(this.numOfRays);
    this.setSegmentVerticesLength(this.numOfRays * 2);

    // assign default arrays to the rays
    for (var i = 0; i < this.numOfRays; i++) {
      this.raysToView[i] = createVector(0, 0);
      this.segmentVertices[i] = createVector(0, 0);
      this.segmentVertices[i + this.numOfRays] = createVector(0, 0);
    }
  }

  setViewLeftCoord(x, y) {
    this.viewLeftCoord.x = x;
    this.viewLeftCoord.y = y;
  }

  setViewRightCoord(x, y) {
    this.viewRightCoord.x = x;
    this.viewRightCoord.y = y;
  }

  setRaysLength(length) {
    if (Number.isInteger(length)) {
      this.rays = new Array(length);
    } else {
      throw new Error (this.name + " can not set length of rays");
    }
  }

  setRaysToViewLength(length) {
    if (Number.isInteger(length)) {
      this.raysToView = new Array(length);
    } else {
      throw new Error (this.name + " can not set length of rays to view");
    }
  }

  setSegmentVerticesLength(length) {
    if (Number.isInteger(length)) {
      this.segmentVertices = new Array(length);
    } else {
      throw new Error (this.name + " can not set length of segment vertices");
    }
  }

  setNumOfRays(num) {
    if (Number.isInteger(num)) {
      this.numOfRays = num;
    } else {
      throw new Error (this.name + " can not set length of num of rays");
    }
  }

  setViewDistance(num) {
    if (true) {
      this.viewDistance = num;
    } else {
      throw new Error (this.name + " can not set length of view distance");
    }
  }

  setRenderDistance(num) {
    if (Number.isInteger(num)) {
      this.renderDistance = num;
    } else {
      throw new Error (this.name + " can not set length of render distance");
    }
  }

  setFOV(num) {
    if (Number.isInteger(num)) {
      this.FOV = num;
    } else {
      throw new Error (this.name + " can not set length of FOV");
    }
  }


  // update the camera based on the player
  update() {
    // update the view screen of the camera
    var view_left_coord = createVector(0,0);
    var view_right_coord = createVector(0,0);
    var view_size = Math.ceil(this.viewDistance * tan((this.FOV / 2) * Math.PI / 180) * 2);

    // math that I don't remember anymore and is probably more complicated than it needs to be
    copy2DVector(view_left_coord, this.normal);
    rotation2DVector(view_left_coord, PI);
    increase2DVector(view_left_coord, view_size / 2);
    rotation2DVector(view_left_coord, PI/2);
    add2DVectors(view_left_coord, this.position);
    copy2DVector(view_right_coord, this.normal);
    increase2DVector(view_right_coord, view_size / 2);
    rotation2DVector(view_right_coord, PI/2);
    add2DVectors(view_right_coord, this.position);

    add2DVectors(view_left_coord, multiply2DVectors(this.normal, this.viewDistance));
    copy2DVector(this.viewLeftCoord, view_left_coord);
    add2DVectors(view_right_coord, multiply2DVectors(this.normal, this.viewDistance));
    copy2DVector(this.viewRightCoord, view_right_coord);

    // update the starting angle from the facing and the incremental angle for rays
    // this only needs to happen if one of the three settings for the camera have been changed
    // I will leave it in for now since I will be testing different camera settings

    // calculate the rays to the view window
    var alpha;
    var length;
    var view_segment_size = view_size / (this.numOfRays - 1);
    var ray_distance_to_view;

    // variables for casting rays
    var cur_ray = createVector(0,0);
    var cur_ray_pos = createVector(0,0);
    var cur_ray_to_view = createVector(0,0);

    // update rays to view
    for (var i = 0; i < this.numOfRays; i++) {
      length = view_segment_size * ((this.numOfRays - 1) / 2 - i);
      alpha = atan(length / this.viewDistance);
      ray_distance_to_view = this.viewDistance / cos(alpha);

      copy2DVector(cur_ray_to_view, this.normal);
      rotation2DVector(cur_ray_to_view, alpha);
      increase2DVector(cur_ray_to_view, ray_distance_to_view);
      copy2DVector(this.raysToView[i], cur_ray_to_view);
    }

    var casted_ray;
    var gamma_initial;
    var gamma_increment;
    if (this.numOfRays > 1) {
      gamma_increment = this.FOV / (this.numOfRays - 1);
      gamma_initial = this.FOV / 2;
    } else {
      gamma_increment = 0;
      gamma_initial = 0;
    }

    // update the rays
    for (var i = 0; i < this.numOfRays; i++) {
      // give the cur_ray an intiial position based on the camera's normal
      copy2DVector(cur_ray, this.normal);
      //console.log("ray["+i+"]"+" cur_ray normal " +cur_ray);
      // find the correct rotation of the current ray based on the number of rays present
      // convert degrees to radians
      rotation2DVector(cur_ray, degreesToRadians(-1 * gamma_initial));
      //console.log("ray["+i+"]"+" cur_ray initial rotation " +cur_ray);
      rotation2DVector(cur_ray, degreesToRadians(gamma_increment * i));

      //add2DVectors(cur_ray_pos, this.position);
      var ray = new Ray(cur_ray, createVector(0,0), createVector(0,0));
      casted_ray = this.castRay(ray, world);
      casted_ray.updateFace(world);
      casted_ray.updateEnvironment();
      casted_ray.index = i;
      //casted_ray.updateLight(world);
      this.rays[i] = casted_ray;
    }

    this.updateRays();

    // DEBUG ONLY
    // update the settings of the camera

    // view distance
    // KEY [80]: P
    // KEY [79]: O
    if (DEBUG_KEYBOARD_UPDATE_VIEW_DISTANCE) {
      if (keyIsDown(80)) {
        this.viewDistance += 1;

        // alert the user
        console.log("Updated View Distance: " + this.viewDistance);
      }
      if (keyIsDown(79)) {
        if (this.viewDistance-1 > 0) {
          this.viewDistance -= 1;

          // alert the user
          console.log("Updated View Distance: " + this.viewDistance);
        }
      }
    }

    // number of rays
    // KEY [76]: l
    // KEY [75]: K
    if (DEBUG_KEYBOARD_UPDATE_RAYS) {
      if (keyIsDown(76)) {
        this.numOfRays += 2;

        // calculate the rays from c to view
        var range = (this.numOfRays + this.numOfRays % 2) / 2;
        var normalMag = this.viewDistance;
        var theta;

        // initial arrays
        this.rays = new Array(this.numOfRays);
        this.raysToView = new Array(this.numOfRays);

        // assign default arrays to the rays
        for (var i=0; i<this.rays.length; i++) {
          this.rays[i] = createVector(0,0);
          this.raysToView[i] = createVector(0,0);
        }

        // alert the user
        console.log("Updated Number of Rays: " + this.numOfRays);
      }
      if (keyIsDown(75)) {
        if (this.numOfRays-2 > 2) {

          this.numOfRays -= 2;

          // calculate the rays from c to view
          var range = (this.numOfRays + this.numOfRays % 2) / 2;
          var normalMag = this.viewDistance;
          var theta;

          // initial arrays
          this.rays = new Array(this.numOfRays);
          this.raysToView = new Array(this.numOfRays);

          // assign default arrays to the rays
          for (var i=0; i<this.rays.length; i++) {
            this.rays[i] = createVector(0,0);
            this.raysToView[i] = createVector(0,0);
          }

          // alert the user
          console.log("Updated Number of Rays: " + this.numOfRays);
        }
      }
    }
  }

  updateViewDistance() {
    // canvas height equals segment size (50)
    // width / height = aspectratio 4 / 3
    let canvas_width = (4/3) * world.segmentSize;//gl.canvas.width;

    // trig using the width and angle
    let vd = (canvas_width / 2) / Math.tan((this.FOV / 2) * 3.141592 / 180);

    this.setViewDistance(vd);
  }

  updateNumOfRays() {
    let c = document.getElementById("glcanvas");
    let width = Math.trunc(c.clientWidth - (c.clientWidth % 2));
    let max_num = 400;

    if (width < max_num) {
      this.setNumOfRays(width);
    } else {
      this.setNumOfRays(max_num);
    }
  }

  updateRays() {
    // variables for creating walls
    var wallSegmentWidth = gl.canvas.width / this.numOfRays;//world.width * world.segmentSize / this.numOfRays;
    var horizonHeight = gl.canvas.height * world.horizon;

    var viewSize = Math.ceil(this.viewDistance * tan((this.FOV / 2) * Math.PI / 180) * 2);
    var viewSegmentSize = viewSize / (this.numOfRays);

    for (let ray of this.rays) {
      ray.updateTexPos(world.player);
      this.updateRay(ray, wallSegmentWidth, horizonHeight, viewSegmentSize);
    }
  }

  updateRay(ray, wallSegmentWidth, horizonHeight, viewSegmentSize) {
    let i = ray.index;

    // calculate the magnitude
    let length = viewSegmentSize * ((this.numOfRays - 1) / 2 - i);
    let alpha = atan(length / this.viewDistance);
    let distortedMagnitude = magnitude2DVector(ray.position);
    let magnitude = Math.trunc(cos(alpha) * distortedMagnitude);
    ray.magnitude = magnitude;

    let VD = this.viewDistance; // view distance 

    let segmentHeight;
    
    // draw a segment for the current ray
    if (ray.isCollisionWall) {
      // calculate wall height
      // ratio
      // projected wall height / view distance = actual wall height / distance
      ray.segmentHeight = (world.segmentSize / magnitude) * VD; 
      segmentHeight = (ray.segmentHeight / world.segmentSize) * gl.canvas.height;
      //console.log(ray.segmentHeight);
      let left_x = ray.index * wallSegmentWidth;
      let right_x = left_x + wallSegmentWidth;
      let top_y = horizonHeight - segmentHeight / 2;
      let bottom_y = top_y + segmentHeight;

      if (ray.segmentHeight >= world.segmentSize) {
        top_y = 0;
        bottom_y = gl.canvas.height;
      }

      left_x = Math.trunc(left_x);
      top_y = Math.trunc(top_y);
      right_x = Math.trunc(right_x);
      bottom_y = Math.trunc(bottom_y);

      ray.setTexLocation(ray.texture.x, ray.texture.y);

      ray.updateClipCoords(left_x, right_x, top_y, bottom_y);

    } else {
      // when the ray does not collide with a wall, but rather reaches the render limit
      ray.segmentHeight = (world.segmentSize / this.renderDistance) * VD;
      segmentHeight = (ray.segmentHeight / world.segmentSize) * gl.canvas.height;

      let left_x = ray.index * wallSegmentWidth;
      let top_y = horizonHeight - segmentHeight / 2;
      let right_x = left_x + wallSegmentWidth;
      let bottom_y = top_y + segmentHeight;

      left_x = Math.trunc(left_x);
      top_y = Math.trunc(top_y);
      right_x = Math.trunc(right_x);
      bottom_y = Math.trunc(bottom_y);

      ray.setTexLocation(4, 0);

      ray.updateClipCoords(left_x, right_x, top_y, bottom_y);
    }
  }

  castRay(ray, world) {
    // calculate the slope
    try {
      var m = ray.position.y / ray.position.x;
    } catch {
      console.log("slope or x == 0");
    }

    // variable for special cases
    var case_direction = createVector(0,0);

    // cases
    if (m == -Infinity || m == Infinity) {
      // set the case direction
      if (ray.position.y < 0) {
        case_direction.y = -1;
      } else {
        case_direction.y = 1;
      }

      this.castRayCase(case_direction, ray, world);
    } else if (m == 0) {
      // set the case direction
      if (ray.position.x < 0) {
        case_direction.x = -1;
      } else {
        case_direction.x = 1;
      }

      this.castRayCase(case_direction, ray, world);
    } else {
      // set up for equations to be calculated
      // y = mx + b
      // x = y / m
      var ray_give_y = createVector(0,0); // point along ray with GIVEN y poisition
      var ray_give_x = createVector(0,0); // point along ray with GIVEN x poistion
      var player_segment_pos;
      var mag_rgy, mag_rgx; // magnitude of ray_give_x / y
      var x_direction, y_direction;
      var world_rgy = createVector(0,0), world_rgx = createVector(0,0); //world coordinates of the ray poisition
      var collision_check;
      var decision_y, decision_x;

      // initial given value
      player_segment_pos = createVector(this.position.x, this.position.y);
      player_segment_pos = world.convertWorldCoordsToSegCoords(player_segment_pos);

      // calculate the direction of the ray for determing the quadrant this ray is facing
      x_direction = ray.position.x / Math.abs(ray.position.x);
      y_direction = ray.position.y / Math.abs(ray.position.y);

      // calculate the initial x and y values
      if (x_direction == 1) {
        decision_x = 1;
      } else {
        decision_x = 0;
      }
      ray_give_x.x += (world.segmentSize * decision_x - (this.position.x % world.segmentSize));// * x_direction;
      if (y_direction == 1) {
        decision_y = 1;
      } else {
        decision_y = 0;
      }//determines whether to multiple by 1 or 0
      ray_give_y.y += (world.segmentSize * decision_y - (this.position.y % world.segmentSize));// * y_direction;

      // solve for the equations
      // calculations here are relative to the origin of the ray, which is 0,0 or camera origin
      ray_give_x.y = m * ray_give_x.x;
      ray_give_y.x = ray_give_y.y / m;

      // calculate the magnitude of the new rays
      mag_rgx = magnitude2DVector(ray_give_x);
      mag_rgy = magnitude2DVector(ray_give_y);

      // LOOP
      while(mag_rgy < this.renderDistance || mag_rgx < this.renderDistance) {
        // check which point along the ray is closer
        if (mag_rgy < mag_rgx) {

          // update collision check
          copy2DVector(world_rgy, this.position);
          add2DVectors(world_rgy, ray_give_y);
          
          if (ray.position.y < 0) {
            world_rgy.y -= world.segmentSize;
            collision_check = world.collisionCheckVector(world_rgy, ray);
            world_rgy.y += world.segmentSize;
          } else {
            collision_check = world.collisionCheckVector(world_rgy, ray);
          }

            // check for collision
            if (collision_check) {
              ray.isCollisionWall = true;
              copy2DVector(ray.position, ray_give_y);
              ray.magnitude = mag_rgy;
              break;
            } else {

            // update the ray postioin
            copy2DVector(ray.position, ray_give_y);
              ray.magnitude = mag_rgy;

              // update ray_give_y with an increment in the given y value
              ray_give_y.y += y_direction * world.segmentSize;
              ray_give_y.x = ray_give_y.y / m;
              mag_rgy = magnitude2DVector(ray_give_y);
          }
        } else {
          // update collision check
          copy2DVector(world_rgx, this.position);
          add2DVectors(world_rgx, ray_give_x);
          if (ray.position.x < 0) {
            world_rgx.x -= world.segmentSize;
            collision_check = world.collisionCheckVector(world_rgx, ray);
            world_rgx.x += world.segmentSize;
          } else {
            collision_check = world.collisionCheckVector(world_rgx, ray);
          }

            // check for collision
            if (collision_check) {
              ray.isCollisionWall = true;
              // save coords and exit the loop
              copy2DVector(ray.position, ray_give_x);
              ray.magnitude = mag_rgx;
              break;
            } else {
              // update the ray postioin
              copy2DVector(ray.position, ray_give_x);
              ray.magnitude = mag_rgx;

              // update ray_give_x with an incrmenet in the given x value
              ray_give_x.x += x_direction * world.segmentSize;
              ray_give_x.y = m * ray_give_x.x;
              mag_rgx = magnitude2DVector(ray_give_x);
            }
        }
      }
    }

    return ray;
  }

  castRayCase(cd, ray, world) {
    // calculat initial position
    var initial_pos = createVector(0, 0);
    var world_ip = createVector(0,0);
    var size = world.segmentSize;
    var origin = createVector(0,0);
    var mag_ip;
    var collision_check;

    copy2DVector(origin, this.position);

    // grab the origin of the ray inside the segment
    origin.x %= size;
    origin.y %= size;

    // define initial positions of ray
    initial_pos.x = ((size / 2 + cd.x * size / 2) - cd.x * origin.x) * cd.x;
    initial_pos.y = ((size / 2 + cd.y * size / 2) - cd.y * origin.y) * cd.y;

    // relative to world grid
    copy2DVector(world_ip, this.position);
    add2DVectors(world_ip, initial_pos);

    // decide if the position value is active
    initial_pos.x *= Math.abs(cd.x);
    initial_pos.y *= Math.abs(cd.y);

    // magnitude
    mag_ip = magnitude2DVector(initial_pos);

    // loop
    while (mag_ip < this.renderDistance) {
      // collision check
      // adjust offset for check if necessary
      if (cd.x < 0) {
        world_ip.x -= size;
      }
      if (cd.y < 0) {
        world_ip.y -= size;
      }

      // check
      collision_check = world.collisionCheckVector(world_ip, ray);

      // correct the offset
      if (cd.x < 0) {
        world_ip.x += size;
      }
      if (cd.y < 0) {
        world_ip.y += size;
      }

      //
      if (collision_check) {
        copy2DVector(ray.position, initial_pos);
        break;
      } else {
        copy2DVector(ray.position, initial_pos);

        initial_pos.x += size * cd.x;
        world_ip.x += size * cd.x;
        initial_pos.y += size * cd.y;
        world_ip.y += size * cd.y;

        mag_ip = magnitude2DVector(initial_pos);
      }
    }
  }
}
