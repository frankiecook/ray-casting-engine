/*
PHYSICS
functions for calculating physics
*/



// world variable is temporary for debugging
function collisionCheck(futurePos, player, world) {
  var currentPlayerChunkPos = posToSegment(player.position, world);
  var futurePlayerChunkPos = posToSegment(futurePos, world);
  var walls = new Array(9);

  for (col=0; col<3; col++) {
    for (row=0; row<3; row++) {
      var place = row+col*3;
      walls[row + col*3] = createVector(currentPlayerChunkPos.x+(col-1), currentPlayerChunkPos.y+(row-1));
    }
  }

  // decision
  if (world.array[futurePlayerChunkPos.y][futurePlayerChunkPos.x] == 0) {
    return false
  } else {
    return true
  }
}

// world variable is temporary for debugging
function collisionRay(ray, world) {
  var position = createVector(0, 0);
  copy2DVector(position, ray.position);
  var rayChunkPos = posToSegment(position, world);

  // decision
  if (world.array[rayChunkPos.y][rayChunkPos.x] == 0) {
    return false
  } else {
    // find the projection of the collision coordinate onto the intersected wall
    collisionProj(ray, world);

    return true
  }
}

function collisionCheckPosition(pos, world) {
  var position = createVector(0, 0);
  copy2DVector(position, pos);


  var rayChunkPos = posToSegment(position, world);
  console.log("RCP " + posToSegment(position, world));
  // check if the ray segment position is out of bounds
  if (rayChunkPos.x >= 0 && rayChunkPos.y >= 0 &&
      rayChunkPos.x < world.array[0].length && rayChunkPos.y < world.array.length) {
        // decision
        if (world.array[rayChunkPos.y][rayChunkPos.x] == 0) {
          return false
        } else {
          // find the projection of the collision coordinate onto the intersected wall
          //collisionProj(position, world);

          return true
        }
      } else {
        console.log("RAY IS O U T O F B O U N D S");
        return true
      }

}

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
  //copy2DVector(ray.collisionOrigin, collision_origin);

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
  var collision_origin = ray.collision_face_origin;//createVector(ray.collision_face_origin.x, ray.collision_face_origin.y);
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

function collisionProj(ray, world) {
  var vectorA = createVector(0, 0);
  var vectorB = createVector(0, 0);

  // calculate vector A
  // current ray position from canvas origin minus
  // current collision origin from canvas origin
  var worldRayPosition = ray.position;
  var worldCollisionOrigin = ray.collision_face_origin;

  copy2DVector(vectorA, worldCollisionOrigin);
  vectorA = multiply2DVectors(vectorA, -1);
  add2DVectors(vectorA, worldRayPosition);

  // calculate vector B
  // end of the vector (wall) that the ray collided with
  vectorB.x = 0;
  vectorB.y = 50;

}

function checkAdjacentWalls(wallPosition, world) {
  var arrayWallPosition = createVector((wallPosition.x - (wallPosition.x % world.segmentSize)) / world.segmentSize, (wallPosition.y - (wallPosition.y % world.segmentSize)) / world.segmentSize)
  var adjacentWalls = new Array(4);

  // check top
  var top = arrayWallPosition.y - 1;
  if (top >= 0) {
    adjacentWalls[0] = world.array[top][arrayWallPosition.x];
  } else {
    adjacentWalls[0] = 0;
  }
  // check right
  var right = arrayWallPosition.x + 1;
  if (right < world.width) {
    adjacentWalls[1] = world.array[arrayWallPosition.y][right];
  } else {
    adjacentWalls[1] = 0;
  }
  // bottom
  var bottom = arrayWallPosition.y + 1;
  if (bottom < world.height) {
    adjacentWalls[2] = world.array[bottom][arrayWallPosition.x];
  } else {
    adjacentWalls[2] = 0;
  }
  // left
  var left = arrayWallPosition.x - 1;
  if (left >= 0) {
    adjacentWalls[3] = world.array[arrayWallPosition.y][left];
  } else {
    adjacentWalls[3] = 0;
  }

  return adjacentWalls;
}

// convert a vector from pixels to world segments
function posToSegment(vec1, world) {
  var x = ((vec1.x) - ((vec1.x) % world.segmentSize)) / world.segmentSize;
  var y = ((vec1.y) - ((vec1.y) % world.segmentSize)) / world.segmentSize;
  var newVector = createVector(x, y);

  return newVector
}
