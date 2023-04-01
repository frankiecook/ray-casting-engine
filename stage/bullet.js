/*
Bullet Class

*/

class Bullet extends Entity {
  constructor(name, weapon) {
    super(name),
      this.weapon = weapon,
      this.position_b,
      this.normal,
      this.position_a,

      // variables for equation 
      this.slope,
      this.intercept,
      this.speed = 1,
      this.collision,

      this.setup(),
      this.update()
  }

  /** SET **/

  /** GET **/

  /** Setup **/
  setup() {
    // set the positions
    // position a is the orignal firing location of the bullet
    // position b is the changing position along the trajectory
    let x_b = this.weapon.owner.getPosition().x + this.weapon.owner.getNormal();
    let y_b = this.weapon.owner.getPosition().y + this.weapon.owner.getNormal();

    let x_a = this.weapon.owner.getPosition().x;
    let y_a = this.weapon.owner.getPosition().y;

    this.position_a = createVector(x_a, y_a);
    this.position_b = createVector(x_b, y_b);

    // set the normal 
    let x_n = this.weapon.owner.getNormal().x;
    let y_n = this.weapon.owner.getNormal().y;

    this.normal = createVector(x_n, y_n);

    // create the equation
    // slope
    if (this.normal.x != 0) {
      this.slope = y_n / x_n;

      // intercept
      // y = m * x + b
      this.intercept = 0;// y_a / (this.slope * x_a);

    } else {
      this.slope = 0;

      // intercept
      // x = m * y + b;
      this.intercept = 0;// x_a / (this.slope * y_a);
    }
  }

  update() {
    // update position every frame
    // check collision every frame
    // for checking the collision i need to create line segments along the trajectory
    // check these line segments for collisions
    // will involve creating an equation for the lines

    // temporary
    let increment_x = createVector(0, 0);
    let increment_y = createVector(0, 0);
    let mag_incr_x = magnitude2DVector(increment_x);
    let mag_incr_y = magnitude2DVector(increment_y);
    let position = createVector(this.weapon.owner.getPosition().x, this.weapon.owner.getPosition().y);
    let collision = false;
    let check_incr_y = false;
    let check_incr_x = false;

    /*// find collision 
      if (this.normal.x != 0) {
        // y = m * x + b

        console.log("checking for loop");
        console.log(
        while (!collision && (check_incr_x || check_incr_y)) {
          copy2DVector(position, this.weapon.owner.getPosition());

          // determine which check condition is greater 
          if (mag_incr_x <= mag_incr_y) {
            // increase x
            increment_x.x += world.segmentSize * (this.normal.x / Math.abs(this.normal.x));

            // calculate intercept
            increment_x.y = this.slope * increment_x.x + this.intercept;

            // check collision
            add2DVectors(position, increment_x);
            console.log(position);
            console.log(increment_x);
            if (world.collisionCheckVectorWorld(position)) {
              collision = true;
              this.collision = world.convertWorldCoordsToSegCoords(position);
              this.collision = createVector(Math.trunc(this.collision.x / world.segmentSize), Math.trunc(this.collision.y / world.segmentSize));
            }

            //update magnitude
            mag_incr_x = magnitude2DVector(increment_x);

            //

          } else {
            // increase y
            console.log("y");
            increment_y.y += world.segmentSize * (this.normal.y / Math.abs(this.normal.y));

            // calculate intercept
            increment_y.x = (increment_y.y - this.intercept) / this.slope;

            // check collision
            add2DVectors(position, increment_y);
            if (world.collisionCheckVectorWorld(position)) {
              collision = true;
              this.collision = world.convertWorldCoordsToSegCoords(position);
              this.collision = createVector(Math.trunc(this.collision.x / world.segmentSize), Math.trunc(this.collision.y / world.segmentSize));
            }

            mag_incr_y = magnitude2DVector(increment_y);
          }
      } else {
        // 
        console.log("slope is undefined");
        while (!collision) {

          collision = true;
        }
      }*/

    // instantiate a ray
    let ray = new Ray(this.normal, createVector(0, 0));
    ray.name = "bullet";

    let casted_ray = world.player.camera.castRay(ray, world);

    let cur_pos = createVector(this.position_a.x, this.position_a.y);
    let convert_pos = createVector((cur_pos.x - (cur_pos.x % world.segmentSize)) / world.segmentSize, (cur_pos.y - (cur_pos.y % world.segmentSize)) / world.segmentSize);

    let x = casted_ray.collisionWallSegmentPos.x;
    let y = casted_ray.collisionWallSegmentPos.y;
    if (x > world.array[0].length - 1) { console.log("x is out of bounds"); }
    if (y > world.array.length - 1) { console.log("y is out of bounds"); }
    if (x != 0 && y != 0 && x != world.width-1 && y != world.height-1) {
      world.array[y][x] = 0;
    }
  }

  fire() {
    //let ray = new Ray(this.name, this.normal, this.position);

    // cast ray

  }
}