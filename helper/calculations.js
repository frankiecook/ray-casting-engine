/*
CALCULATIONSs
math helper functions that I've found useful

Need to adjust for edge cases
*/

// rounding
function roundDecimal(num, place) {

  var temp = num * (10 ** place);
  temp = Math.round(temp);
  temp /= 10 ** place;

  return temp
}

// add two 2D vectors together
// stores the value in the first input
function add2DVectors(vec1, vec2) {
  vec1.x += vec2.x;
  vec1.y += vec2.y;
}

// vector subtraction
// endpoint = vec1
// starting point = vec2
// vec3 = vec1 - vec2
function sub2DVectorsReturn(vec1, vec2) {
  var vector = createVector(vec1.x - vec2.x, vec1.y - vec2.y);

  return vector
}

// Dot Product
function dot2DVector(a, b) {
  var value = a.x * b.x + a.y * b.y;

  return value
}

// copies a 2D vector into another
// copies the value into the first vector
function copy2DVector(vec1, vec2) {
  vec1.x = vec2.x;
  vec1.y = vec2.y;
}

// increase the magnitude of a vector by a specified length
// resize vector to a specific Length
// u ||v|| = L v
function increase2DVector(vec1, length) {
  var magnitude = sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  var ratio = length / magnitude;

  if (magnitude == 0) {
    ratio = 0;
  }

  var x = roundDecimal(vec1.x, 4);
  var y = roundDecimal(vec1.y, 4);
  vec1.x += x * ratio;
  vec1.y += y * ratio;
}

// rotate a specified vector by a certian radian
function rotation2DVector(vec1, rotation) {
  var rotMatrix = [[cos(rotation), -sin(rotation)], [sin(rotation), cos(rotation)]];;

  var x = vec1.x;
  var y = vec1.y;

  if (vec1.x == 0 && vec1.y == 0) {

  } else {
    vec1.x = roundDecimal(rotMatrix[0][0] * x + rotMatrix[0][1] * y, 4);
    vec1.y = roundDecimal(rotMatrix[1][0] * x + rotMatrix[1][1] * y, 4);
  }
}

// multiplies a 2D vector by a scalar
function multiply2DVectors(vec1, x) {
  var vec2 = createVector(0,0);
  roundDecimal(vec2.x = vec1.x * x, 4);
  roundDecimal(vec2.y = vec1.y * x, 4);
  return vec2
}
function scalar2DVector(vec1, x) {
  vec1.x = roundDecimal(vec1.x * x, 4);
  vec1.y = roundDecimal(vec1.y * x, 4);
}

// returns the magnitude of a 2D vector
function magnitude2DVector(vector) {
  var value = sqrt(vector.x * vector.x + vector.y * vector.y);
  return value
}

// normalizes a 2D vector
function normalize2DVector(vector) {
  var temp = createVector(0,0);
  temp.x = vector.x;
  temp.y = vector.y;

  var mag = magnitude2DVector(vector);

  // check if magnitude equals 0
  if (mag == 0) {
    vector.x = 0;
    vector.y = 0;
  } else {
    vector.x = temp.x / mag;
    vector.y = temp.y / mag;
  }
}

// cast a ray
function castRay(ray, world, max_mag) {
      // variables
      var slope;
      var y_intercept;
      var given_x = createVector(0, 0);
      var given_y = createVector(0, 0);
      var segment_size = world.segmentSize;
      var mag_given_x;
      var mag_given_y;

      // set up the ray position (end position) relative to the ray origin
      copy2DVector(ray.position, ray.normal);

      // Calculate the equation of the line
      // y = m * x + b
      // m : slope
      // b : y-intercept
      // y-intercept will equal zero when the the ray origin is the grid
      // origin of ray lies on line
      if (ray.normal.x != 0) {
        slope = ray.normal.y / ray.normal.x; // I'm cheating and using the normal
      } else {
        // edge case ray.normal.x == 0
      }

      // find default values for the two positions
      // one position is along the first y-wall that the ray intersects
      // second position is along the first x-wall that the ray intersects
      // starting values depends on the facing of the normal vector
      // it would be amazing if I could relate these equations to a -1 or +1
      // based on the normal.x
      if (ray.normal.x > 0) {
        given_x.x = (segment_size - ray.origin.x % segment_size);
      } else if (ray.normal.x < 0 ) {
        given_x.x = (ray.origin.x % segment_size) * -1;
      } else {
        // edge case (normal.x == 0)
        given_x.x = 0;
        given_y.x = 0;
      }

      if (ray.normal.y > 0) {
        given_y.y = segment_size - (ray.origin.y % segment_size);
      } else if (ray.normal.y < 0) {
        given_y.y = (ray.origin.y % segment_size) * -1;
      } else {
        // edge case (normal.y == 0)
        given_y.y = 0;
        given_x.y = 0;
      }

      // solve two positions for their corresponding values on the line
      // y = m * x
      if (ray.normal.x != 0 && ray.normal.y != 0) {
        given_x.y = slope * given_x.x;// + y_intercept;
        given_y.x = (given_y.y) / slope;
      } else if (ray.normal.x == 0) {
        // edge case ray.normal.x == 0
        // edge case (normal.x == 0)
        given_x.x = 0;
        given_y.x = 0;

        if (ray.normal.y > 0) {
          given_y.y = segment_size - (ray.origin.y % segment_size);
          given_x.y = segment_size - (ray.origin.y % segment_size);
        } else if (ray.normal.y < 0) {
          given_y.y = (ray.origin.y % segment_size) * -1;
          given_x.y = (ray.origin.y % segment_size) * -1;
        } else {
          // edge case should not be here
          console.log("YOU SHOULDNT BE HERE");
        }
      } else if (ray.normal.y == 0){
        // edge case ray.normal.y == 0
        // edge case (normal.y == 0)
        if (ray.normal.x > 0) {
          given_y.x = segment_size - (ray.origin.x % segment_size);
          given_x.x = segment_size - (ray.origin.x % segment_size);
        } else if (ray.normal.x < 0) {
          given_y.x = (ray.origin.x % segment_size) * -1;
          given_x.x = (ray.origin.x % segment_size) * -1;
        } else {
          // edge case should not be here
          console.log("YOU SHOULDNT BE HERE");
        }
      }

      // calculate magnitude of initial vectors
      mag_given_x = magnitude2DVector(given_x);
      mag_given_y = magnitude2DVector(given_y);

      /*********
       THE LOOP
      *********/
      // variables
      var collision_check_x_pos;
      var collision_check_y_pos;
      var collision_given_x;
      var collision_given_y;
      var i = 0;

      console.log("max mag : " + max_mag);
      console.log("mag_given_x: " + mag_given_x);
      console.log("mag_given_y: " + mag_given_y);

      while(mag_given_x < max_mag || mag_given_y < max_mag) {
        i++;

        // collision check
        //given_x.y -= segment_size;
        if (ray.normal.x < 0) {
          given_x.x -= segment_size;
        }
        if (ray.normal.y < 0) {
          given_y.y -= segment_size;
        }
        if (ray.normal.x == 0 && ray.normal.y < 0) {
          given_x.y -= segment_size;
          given_y.y -= segment_size;
        }
        if (ray.normal.y == 0 && ray.normal.x < 0) {
          given_x.x -= segment_size;
          given_y.x -= segment_size;
        }
        if (ray.normal.y == 0 && ray.normal.x > 0) {
          //given_x.x += segment_size;
          //given_y.x += segment_size;
        }
        collision_vector_given_x = createVector(given_x.x + ray.origin.x, given_x.y + ray.origin.y);
        collision_vector_given_y = createVector(given_y.x + ray.origin.x, given_y.y + ray.origin.y);
        if (ray.normal.x < 0) {
          given_x.x += segment_size;
        }
        if (ray.normal.y < 0) {
          given_y.y += segment_size;
        }
        if (ray.normal.x == 0 && ray.normal.y < 0) {
          given_x.y += segment_size;
          given_y.y += segment_size;
        }
        if (ray.normal.y == 0 && ray.normal.x < 0) {
          given_x.x += segment_size;
          given_y.x += segment_size;
        }
        if (ray.normal.y == 0 && ray.normal.x > 0) {
          //given_x.x -= segment_size;
          //given_y.x -= segment_size;
        }

        //given_y.x += segment_size;
        collision_check_x_pos = collisionCheckPosition(collision_vector_given_x, world);
        collision_check_y_pos = collisionCheckPosition(collision_vector_given_y, world);
        //given_x.y += segment_size;
        //given_y.x -= segment_size;
        //given_x.x -= segment_size;

        // calculate magnitude of initial vectors
        mag_given_x = magnitude2DVector(given_x);
        mag_given_y = magnitude2DVector(given_y);

        // decide wich calculated position is closer to the orgin
        // position with a given x value is closer
        if (mag_given_x <= mag_given_y) {

          if (collision_check_x_pos) {
            // update the ray position
            copy2DVector(ray.position, given_x);

            console.log("BREAK X: " + collision_vector_given_x);
            return true;
          } else {
            // increment the given x vector
            if (ray.normal.x != 0) {
              given_x.x += segment_size * (ray.normal.x / Math.abs(ray.normal.x));
            } else {
              // edge case ray.normal.x == 0
              // edge case (normal.x == 0)
              //if (ray.normal.y > 0) {
                given_y.y += segment_size * (ray.normal.y / Math.abs(ray.normal.y));
                given_x.y += segment_size * (ray.normal.y / Math.abs(ray.normal.y));
              //} else if (ray.normal.y < 0) {
              //  given_y.y += segment_size * (ray.normal.y / Math.abs(ray.normal.y));
              //  given_x.y += segment_size * (ray.normal.y / Math.abs(ray.normal.y));
              //} else {
              //  // edge case should not be here
              //  console.log("YOU SHOULDNT BE HERE");
              //}
            }

              // solve two positions for their corresponding values on the line
              if (ray.normal.x != 0 && ray.normal.y != 0) {
                given_x.y = slope * given_x.x;
              } else {
                // edge case (normal.x == 0)
                /*if (ray.normal.y > 0) {
                  given_x.y = (segment_size - ray.origin.y % segment_size);
                  given_y.y = (segment_size - ray.origin.y % segment_size);
                } else if (ray.normal.y < 0) {
                  given_x.y = (ray.origin.y % segment_size);
                  given_y.y = (ray.origin.y % segment_size);
                }*/
              }

          console.log("mag of X Lower" + given_x);
        }
      }  else {//(mag_given_y < mag_given_x)

          if (collision_check_y_pos) {
            // update the ray position
            copy2DVector(ray.position, given_y);

            console.log("BREAK Y: " + given_y);
            collision = true;
            break;
          } else {

            if (ray.normal.y != 0) {
              given_y.y += segment_size * (ray.normal.y / Math.abs(ray.normal.y));
            } else {
              // edge case ray.normal.y == 0
              // edge case (normal.y == 0)
              given_y.x += segment_size * (ray.normal.x / Math.abs(ray.normal.x));
              given_x.x += segment_size * (ray.normal.x / Math.abs(ray.normal.x));
            }

          // solve two positions for their corresponding values on the line
          // x = y / m
          if (ray.normal.x != 0 && ray.normal.y != 0) {
            given_y.x = given_y.y / slope;
          }

          collision = false;
        }

          console.log("mag of Y Lower" + given_y);
        }
      }

      // update debug variables of the ray
      console.log("given_x final " + given_x);
      console.log("given_y final " + given_y);
      copy2DVector(ray.given_x, given_x);
      copy2DVector(ray.given_y, given_y);

      // draw a marker for both positions
      var count = 1;
      var positions_colors_origin = new Array(count * 2);
      var curOrigin = createVector(0, 0);
      var color
      for (var i = 0; i < count; i++) {
        if (i == 2) {
          //copy2DVector(curOrigin, ray.origin);
          //add2DVectors(curOrigin, given_x);
          copy2DVector(curOrigin, given_x);
          color = [0, .8, .5, 1];
        } else if (i == 1) {
          copy2DVector(curOrigin, given_y);
          color = [.4, .2, 0, 1];
        } else if (i == 0) {
          copy2DVector(curOrigin, ray.position);
          color = [.1, .1, .9, 1];
        }
        var temp = curOrigin.x;// + ray.origin.x;
        console.log(i + " current vector " + temp);
        positions_colors_origin[i * 2] = [curOrigin.x + ray.origin.x,
                                         curOrigin.y + ray.origin.y,
                                         6,
                                         6];
        positions_colors_origin[i * 2 + 1] = color // idk
      }

      rectMain(0, 0, 0, 0, [0, 0, 0, 1], positions_colors_origin);


}

// update the 9 x 9 grid around the player, enemy, or object
function updateSurroundings(surroundings, object_position, world_array, segment_size) {
  var segment_position = createVector((object_position.x - (object_position.x % segment_size)) / segment_size,
                                (object_position.y - (object_position.y % segment_size)) / segment_size);

  // a trigger that sets off a function for setting these would be more useful
  // only update the surroundings when the player moves to a new world segment
  surroundings[0] = world_array[segment_position.y - 1][segment_position.x - 1];
  surroundings[1] = world_array[segment_position.y - 1][segment_position.x];
  surroundings[2] = world_array[segment_position.y - 1][segment_position.x + 1];
  surroundings[3] = world_array[segment_position.y][segment_position.x - 1];
  surroundings[4] = world_array[segment_position.y][segment_position.x];
  surroundings[5] = world_array[segment_position.y][segment_position.x + 1];
  surroundings[6] = world_array[segment_position.y + 1][segment_position.x - 1];
  surroundings[7] = world_array[segment_position.y + 1][segment_position.x];
  surroundings[8] = world_array[segment_position.y + 1][segment_position.x + 1];

  // check corner cases where the adjecent edges exit
  if (surroundings[1] == 1 && surroundings[5] == 1) {surroundings[2] = 1;} // top right corner
  if (surroundings[5] == 1 && surroundings[7] == 1) {surroundings[8] = 1;} // bottom right corner
  if (surroundings[7] == 1 && surroundings[3] == 1) {surroundings[6] = 1;} // bottom left corner
  if (surroundings[3] == 1 && surroundings[1] == 1) {surroundings[0] = 1;} // top left corner

  // check if out of bounds
  for (let i = 0; i < surroundings.length; i++) {
    if (surroundings[i] == undefined) {
      console.log("Boundary Limits");
      surroundings[i] = 1;
    }
  }
}

// perform a collision check for a player or enemy against the world
function collisionObjectWorld(surroundings, object_position, r, segment_size, former_position) {
  // create rectangle / square collision boxes for every wall in the surrounding area
  for (let i = 0; i < surroundings.length; i++) {
    // find rectangle position for current index, top left corner of a rectangle
    // set default values for the center (player) rectangle
    var rx = object_position.x - object_position.x % segment_size;
    var ry = object_position.y - object_position.y % segment_size;

    // cases
    // if i = 0, 3, 6 then rx -= size
    // if i = 2, 5, 8 then rx += size
    // etc.
    if (i == 0 || i == 3 || i == 6) {rx -= segment_size;}
    if (i == 2 || i == 5 || i == 8) {rx += segment_size;}
    if (i == 0 || i == 1 || i == 2) {ry -= segment_size;}
    if (i == 6 || i == 7 || i == 8) {ry += segment_size;}

    if (surroundings[i] == 1) {
      //var wall = new Wall(rx, ry, segment_size, segment_size);

      if (collisionCircleRectangle(object_position.x, object_position.y, r, rx, ry, segment_size, segment_size)) {
        console.log("COLLISION AT : " + i);
        var cx = object_position.x;
        var cy = object_position.y;
        var rw = segment_size;
        var rh = segment_size;

        // temporary variables for the square's closet X/Y edges to the circle's position
        var testX = cx;
        var testY = cy;

        // check for which edge of the rectangle the circle is on
        if (cx < rx) { testX = rx }                   // left edge
        else if (cx > rx + rw) { testX = rx + rw; }   // right edge

        if (cy < ry) { testY = ry; }                  // top edge
        else if (cy > ry + rh) { testY = ry + rh; }   // bottom edge

        // run the Pythagorean Theorem using the circle's position and two rectangle edges
        var disX = Math.abs(cx - testX);
        var disY = Math.abs(cy - testY);

        // testing changing the player position
        //object_position.y = object_position.y - object_position.y % segment_size + segment_size + r;

        // check for which edge of the rectangle the circle is on
        /*if (cx < rx) { object_position.x = former_position.x; }                   // left edge
        else if (cx > rx + rw) { object_position.x = former_position.x; }   // right edge

        if (cy < ry) { object_position.y = former_position.y; }                  // top edge
        else if (cy > ry + rh) { object_position.y = former_position.y; }   // bottom edge*/

        if (cx <= rx + rw && cx >= rx) {
          object_position.y = ry + segment_size + r;//former_position.y;
        } else if (cy <= ry + rh && cy >= ry) {
          object_position.x = rx + segment_size + r;//former_position.x;
        } else {
          if (disX < disY) {
            object_position.y = ry + segment_size + r;//former_position.y;
          } else {
            object_position.x = rx + segment_size + r;//former_position.x;
          }
        }
      }
    }
  }
}

// collision check between an object with a rectangle collision box and the world
function collisionCheckRectangleWorld(surroundings, position, radius, segment_size) {
  // variables
  var given_rec_x = position.x - radius;
  var given_rec_y = position.y - radius;

  // create rectangle / square collision boxes for every wall in the surrounding area
  for (let i = 0; i < surroundings.length; i++) {
    if (surroundings[i] == 1) {
      // find rectangle position for current index, top left corner of a rectangle
      // set default values for the center (player) rectangle
      var world_rec_x = position.x - position.x % segment_size;
      var world_rec_y = position.y - position.y % segment_size;

      // cases
      // if i = 0, 3, 6 then rx -= size
      // if i = 2, 5, 8 then rx += size
      // etc.
      if (i == 0 || i == 3 || i == 6) {world_rec_x -= segment_size;}
      if (i == 2 || i == 5 || i == 8) {world_rec_x += segment_size;}
      if (i == 0 || i == 1 || i == 2) {world_rec_y -= segment_size;}
      if (i == 6 || i == 7 || i == 8) {world_rec_y += segment_size;}

      var collision = collisionRectangleRectangle(given_rec_x, given_rec_y, radius * 2, radius * 2, world_rec_x,
                                                  world_rec_y, segment_size, segment_size);
      if (collision) {
        // check if any of the four walls are touching with another segment
        // this solution feels icky, unneccesary, I think it could be better
        var n_touch = false;
        var e_touch = false;
        var s_touch = false;
        var w_touch = false;
        // check north segment
        if (surroundings[i - 3] == 1) {
          n_touch = true;
        }
        // check east segment
        if (surroundings[i + 1] == 1) {
          e_touch = true;
        }
        // check south segment
        if (surroundings[i + 3] == 1) {
          s_touch = true;
        }
        // check west segment
        if (surroundings[i - 1] == 1) {
          w_touch = true;
        }

        // set up variables
        var rect_origin = createVector(world_rec_x + segment_size / 2, world_rec_y + segment_size / 2);

        var n_edge = rect_origin.y - segment_size / 2;
        var e_edge = rect_origin.x + segment_size / 2;
        var s_edge = rect_origin.y + segment_size / 2;
        var w_edge = rect_origin.x - segment_size / 2;

        // calculate the faces' position for the current square
        var n = position.y - n_edge;
        var e = (position.x - e_edge) * -1;
        var s = (position.y - s_edge) * -1;
        var w = position.x - w_edge;

        // check which face is closest
        if (!n_touch && n <= e && n <= s && n <= w) {
          position.y = n_edge - radius;
        } else
        if (!e_touch && e <= n && e <= s && e <= w) {
          position.x = e_edge + radius;
        } else
        if (!s_touch && s <= e && s <= n && s <= w) {
          position.y = s_edge + radius;
        } else
        if (!w_touch && w <= e && w <= s && w <= n) {
          position.x = w_edge - radius;
        }

        /*
        console.log("COLLISION AT : " + i);

        // find the current face
        var raw = rbw = segment_size;
        var rah = rbh = segment_size;
        var rax = given_rec_x;
        var ray = given_rec_y;
        var rbx = world_rec_x;
        var rby = world_rec_y;


        var CONDA = rax > rbx + rbw; // rect a's left edge is to the right of rect b's right edge
        var CONDB = ray > rby + rbh; // rect a's top edge is below rect b's bottom edge
        var CONDC = rax + raw < rbx; // rect a's right edge is to the left of rect b's left edge
        var CONDD = ray + rah < rby; // rect a's bottom edge is above rect b's top edge
        console.log(CONDB);
        // MATH TRICK
        /*if (!CONDA && CONDB) {
          position.x = rbx;
        } else
        if (!CONDB) {
          position.y = rby + rbh;
        } else
        if (!CONDC) {
          position.x = rbx + rbw;
        } else
        if (!CONDD) {
          position.y = rby;
        }
        var distance = createVector(rbx - rax, rby - rbx);
        normalize2DVector(distance);
        //console.log(distance);

        if (rax + raw > rbx || rax < rbx + rbw) {
          console.log("inside x");
          if (ray < rby) {
            position.y = ray - raw / 2;
          } else
          if (ray > rby) {
            position.y = ray + radius;
          }
        }

    */  }
    }
  }
}

function degreesToRadians(deg) {
  return deg * Math.PI / 180;
}

// insertion sorting algorithm given two arrays
function sortByMagnitude(entities, rays) {
  var objects = new Array(0);

  for (let ray of rays) {
    objects.push(ray);
  }
  for (let entity of entities) {
    objects.push(entity);
  }


  var first;
  var second;

  for (var i = 0; i < objects.length - 1; i++) {
    first = objects[i];
    second = objects[i + 1];

    if (first.magnitude < second.magnitude) {
      objects[i] = second;
      objects[i + 1] = first;

      // reverse insertion
      for (var j = i; j > 0; j--) {
        first = objects[j - 1];
        second = objects[j];

        if (first.magnitude < second.magnitude) {
          objects[j - 1] = second;
          objects[j] = first;
        }
      }
    }
  }
  for (let object of objects.reverse()) {
    //console.log(object.magnitude);
  }
  return objects
}
