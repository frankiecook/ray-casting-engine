/*
PLAYER
Refactor Date: 11/11/21

Description:
class for player

Data
position: player position
normal: player normal
visualNormanlMagnitude: magnitude of the normal when rendering the player
velocity: player velocity
angularVelocity: player angular velocity
radius: collision radius of player
rayLength: length of each ray?
surrounding: surrounding area around the player
*/

// class syntax helps simplify method construction
class Player extends Character {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    super(name),
      this.movement = createVector(0, 0),
      this.future_position = createVector(0, 0),
      this.future_check = createVector(0, 0),
      this.angularVelocity = 0.43,
      this.camera,
      this.surrounding = new Array(9),
      this.weapon,
      this.isMobile = false
  }

  // initialize the player
  setup(world) {

    this.setRadius(10);
    this.setInventoryLength(0);
    this.setVelocity(2.2);
  }

  setPosition(x, y) {
    super.setPosition(x, y);
    this.camera.setPosition(x, y);
  }

  setNormal(x, y) {
    super.setNormal(x, y);
    this.camera.setNormal(x, y);
  }

  setMovement(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      this.movement.x = x;
      this.movement.y = y;
    } else {
      throw new Error(this.name + " movement not a number");
    }
  }

  setAngularVelocity(n) {
    if (typeof n === 'number') {
      this.angularVelocity = n;
    } else {
      throw new Error(this.name + " angular velocity not a number");
    }
  }

  setFuturePosition(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      this.future_position.x = x;
      this.future_position.y = y;
    } else {
      throw new Error(this.name + " future position not a number");
    }
  }

  setFutureCheck(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      this.future_check.x = x;
      this.future_check.y = y;
    } else {
      throw new Error(this.name + " future check not a number");
    }
  }

  attachCamera(camera) {
    this.camera = camera;

    this.camera.setPosition(this.position.x, this.position.y);
    this.camera.setNormal(this.normal.x, this.normal.y);
    this.camera.setup();
  }



  update(world, camera) {
    /* * * * * * * * * * *
    Update the Surroundings
    * * * * * * * * * * */
    updateSurroundings(this.surrounding, this.position, world.array, world.segmentSize);

    // Check if key A or D is pressed and adjust the normal accordingly
    // KEY [65]: A
    // KEY [68]: D
    if (keyIsDown(LEFT_ARROW)) {
      this.movement.x = -1;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.movement.x = 1;
    } else if (!this.isMobile) {
      this.movement.x = 0;
    }

    // update player's position
    if (keyIsDown(UP_ARROW)) {
      this.movement.y = 1;
    } else if (keyIsDown(DOWN_ARROW)) {
      this.movement.y = -1;
    } else if (!this.isMobile) {
      this.movement.y = 0;
    }

    //normalize movement
    normalize2DVector(this.movement);

    // rotate the movement vector based off of the normal vector angle
    var theta;

    if (this.normal.x * this.normal.y >= 0) {
      theta = abs(atan(this.normal.x / this.normal.y));

      if (this.normal.x <= 0) {
        theta += Math.PI;
      }
    } else {
      theta = abs(atan(this.normal.y / this.normal.x));

      if (this.normal.x >= 0) {
        theta += Math.PI / 2;
      } else {
        theta += 3 * Math.PI / 2;
      }
    }

    // future position, and future check have to be different becuase the check has to account for the radius
    copy2DVector(this.future_position, this.movement);
    this.future_position.x = 0;
    rotation2DVector(this.future_position, -1 * theta);
    normalize2DVector(this.future_position);
    scalar2DVector(this.future_position, this.velocity);
    add2DVectors(this.future_position, this.position);
    
    // update surroundings before the collision check
    // using the future position of the player
    updateSurroundings(this.surrounding, this.future_position, world.array, world.segmentSize);

    // Easiest Collision Check
    collisionCheckRectangleWorld(this.surrounding, this.future_position, this.radius, world.segmentSize);

    // rotate the player
    this.rotateNormal(this.movement.x * PI / 32);
    this.setPosition(this.future_position.x, this.future_position.y);

    // key [32]: SPACE BAR
    if (keyIsDown(32)) {
      this.weapon.fire();
    }

    // check collision with items and characters in the world
    for (var i in world.inventory) {
      if (world.inventory[i] != undefined || null) {
        if (world.inventory[i].isCollectible) {

          var rax = this.position.x;
          var ray = this.position.y;
          var ras = this.radius;

          var rbx = world.inventory[i].position.x;
          var rby = world.inventory[i].position.y;
          var rbs = world.inventory[i].radius;
          var temp_arr = [rax, ray, ras, rbx, rby, rbs];

          if (collisionRectangleRectangle(rax, ray, ras, ras, rbx, rby, rbs, rbs)) {
            var current_item = world.inventory[i];
            world.delItem(current_item);
            this.addItem(current_item);
          }
        }
      }
    }

    // update controls GUI
    updateControls();
  }
}
