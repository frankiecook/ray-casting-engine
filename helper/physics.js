/*
PHYSICS
Refactor Date: 11/11/21

Description:
Includes functions for physics based calculations
List of functions below

collisionCheckPlayer() : determine if the given player's position collides with the environment
collisionCheckRay()    : determines if the given ray's position collides with the enviroment
calculateWallFace()    : determine which face of a wall (NSEW) a ray has collided with
checkAdjacentWalls()   : additional wall checks for calculating the face of a wall
posToSegment()         : converts coordinate vectors to segment vectors
*/

// checks if player position collides with the environment
// world variable is temporary for debugging
function collisionCheckPlayer(futurePos, player, world) {
  // position variables for current and future player position
  // nine walls in a 3x3 grid
  var current_player_segment_pos = posToSegment(player.position, world);
  var future_player_segment_pos = posToSegment(futurePos, world);
  var grid_size = 3;
  var offset = 1;
  var walls = new Array(9);
  var col_place;
  var row_place;

  // determines the environment around the player in a 3x3 grid
  for (col = 0; col < grid_size; col++) {
    for (row = 0; row < grid_size; row++) {
      col_place = current_player_segment_pos.x + (col - offset);
      row_place = current_player_segment_pos.y + (row - offset);

      walls[row + col * grid_size] = createVector(col_place, row_place);
    }
  }

  // decision
  if (world.array[future_player_segment_pos.y][future_player_segment_pos.x] == 0) {
    return false
  } else {
    return true
  }
}

// checks if ray position, the casted end of the ray, collides with the environment
// world variable is temporary for debugging
// counterpart is a calculated position on the ray's line
// returning true is a collision
// returning false is not a collision
function collisionCheckRay(counterpart, ray, world) {
  // find segment position of counterpart
  var counterpart_segment_pos = posToSegment(counterpart, world);

  // collsiion orign may not belong here
  var collision_origin = createVector(counterpart_segment_pos.x * world.segmentSize, counterpart_segment_pos.y * world.segmentSize);
  copy2DVector(ray.collisionOrigin, collision_origin);

  // flip y value of counterpart
  counterpart_segment_pos.y *= -1;

  // check if the counterpart x or y value is outside the world's size
  if (counterpart_segment_pos.x >= world.array[0].length || counterpart_segment_pos.y >= world.array.length) {
    return true
  }

  // check if the counterpart x or y value is outside the world's size
  if (counterpart_segment_pos.x < 0 || counterpart_segment_pos.y < 0) {
    return true
  }

  // decision
  if (world.array[counterpart_segment_pos.y][counterpart_segment_pos.x] == 0) {
    return false
  } else {
    return true
  }
}

// calculates the face for the wall a ray has collided with
// North Face = 0
// East Face = 1
// South Face = 2
// West Face = 3
function calculateWallFace(ray, world) {
  // variables
  var collision_origin = ray.collisionOrigin;
  var segment_size = world.segmentSize;
  var ray_collision = createVector(ray.position.x, ray.position.y * -1);

  // north face
  if (collision_origin.y == ray_collision.y) {
    ray.collisionFace = 0;
  }
  // east face
  else if (collision_origin.x + segment_size == ray_collision.x) {
    ray.collisionFace = 1;
  }
  // south face
  else if (collision_origin.y + segment_size == ray_collision.y) {
    ray.collisionFace = 2;
  }
  // west face
  else if (collision_origin.x == ray_collision.x) {
    ray.collisionFace = 3;
  }
  else {
    console.log("ERROR: Could Not Locate Wall Face!");
  }
}

// check if walls exist around the collision wall for insurrance in detecting the face
function checkAdjacentWalls(wallPosition, world) {
  // honestly not even sure how this array_wall_position works
  var array_wall_position = createVector(0, 0);
  var adjacent_walls = new Array(4);

  // the four faces
  var north = array_wall_position.y - 1;
  var east = array_wall_position.x + 1;
  var south = array_wall_position.y + 1;
  var west = array_wall_position.x - 1;

  // set array_wall_position
  array_wall_position.x = (wallPosition.x - (wallPosition.x % world.segmentSize)) / world.segmentSize;
  array_wall_position.y = (wallPosition.y - (wallPosition.y % world.segmentSize)) / world.segmentSize;

  // check north
  if (north >= 0) {
    adjacent_walls[0] = world.array[north][array_wall_position.x];
  } else {
    adjacent_walls[0] = 0;
  }

  // check east
  if (east < world.width) {
    adjacent_walls[1] = world.array[array_wall_position.y][east];
  } else {
    adjacent_walls[1] = 0;
  }

  // check south
  if (south < world.height) {
    adjacent_walls[2] = world.array[south][array_wall_position.x];
  } else {
    adjacent_walls[2] = 0;
  }

  // check west
  if (west >= 0) {
    adjacent_walls[3] = world.array[array_wall_position.y][west];
  } else {
    adjacent_walls[3] = 0;
  }

  return adjacent_walls;
}

// convert a vector from pixels to world segments
function posToSegment(position_vector, world) {
  var segment_size = world.segmentSize;
  var segment_vector = createVector(0, 0);

  segment_vector.x = ((position_vector.x) - ((position_vector.x) % segment_size)) / segment_size;
  segment_vector.y = ((position_vector.y) - ((position_vector.y) % segment_size)) / segment_size;

  return segment_vector
}
