// PLAYER DATA
// pos: player position
// rot: player rotation
// vel: player velocity
// angVel: player angular velocity
// colRadius: collision radius of player
// normanlMag: magnitude of the normal vector
//

function newPlayer() {

  var player = {
    pos: createVector(0,0),
    rot: createVector(0,0),
    vel: 1,
    angVel: 0.8,
    colRadius: 8,
    normalMag: 15,
    rayLength: 60,
    name: player
  }

  return player
}
