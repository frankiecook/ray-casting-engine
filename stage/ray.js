/*
RAY
A class for defining rays

position: the end point of a ray in world coordinates
normal: direction of the ray
origin: world position that the ray was cast from
*/

class Ray {
  constructor(position, normal, origin) {
    this.position = createVector(position.x, position.y),
    this.normal = createVector(normal.x, normal.y),
    this.origin = createVector(origin.x, origin.y),
    this.wall = new Wall(),
    this.collisionOrigin = createVector(0, 0)
  }
}
