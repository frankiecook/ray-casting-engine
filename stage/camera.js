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
constructor(): builds the object with predefined variables
setup(): set up aspects of a newly created camera

*/

let DEBUG_KEYBOARD_UPDATE_RAYS = false;
let DEBUG_KEYBOARD_UPDATE_VIEW_DISTANCE = false;
let DEBUG_PLOT_COUNTERPARTS = false;
let DEBUG_THE_LOOP_CASE_0 = false;
let DEBUG_THE_LOOP_CASE_1 = false;
let DEBUG_THE_LOOP_CASE_2 = false;
let DEBUG_THE_LOOP_CASE_3 = false;

class Camera {
  constructor() {
    this.position = createVector(0, 0),
    this.normal = createVector(1, 0),
    this.viewLeftCoord = createVector(0, 0),
    this.viewRightCoord = createVector(0, 0),
    this.rays = [],
    this.raysToView = [],
    this.segmentVertices,
    this.numOfRays = 3,
    this.viewDistance = 10,
    this.renderDistance = 600,
    this.FOV = 66
  }

  // initial set up for the camera
  // this will create the array for rays, and segment vertices
  // fills the arrays with defualt vectors
  setup(currentPlayer) {
    copy2DVector(this.position, currentPlayer.position);
    copy2DVector(this.normal, currentPlayer.normal);

    // set the size of each array for keeping track of the rays
    this.rays = new Array(this.numOfRays);
    this.raysToView = new Array(this.numOfRays);
    this.segmentVertices = new Array(this.numOfRays * 2);

    // assign default arrays to the rays
    for (var i = 0; i < this.numOfRays; i++) {
      this.raysToView[i] = createVector(0, 0);
      this.segmentVertices[i] = createVector(0, 0);
      this.segmentVertices[i + this.numOfRays] = createVector(0, 0);
    }
  }

  // update the camera's position, normal, and rays
  update(player) {
    // update position and normal based on the player's posisiton and normal
    copy2DVector(this.position, player.position);
    copy2DVector(this.normal, player.normal);

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

    var ray;

    // update the rays
    for (var i = 0; i < this.numOfRays; i++) {
      length = view_segment_size * ((this.numOfRays - 1) / 2 - i);
      alpha = atan(length / this.viewDistance);
      ray_distance_to_view = this.viewDistance / cos(alpha);

      copy2DVector(cur_ray, this.normal);
      rotation2DVector(cur_ray, alpha);

      copy2DVector(cur_ray_pos, cur_ray);
      add2DVectors(cur_ray_pos, this.position);

      ray = this.castRay(cur_ray_pos, cur_ray, this.position, world);
      this.rays[i] = ray;
    }

    /* DEBUG
    update the settings of the camera using the keyboard
    */

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

  // cast a ray
  castRay(position, normal, origin, world) {

    // new cast ray
    // uh-oh, this is not going to account for enemies and objects
    var ray = new Ray(position, normal, origin);
    var normalCopy = createVector(ray.normal.x, ray.normal.y);

    // position of ray relative to world origin
    copy2DVector(ray.position, ray.origin);
    add2DVectors(ray.position, ray.normal);

    var slope;
    var y_intercept;
    ray.normal.y *= -1; // the y of the normal is flipped right now so I have to correct for that I HAVE NO IDEA WHY
    ray.origin.y *= -1; // same for the position

    // y = m * x + b
    // m : slope
    slope = ray.normal.y / ray.normal.x; // I'm cheating and using the normal

    // b : y-intercept
    // origin of ray lies on line
    y_intercept = ray.origin.y - slope * ray.origin.x;

    if (ray.normal.x != 0) {
      var x_1 = 0;
      var y_1 = slope * x_1 + y_intercept;
      var x_2 = 500;
      var y_2 = slope * x_2 + y_intercept;
    } else {
      var y_1 = -0;
      var x_1 = ray.origin.x;
      var y_2 = -500;
      var x_2 = ray.origin.x;
    }

    // change sign of variable for plotting to javascript canvas
    var canvas_swap = -1;

    // case 0
    if (ray.normal.x > 0 && ray.normal.y >= 0) {
          // segment origin : Northwest corner of the segment rays are cast from
          // counterpart_x : x value for incrementing y values by the segment size
          // counterpart_y : y value for incrementing x values by the segment size
          // player_cx : ray from player's position to counterpart-x's position
          // player_cy : ray from player's position to counterpart-y's position
          // mag_player_cx : magnitude of the player_cx
          // mag_player_cy : magnitude of the player_cy
          var segment_origin = createVector(0, 0);
          var counterpart_x = createVector(0, 0);
          var counterpart_y = createVector(0, 0);
          var player_cx = createVector(0, 0);
          var player_cy = createVector(0, 0);
          var mag_player_cx;
          var mag_player_cy;
          var collision_check;
          var y_process = 0;
          var x_process = 0;

          // set segment origin
          copy2DVector(segment_origin, ray.origin);
          segment_origin.x -= segment_origin.x % world.segmentSize;
          segment_origin.y -= segment_origin.y % world.segmentSize;

          // moves the segment origin from Northwest to Northeast
          segment_origin.x += world.segmentSize;

          // counterpart vectors (this might be confusing)
          // one vector has a set x value and the other a set y value
          // each vector's counterpart is calculated based on these set values
          counterpart_y.x = segment_origin.x;
          counterpart_x.y = segment_origin.y;

          // calculate counterpart
          // y = m * x + b
          // x = ( y - b ) / m
          counterpart_y.y = slope * counterpart_y.x + y_intercept;
          counterpart_x.x = ( counterpart_x.y - y_intercept ) / slope;

          if (DEBUG_PLOT_COUNTERPARTS) {
            rectMain(counterpart_x.x, counterpart_x.y * -1, 5, 5, [0, 1, 0, 1]);
            rectMain(counterpart_y.x, counterpart_y.y * -1, 5, 5, [0, 0, 1, 1]);
          }

          // math for player_c x and y
          // these intersection points are relative to world origin
          // so i just have to subtract the two
          add2DVectors(player_cx, ray.origin);
          add2DVectors(player_cy, ray.origin);

          scalar2DVector(player_cx, -1);
          scalar2DVector(player_cy, -1);

          add2DVectors(player_cx, counterpart_x);
          add2DVectors(player_cy, counterpart_y);

          // find magnitude of the counterpart rays
          mag_player_cy = magnitude2DVector(player_cy);
          mag_player_cx = magnitude2DVector(player_cx);

          if (DEBUG_PLOT_COUNTERPARTS) {
            rectMain(segment_origin.x, segment_origin.y * -1, 5, 5, [1, 0, 0, 1]);

            console.log("RED: starting corner "+ segment_origin);
            console.log("First Two Coords ");
            console.log("GREEN: start coords to collision_x " + player_cx);
            console.log("BLUE: start coords to collision_y " + player_cy);
          }

          // THE LOOP
          // this is where the rays are being "cast"
          // in reality, two points are being calculated along the line of the ray
          // a comparison is made to figure out which point is closer to the camera
          // and that closer point will be changed based on an increment in the x or y direction by the segment size
          while(mag_player_cy < this.renderDistance || mag_player_cx < this.renderDistance) {
            // check which point is closer to the camera
            if (mag_player_cx < mag_player_cy) {
              // shifts the values in the y direction for a better representation of the world when testing for collision
              counterpart_x.y += world.segmentSize;
              collision_check = collisionCheckRay(counterpart_x, ray, world);
              counterpart_x.y -= world.segmentSize;

              if (DEBUG_THE_LOOP_CASE_0) {
                console.log("CHECK: mag_cx < mag_cy");
              }

              // check for collision
              if (collision_check) {
                // save coords and exit the loop
                copy2DVector(ray.position, counterpart_x);

                if (DEBUG_THE_LOOP_CASE_0) {
                  console.log("collistion true cp_x");
                }

                break;
              } else {
                // increase x counterpart by segment size in the y direction
                // update x counterpart's x value
                counterpart_x.y += world.segmentSize;
                counterpart_x.x = ( counterpart_x.y - y_intercept ) / slope;

                // update magnitude
                // B = C - A :: cx_from_player = cx_from_origin - ray_from_origin
                var cx_from_origin = createVector(counterpart_x.x, counterpart_x.y);
                var ray_from_origin = createVector(ray.origin.x * -1, ray.origin.y * -1);
                var cx_from_player = createVector(0, 0);

                add2DVectors(cx_from_player, cx_from_origin);
                add2DVectors(cx_from_player, ray_from_origin);

                // find magnitude of the counterpart rays
                mag_player_cx = magnitude2DVector(cx_from_player);

                if (DEBUG_THE_LOOP_CASE_0) {
                  console.log("YELLOW: new player_cx " + cx_from_player);
                  rectMain(counterpart_x.x, counterpart_x.y * -1, 5, 5, [0, 1, 1, 1]);
                }
              }
            } else {
              // update collision check
              collision_check = collisionCheckRay(counterpart_y, ray, world);

              if (DEBUG_THE_LOOP_CASE_0) {
                console.log("mag_cx < mag_cy");
              }

              // check collision
              if (collision_check) {
                // save coords and exit the loop
                copy2DVector(ray.position, counterpart_y);

                if (DEBUG_THE_LOOP_CASE_0) {
                  console.log("collistion true cp_y");
                }

                break;
              } else {
                // increase y counterpart by segment size in the x direction
                // update y counterpart's y value
                counterpart_y.x += world.segmentSize;
                counterpart_y.y = slope * counterpart_y.x + y_intercept;
                // no more check since comparing magnitudes

                // update magnitude
                // B = C - A :: cy_from_player = cy_from_origin - ray_from_origin
                var cy_from_origin = createVector(counterpart_y.x, counterpart_y.y);
                var ray_from_origin = createVector(ray.origin.x * -1, ray.origin.y * -1);
                var cy_from_player = createVector(0, 0);

                add2DVectors(cy_from_player, cy_from_origin);
                add2DVectors(cy_from_player, ray_from_origin);

                // find magnitude of counterpart rays
                mag_player_cy = magnitude2DVector(cy_from_player);

                if (DEBUG_THE_LOOP_CASE_0) {
                  console.log("PINK: new player_cy " + cy_from_player);
                  rectMain(counterpart_y.x, counterpart_y.y * -1, 5, 5, [1, 0, 1, 1]);
                }
              }
            }
          }
        }

    // case 1
    else if (ray.normal.x <= 0 && ray.normal.y > 0) {
          var segment_origin = createVector(0, 0);
          copy2DVector(segment_origin, ray.origin);
          segment_origin.x -= segment_origin.x % world.segmentSize;
          segment_origin.y -= segment_origin.y % world.segmentSize;
          segment_origin.y *= -1;

          rectMain(segment_origin.x, segment_origin.y, player.radius * 2, player.radius * 2, [1, .2, .8, 1]);

    }

    // case 2
    else if (ray.normal.x < 0 && ray.normal.y <= 0) {
          // segment origin : Northwest corner of the segment rays are cast from
          // counterpart_x : x value for incrementing y values by the segment size
          // counterpart_y : y value for incrementing x values by the segment size
          // player_cx : ray from player's position to counterpart-x's position
          // player_cy : ray from player's position to counterpart-y's position
          // mag_player_cx : magnitude of the player_cx
          // mag_player_cy : magnitude of the player_cy
          var segment_origin = createVector(0, 0);
          var counterpart_x = createVector(0, 0);
          var counterpart_y = createVector(0, 0);
          var player_cx = createVector(0, 0);
          var player_cy = createVector(0, 0);
          var mag_player_cx;
          var mag_player_cy;
          var collision_check;
          var y_process = 0;
          var x_process = 0;

          // set segment origin
          copy2DVector(segment_origin, ray.origin);
          segment_origin.x -= segment_origin.x % world.segmentSize;
          segment_origin.y -= segment_origin.y % world.segmentSize;

          // moves the segment origin from Northwest to Southwest
          segment_origin.y -= world.segmentSize;

          // counterpart vectors (this might be confusing)
          // one vector has a set x value and the other a set y value
          // each vector's counterpart is calculated based on these set values
          counterpart_y.x = segment_origin.x;
          counterpart_x.y = segment_origin.y;

          // calculate counterpart
          // y = m * x + b
          // x = ( y - b ) / m
          counterpart_y.y = slope * counterpart_y.x + y_intercept;
          counterpart_x.x = ( counterpart_x.y - y_intercept ) / slope;

          if (DEBUG_PLOT_COUNTERPARTS) {
            rectMain(counterpart_x.x, counterpart_x.y * -1, 5, 5, [0, 1, 0, 1]);
            rectMain(counterpart_y.x, counterpart_y.y * -1, 5, 5, [0, 0, 1, 1]);
          }

          // math for player_c x and y
          // these intersection points are relative to world origin
          // so i just have to subtract the two
          add2DVectors(player_cx, ray.origin);
          add2DVectors(player_cy, ray.origin);

          scalar2DVector(player_cx, -1);
          scalar2DVector(player_cy, -1);

          add2DVectors(player_cx, counterpart_x);
          add2DVectors(player_cy, counterpart_y);

          // find magnitude of the counterpart rays
          mag_player_cy = magnitude2DVector(player_cy);
          mag_player_cx = magnitude2DVector(player_cx);

          if (DEBUG_PLOT_COUNTERPARTS) {
            rectMain(segment_origin.x, segment_origin.y * -1, 5, 5, [1, 0, 0, 1]);

            console.log("RED: starting corner "+ segment_origin);
            console.log("First Two Coords ");
            console.log("GREEN: start coords to collision_x " + player_cx);
            console.log("BLUE: start coords to collision_y " + player_cy);
          }

          // THE LOOP
          // this is where the rays are being "cast"
          // in reality, two points are being calculated along the line of the ray
          // a comparison is made to figure out which point is closer to the camera
          // and that closer point will be changed based on an increment in the x or y direction by the segment size
          while(mag_player_cy < this.renderDistance || mag_player_cx < this.renderDistance) {
            // check which point is closer to the camera
            if (mag_player_cx < mag_player_cy) {
              // update collision check
              collision_check = collisionCheckRay(counterpart_x, ray, world);

              if (DEBUG_THE_LOOP_CASE_2) {
                console.log("CHECK: mag_cx < mag_cy");
              }

              // check for collision
              if (collision_check) {
                // save coords and exit the loop
                copy2DVector(ray.position, counterpart_x);

                if (DEBUG_THE_LOOP_CASE_2) {
                  console.log("collistion true cp_x");
                }

                break;
              } else {
                // increase x counterpart by segment size in the y direction
                // update x counterpart's x value
                counterpart_x.y -= world.segmentSize;
                counterpart_x.x = ( counterpart_x.y - y_intercept ) / slope;

                // update magnitude
                // B = C - A :: cx_from_player = cx_from_origin - ray_from_origin
                var cx_from_origin = createVector(counterpart_x.x, counterpart_x.y);
                var ray_from_origin = createVector(ray.origin.x * -1, ray.origin.y * -1);
                var cx_from_player = createVector(0, 0);

                add2DVectors(cx_from_player, cx_from_origin);
                add2DVectors(cx_from_player, ray_from_origin);

                // find magnitude of the counterpart rays
                mag_player_cx = magnitude2DVector(cx_from_player);

                if (DEBUG_THE_LOOP_CASE_2) {
                  console.log("YELLOW: new player_cx " + cx_from_player);
                  rectMain(counterpart_x.x, counterpart_x.y * -1, 5, 5, [0, 1, 1, 1]);
                }
              }
            } else {
              // update collision check
              // shifts the values in the x direction for a better representation of the world when testing for collision
              counterpart_y.x -= world.segmentSize;
              collision_check = collisionCheckRay(counterpart_y, ray, world);
              counterpart_y.x += world.segmentSize;

              if (DEBUG_THE_LOOP_CASE_2) {
                console.log("mag_cx < mag_cy");
              }

              // check collision
              if (collision_check) {
                // save coords and exit the loop
                copy2DVector(ray.position, counterpart_y);

                if (DEBUG_THE_LOOP_CASE_2) {
                  console.log("collistion true cp_y");
                }

                break;
              } else {
                // increase y counterpart by segment size in the x direction
                // update y counterpart's y value
                counterpart_y.x -= world.segmentSize;
                counterpart_y.y = slope * counterpart_y.x + y_intercept;
                // no more check since comparing magnitudes

                // update magnitude
                // B = C - A :: cy_from_player = cy_from_origin - ray_from_origin
                var cy_from_origin = createVector(counterpart_y.x, counterpart_y.y);
                var ray_from_origin = createVector(ray.origin.x * -1, ray.origin.y * -1);
                var cy_from_player = createVector(0, 0);

                add2DVectors(cy_from_player, cy_from_origin);
                add2DVectors(cy_from_player, ray_from_origin);

                // find magnitude of counterpart rays
                mag_player_cy = magnitude2DVector(cy_from_player);

                if (DEBUG_THE_LOOP_CASE_2) {
                  console.log("PINK: new player_cy " + cy_from_player);
                  rectMain(counterpart_y.x, counterpart_y.y * -1, 5, 5, [1, 0, 1, 1]);
                }
              }
            }
          }
        }

    // case 3
    // x >= 0
    // y < 0
    else {
      var segment_origin = createVector(0, 0);
      copy2DVector(segment_origin, ray.origin);
      segment_origin.x -= segment_origin.x % world.segmentSize;
      segment_origin.y -= segment_origin.y % world.segmentSize;
      segment_origin.y *= -1;

      segment_origin.x += world.segmentSize;
      segment_origin.y += world.segmentSize;

      rectMain(segment_origin.x, segment_origin.y, player.radius * 2, player.radius * 2, [1, .2, .8, 1]);
    }

    // calculate face
    calculateWallFace(ray, world);

    return ray;
  }
}
